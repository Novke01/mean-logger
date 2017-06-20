'use strict';

var express = require('express');

var Application = require('./application.model');
var auth = require('./../auth/authentication.service');
var userRole = require('./user-role.model');

var applicationService = require('./application.service/application.service.proxy');

var applicationCtrl = express.Router();

applicationCtrl
    .use(auth.authentication)
	.post('/create', createApp)
	.put('/add-user', addUserToApp)
	.get('/my', getAvailableApplications)
	.get('/:applicationId', getApp)
	.delete('/:applicationId', deleteApp)
	.put('/remove-user', removeUserFromApp);

/** 
 * Create user's application and save it in DB.
 * 
 * @param {Object} req    - Request object that contains application object in body.
 * @param {Object} res    - Response object that is returned to user.
 * @param {Function} next - Function that represents next function in chain.
 */
function createApp (req, res, next) {

    var ownerId = req.loggedInUser.id;
	var ownerEmail = req.loggedInUser.email;
    var newApplication = req.body;
	applicationService.createApplication(ownerId, ownerEmail, newApplication, onCreateSuccess, onError);

    function onCreateSuccess (newApplication) {
        res.json(newApplication);
	}

	function onError (error) {
        return next(error);
	}
    
}

/**
 * Connects user with app in DB and sends him e-mail.
 * 
 * @param {Object} req    - Request object that contains new user's email and application's dsn in body.
 * @param {Object} res    - Response object that is returned to user.
 * @param {Function} next - Function that represents next function in chain.
 */
function addUserToApp (req, res, next) {

	var ownerEmail = req.loggedInUser.email;
	var applicationId = req.body.appId;
	var userEmail = req.body.email;

	if (ownerEmail === userEmail) {
		return next({
			message: 'You cannot add yourself to application.',
			code:    403
		});
	}

    applicationService.addUserToApplication(userEmail, applicationId, ownerEmail, onAddUserSuccess, onError);

	function onAddUserSuccess (userRole) {
        res.json(userRole);
    }

	function onError (error) {
        return next(error);
	}

}

/**
 * Fetches available application for logged in user.
 * 
 * @param {Object} req    - Request object that contains logged in user data and applications page number.
 * @param {Object} res    - Response object that is returned to user.
 * @param {Function} next - Function that represents next function in chain.
 */
function getAvailableApplications (req, res, next) {

    var loggedInUserId = req.loggedInUser.id;
	var pageNo = req.query.page;
    applicationService.getApplicationsForUser(loggedInUserId, pageNo, onGetApplicationsSuccess, onError);

    function onGetApplicationsSuccess (applications) {
        res.json(applications);
	}

	function onError (error) {
        return next(error);
	}

}

/**
 * Fetches applications data and events that logged in user has access to.
 * 
 * @param {Object} req    - Request object that contains logged in user and application id.
 * @param {Object} res    - Response object that is returned to user.
 * @param {Function} next - Function that represents next function in chain.
 */
function getApp (req, res, next) {

	var loggedInUserId = req.loggedInUser.id;
	var applicationId = req.params.applicationId;
	
    applicationService.getApplicationById(applicationId, onGetApplicationSuccess, onError);		

	function onGetApplicationSuccess (application) {
		var user = application.users.find(function (element) {
            return element.userId.toString() === loggedInUserId;
		});
		if (!user) {
			return next({
				'message': 'Access denied.',
				'code':    403
			});
		}
		res.json(application);
	}

	function onError (error) {
		return next(error);
	}

}

/**
 * Delete application from DB.
 * 
 * @param {Object} req    - Request object that contains application id.
 * @param {Object} res    - Response object that will be returned to user.
 * @param {Function} next - Callback function that represents next function in chain.
 */
function deleteApp (req, res, next) {

    var loggedInUser = req.loggedInUser;
	var applicationId = req.params.applicationId;

	applicationService.deleteApplication(applicationId, onDeleteApplication, onError);

	function onDeleteApplication (application) {
		res.json({
			'message': 'Application deleted successfully.'
		});
	}

	function onError (error) {
		return next(error);
	}

}

/**
 * Removes user from application.
 * 
 * @param {Object} req    - Request object that contains application's id and user's id.
 * @param {Object} res    - Response object that contains application object and is returned to user.
 * @param {Function} next - Callback function that represents next function in chain.
 */
function removeUserFromApp (req, res, next) {

    var loggedInUser = req.loggedInUser;
	var applicationId = req.body.applicationId;
	var userId = req.body.userId;

	applicationService.removeUserFromApplication(userId, applicationId, onRemoveUser, onError);

	function onRemoveUser (application) {
        res.json(application);
	}

	function onError (error) {
		return next(error);
	}

}

module.exports = applicationCtrl;