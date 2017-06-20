'use strict';

var sanitize = require('mongo-sanitize');

var service = require('./event.service');

var handler = {
    
    get: function (target, property, receiver) {
        if (property === 'createEvent') {
            return function (applicationKey, event, onSuccess, onError) {
                return createEvent(applicationKey, event, onSuccess, onError, target.createEvent);
            };
        }
        else if (property === 'getEvent') {
            return function (eventId, userId, onSuccess, onError) {
                return getEvent(eventId, userId, onSuccess, onError, target.getEvent);
            };
        }
        else if (property === 'getEvents') {
            return function (applicationId, pageNo, userId, onSuccess, onError) {
                return getEvents(applicationId, pageNo, userId, onSuccess, onError, target.getEvents);
            };
        }
        else {
            return target[property];
        }
    }

};

var proxy = new Proxy(service, handler);

/**
 * Create new event and writes it to database.
 * 
 * @param {String} applicationKey     - Application key.
 * @param {Object} event              - New event object.
 * @param {Function} onSuccess        - Callback function that will be called on operation success.
 * @param {Function} onError          - Callback function that will be called on error.
 * @param {Function} originalFunction - Original function.
 */
function createEvent (applicationKey, event, onSuccess, onError, originalFunction) {
    applicationKey = sanitize(applicationKey);
    event = sanitize(event);
    return originalFunction(applicationKey, event, onSuccess, onError);
}

/**
 * Returns event from database.
 * 
 * @param {String} eventId            - Event's id.
 * @param {String} userId             - User's id.
 * @param {Function} onSuccess        - Callback function that will be called on operation success.
 * @param {Function} onError          - Callback function that will be called on error.
 * @param {Function} originalFunction - Original function.
 */
function getEvent (eventId, userId, onSuccess, onError, originalFunction) {
    eventId = sanitize(eventId);
    return originalFunction(eventId, userId, onSuccess, onError);
}

/**
 * Returns page of events from database.
 * 
 * @param {String} applicationId      - Owning application's id.
 * @param {Number} pageNo             - Page number.
 * @param {String} userId             - User's id.
 * @param {Function} onSuccess        - Callback function that will be called on operation success.
 * @param {Function} onError          - Callback function that will be called on error.
 * @param {Function} originalFunction - Original function.
 */
function getEvents (applicationId, pageNo, userId, onSuccess, onError, originalFunction) {
    applicationId = sanitize(applicationId);
    pageNo = sanitize(pageNo);
    return originalFunction(applicationId, pageNo, userId, onSuccess, onError);
}

module.exports = proxy;