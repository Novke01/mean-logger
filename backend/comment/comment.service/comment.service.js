'use strict';

var Application = require('./../../application/application.model');
var mongoose = require('mongoose');

var commentService = {
    commentEvent:   commentEvent,
    replyToComment: replyToComment,
    getComments:    getComments
};

var pageSize = 20;

/**
 * Creates new comment on event and saves it to DB.
 * 
 * @param {Object} comment     - New comment object.
 * @param {String} eventId     - Owning event id.
 * @param {String} userId      - User's id.
 * @param {Function} onSuccess - Callback function that will be called on successful operation.
 * @param {Function} onError   - Callback function that will be called on error.
 */
function commentEvent (comment, eventId, userId, onSuccess, onError) {

    comment.user = userId;

    Application.findOne({
        'events._id': eventId,
        'users.userId': userId
    })
    .populate('events.comments.user')
    .exec(onGetApplication);

    function onGetApplication (error, application) {
        if (error) return onError(error);
        var event = application.events.id(eventId);
        event.comments.unshift(comment);
        application.save(function (error) { onSaveApplication(error, application); });
    }

    function onSaveApplication (error, application) {
        if (error) return onError(error);
        onSuccess(application.events.id(eventId).comments[0]);
    }

}

/**
 * Create and save reply to comment.
 * 
 * @param {Object} comment     - Comment object that will be created.
 * @param {String} commentId   - Owning comment's id.
 * @param {Function} onSuccess - Callback function that will be called on operation success.
 * @param {Function} onError   - Callback function that will be called on error.
 */
function replyToComment (comment, commentId, onSuccess, onError) {
    
    Application.findOne({
        'events.comments._id': commentId
    }).exec(onGetApplication);

    function onGetApplication (error, application) {
        if (error) return onError(error);
        var event = application.events.find(function (element) {
            var comment = element.id(commentId);
            return comment !== undefined && comment !== null;
        });
        var owningComment = event.id(commentId);
        owningComment.comments.push(comment);
        application.save(function (error) { onSaveApplication(error, comment); });
    }

    function onSaveApplication (error, comment) {
        if (error) return onError(error);
        onSuccess(comment);
    }

}

/**
 * Returns page of comments.
 * 
 * @param {String} eventId     - Event's id.
 * @param {Number} pageNo      - Number of comments page.
 * @param {String} userId      - User's id.
 * @param {Function} onSuccess - Callback function that will be called on successful operation.
 * @param {Function} onError   - Callback functino that will be called on error.
 */
function getComments (eventId, pageNo, userId, onSuccess, onError) {

    Application.findOne({
        'events._id': eventId,
        'users.userId': userId
    })
    .populate('events.comments.user')
    .exec(onGetApplication);

    function onGetApplication (error, application) {
        if (error) return onError(error);
        if (!application) return onError({
            message: 'Application not found.',
            code:    404
        });
        var event = application.events.id(eventId);
        var commentsPage = event.comments.slice(pageNo * pageSize, (pageNo + 1) * pageSize);
        onSuccess({
            page: commentsPage,
            total: event.comments.length,
            pageSize: pageSize
        });
    }

}

module.exports = commentService;