'use strict';

var express = require('express');
var mongoose = require('mongoose');

var Event = require('./../event/event.model');
var Comment = require('./comment.model');
var User = require('./../user/user.model');
var Application = require('./../application/application.model');
var auth = require('./../auth/authentication.service');
var commentService = require('./comment.service/comment.service.proxy');

var commentCtrl = express.Router();

commentCtrl
    .use(auth.authentication)
	.post('', commentEvent)
	.post('/reply', replyToComment)
	.get('/:eventId', getComments);

/**
 * Create new comment on event and saves it to DB.
 * 
 * @param {Object} req    - Request object that contains owning's event id and new comment object.
 * @param {Object} res    - Response object that contains newly created comment and returns it to user.
 * @param {Function} next - Callback function that represents next function in chain.
 */
function commentEvent (req, res, next) {

    var loggedInUserId = req.loggedInUser.id;
    var eventId = req.body.eventId;
	var comment = req.body.comment;
	comment.user = req.loggedInUserId;
	

	commentService.commentEvent(comment, eventId, loggedInUserId, onCommentCreated, onError);

	function onCommentCreated (comment) {
		res.json(comment);
	}

	function onError (error) {
        return next(error);
	}

} 

/**
 * Create new reply on comment and saves it to DB.
 * 
 * @param {Object} req    - Request object that contains owning's comment id and new comment object.
 * @param {Object} res    - Response object that contains newly created comment and will be returned to user.
 * @param {Function} next - Callback function that represents next function in chain.
 */
function replyToComment (req, res, next) {

    var owningCommentId = req.body.owningCommentId;
	var comment = new Comment(req.body.comment);

	commentService.replyToComment(comment, owningCommentId, onCommentCreated, onError);

	function onCommentCreated (comment) {
		res.json(comment);
	}

	function onError (error) {
		return next(error);
	}

}
	
/**
 * Returns comments page.
 * 
 * @param {Object} req    - Request object that contains event id and page number.
 * @param {Object} res    - Response object that contains comments page and will be returned to user.
 * @param {Function} next - Callback function that represents next function in chain.
 */
function getComments (req, res, next) {

    var loggedInUserId = req.loggedInUser.id;
    var eventId = req.params.eventId;
	var pageNo = req.query.page;

	commentService.getComments(eventId, pageNo, loggedInUserId, onGetComments, onError);

	function onGetComments (comments) {
		res.json(comments);
	}

	function onError (error) {
		return next(error);
	}

}

module.exports = commentCtrl;