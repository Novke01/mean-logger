'use strict';

var sanitize = require('mongo-sanitize');

var service = require('./application.service');

var handler = {

    get: function (target, property, receiver) {
        if (property === 'getApplicationById') {
            return function (applicationId, onSuccess, onError) {
                return getApplicationById(applicationId, onSuccess, onError, target.getApplicationById)
            };
        }
        else if (property === 'createApplication') {
            return function (ownerId, ownerEmail, application, onSuccess, onError) {
                return createApplication(ownerId, ownerEmail, application, onSuccess, onError, target.createApplication);
            };
        }
        else if (property === 'deleteApplication') {
            return function (applicationId, onSuccess, onError) {
                return deleteApplication(applicationId, onSuccess, onError, target.deleteApplication);
            };
        }
        else if (property === 'addUserToApplication') {
            return function (userEmail, applicationId, ownerEmail, onSuccess, onError) {
                return addUserToApplication(userEmail, applicationId, ownerEmail, onSuccess, onError, target.addUserToApplication);
            };
        }
        else {
            return target[property];
        }
    }

};

var proxy = new Proxy(service, handler);

/**
 * Validates and sanitizes input for getApplicationById function.
 * 
 * @param {String} applicationId      - Application's id.
 * @param {Function} onSuccess        - Callback function that is called on operation success.
 * @param {Function} onError          - Callback function that is called on error.
 * @param {Function} originalFunction - Original function that is wrapped.
 */
function getApplicationById (applicationId, onSuccess, onError, originalFunction) {
    applicationId = sanitize(applicationId);
    return originalFunction(applicationId, onSuccess, onError);
}

/**
 * Validates and sanitizes input for createApplication function.
 * 
 * @param {String} ownerId            - Owner's id.
 * @param {String} ownerEmail         - Owner's email.
 * @param {Application} application   - New application object.
 * @param {Function} onSuccess        - Callback function that is called on operation success.
 * @param {Function} onError          - Callback function that is called on error.
 * @param {Function} originalFunction - Original function that is wrapped.
 */
function createApplication (ownerId, ownerEmail, application, onSuccess, onError, originalFunction) {
    ownerId = sanitize(ownerId);
    ownerEmail = sanitize(ownerEmail);
    application = sanitize(application);
    return originalFunction(ownerId, ownerEmail, application, onSuccess, onError);
}

/**
 * Validates and sanitizes input for deleteApplication function.
 * 
 * @param {String} applicationId      - Application's id.
 * @param {Function} onSuccess        - Callback function that is called on operation success.
 * @param {Function} onError          - Callback function that is called on error.
 * @param {Function} originalFunction - Original function that is wrapped.
 */
function deleteApplication (applicationId, onSuccess, onError, originalFunction) {
    applicationId = sanitize(applicationId);
    return originalFunction(applicationId, onSuccess, onError);
}

/**
 * Validates and sanitizes input for addUserToApplication function.
 * 
 * @param {String} userEmail          - Email of user that will be added.
 * @param {String} applicationId      - Id of application to which user will be added.
 * @param {String} ownerEmail         - Email of application's owner.
 * @param {Function} onSuccess        - Callback function that is called on operation success.
 * @param {Function} onError          - Callback function that is called on error.
 * @param {Function} originalFunction - Original function that is wrapped.
 */
function addUserToApplication(userEmail, applicationId, ownerEmail, onSuccess, onError, originalFunction) {
    if (userEmail === ownerEmail) {
        return onError({
            message: 'You cannot add yourself to application.',
            code:    403
        });
    }
    userEmail = sanitize(userEmail);
    applicationId = sanitize(applicationId);
    return originalFunction(userEmail, applicationId, ownerEmail, onSuccess, onError);
}

module.exports = proxy;