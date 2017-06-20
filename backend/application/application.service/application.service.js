'use strict';

var User = require('./../../user/user.model');
var Application = require('./../application.model');
var userRole = require('./../user-role.model');
var mongoose = require('mongoose');

var applicationService = {

    getApplicationById:        getApplicationById,
    createApplication:         createApplication,
    deleteApplication:         deleteApplication,
    addUserToApplication:      addUserToApplication,
    getApplicationsForUser:    getApplicationsForUser,
    removeUserFromApplication: removeUserFromApplication

};

var pageSize = 20;

/**
 * Get application by id.
 * 
 * @param {String} applicationId - Application's id.
 * @param {Function} onSuccess   - Callback function that is called on operation success.
 * @param {Function} onError     - Callback function that is called on error.
 */
function getApplicationById (applicationId, onSuccess, onError) {

    Application.findOne({
		'_id': applicationId
	})
	.select('-events.comments')
	.slice('events', [0, 20])
	.exec(onApplicationFound);

    function onApplicationFound (error, application) {
        if (error) return onError(error);
	    onSuccess(application);
    }

}

/**
 * Creates new application and persists it in DB.
 * 
 * @param {String} ownerId          - Id of user that is application's creator.
 * @param {String} ownerEmail       - Email of user that is application's creator.
 * @param {Application} application - Application that will be created.
 * @param {Function} onSuccess      - Callback that is called on successful operation.
 * @param {Function} onError        - Callback that is called on error.
 */
function createApplication (ownerId, ownerEmail, application, onSuccess, onError) {

    application = new Application(application);
    application.users.push({
        userId: ownerId,
        email: ownerEmail,
	    role: userRole.roles.owner
	});
    application.save(onApplicationSaved);

    function onApplicationSaved (error) {
        if (error) return onError(error);
        onSuccess(application);
    }

}

/**
 * Delete application from DB.
 * 
 * @param {String} applicationId - Id of application that will be deleted.
 * @param {Function} onSuccess   - Callback function that will be called on operation success.
 * @param {Function} onError     - Callback function that will be called on error.
 */
function deleteApplication (applicationId, onSuccess, onError) {

    Application.findByIdAndRemove(applicationId, onDeleteApplication);

    function onDeleteApplication (error, application) {
        if (error) return onError(error);
        onSuccess(application);
    }

}

/**
 * Private method for adding valid user to valid application.
 * 
 * @param {String} userEmail     - Email of user that will be added.
 * @param {String} applicationId - Id of application to which user will be added.
 * @param {String} ownerEmail    - Email of application's owner.
 * @param {Function} onSuccess   - Callback that is called on successful operation.
 * @param {Function} onError     - Callback that is called on error.
 */
function addUserToApplication (userEmail, applicationId, ownerEmail, onSuccess, onError) {

    var userRoleObj = {
		userId: '',
        email:  userEmail,
	    role:   userRole.roles.participant
	};

    User.findOne({email: userEmail}).exec(onUserFound);

    function onUserFound (error, user) {
        if (error) return onError(error);
        if (!user) return onError({
            message: 'User doesn\'t exist',
            code:    400
        });
        userRoleObj.userId = user._id;
        Application.findById(applicationId)
        .where('users').elemMatch({email: ownerEmail})
        .exec(onApplicationFound);
    }

    function onApplicationFound (error, application) {
        if (error) return onError(error);
        if (!application) return onError({
            message: 'Application doesn\'t exist.',
            code:    404
        });
        var userObj = application.users.find(function (elem) {
            return elem.email === userEmail;
        });
        if (userObj) return onError({
            message: 'User already added.',
            code:    400
        });
        application.users.push(userRoleObj);
        application.save(onApplicationSaved);
    }
    
    function onApplicationSaved (error) {
        if (error) return onError(error);
        onSuccess(userRoleObj);
	}

}

/**
 * Fetches applications that are available for user.
 * 
 * @param {String} userId      - User's id. 
 * @param {Number} pageNo      - Number of applications page.
 * @param {Function} onSuccess - Callback function that is called on operation success.
 * @param {Function} onError   - Callback function that is called on error.
 */
function getApplicationsForUser (userId, pageNo, onSuccess, onError) {
    
    Application
    .where('users').elemMatch({'userId': userId})
    .skip(pageNo * pageSize)
    .limit(pageSize)
	.exec(onApplicationsFound);

    function onApplicationsFound (error, applications) {
        if (error) return onError(error);
        Application
        .where('users').elemMatch({'userId': userId})
        .count()
        .exec(function (error, total) {
            onApplicationsCount(error, applications, total);
        });
	}

    function onApplicationsCount(error, applications, total) {
        if (error) return onError(error);
        onSuccess({
            'page':     applications,
            'total':    total,
            'pageSize': pageSize
        });
    }

}

/**
 * Removes user from application.
 * 
 * @param {String} userId        - Id of user that will be removed from application.
 * @param {String} applicationId - Application's id.
 * @param {Function} onSuccess   - Callback function that will be called on operation success.
 * @param {Function} onError     - Callback function that will be called on error.
 */
function removeUserFromApplication (userId, applicationId, onSuccess, onError) {

    Application.findById(applicationId)
    .exec(onGetApplication);

    function onGetApplication (error, application) {
        
        if (error) return onError(error);

        var usersIndex = application.users.findIndex(function (element) {
            return element.user === userId;
        });
        application.users.splice(usersIndex, 1);

        User.findById(userId).exec(function (error, user) { 
            onGetUser(error, user, application); 
        });

    }

    function onGetUser (error, user, application) {
        if (error) return onError(error);
        var applicationsIndex = user.availableApplications.findIndex(function (element) {
            return element === applicationId;
        });
        user.availableApplications.splice(applicationsIndex, 1);
        user.save(function (error) { onSaveUser(error, user, application); });
    }

    function onSaveUser (error, user, application) {
        if (error) return onError(error);
        application.save(function (error) { onSaveApplication(error, application); });
    }

    function onSaveApplication (error, application) {
        if (error) return onError(error);
        onSuccess(application);
    }

}

module.exports = applicationService;