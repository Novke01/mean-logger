'use strict';

var express = require('express');
var mongoose = require('mongoose');

var Application = require('./../application/application.model');
var Event = require('./event.model');
var mailSender = require('./../mail.sender');
var auth = require('./../auth/authentication.service');
var eventService = require('./event.service/event.service.proxy');


var eventCtrl = express.Router();

eventCtrl
	.post('', createEvent)
	.use(auth.authentication)
	.get('/one/:eventId', getEvent) 
	.get('/:applicationId', getEvents);

/**
 * Creates new event and saves it to DB.
 * 
 * @param {Object} req    - Request object that contains new event data.
 * @param {Object} res    - Response object that returnes newly created event.
 * @param {Function} next - Callback function that represents next function in chain.
 */
function createEvent (req, res, next) {

	var event = req.body.event;
    var applicationKey = req.body.applicationKey;

	eventService.createEvent(applicationKey, event, onEventCreated, onError);

	function onEventCreated (event) {
		// TODO: Send email.
		res.json(event);
	}

	function onError (error) {
		return next(error);
	}

}

/**
 * Returnes event object.
 * 
 * @param {Object} req    - Request object that contains application id and event id.
 * @param {Object} res    - Response object that will be returned to user.
 * @param {Function} next - Callback function that represents next function in chain.
 */
function getEvent (req, res, next) {

    var loggedInUserId = req.loggedInUser.id;
	var eventId = req.params.eventId;

    eventService.getEvent(eventId, loggedInUserId, onGetEvent, onError);

    function onGetEvent (event) {
        res.json(event);
	}

	function onError (error) {
        return next(error);
	}

}

/**
 * Returnes page of events for application.
 * 
 * @param {Object} req    - Request object that contains application id and page number.
 * @param {Object} res    - Response object with events that will be returned to user.
 * @param {Function} next - Callback function that represents next function in chain.
 */
function getEvents (req, res, next) {

    var loggedInUserId = req.loggedInUser.id;
    var applicationId = req.params.applicationId;
    var pageNo = req.query.page;

	eventService.getEvents(applicationId, pageNo, loggedInUserId, onGetEvents, onError);

	function onGetEvents (events) {
        res.json(events);
	}

	function onError (error) {
        return next(error);
	}

}

module.exports = eventCtrl;