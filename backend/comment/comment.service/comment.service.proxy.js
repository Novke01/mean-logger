'use strict';

var sanitize = require('mongo-sanitize');

var service = require('./comment.service');

var handler = {
    
    get: function (target, property, receiver) {
        if (property === 'commentEvent') {
            return function (comment, eventId, userId, onSuccess, onError) {
                return commentEvent(comment, eventId, userId, onSuccess, onError, target.commentEvent);
            };
        }
        else if (property === 'replyToComment') {
            return function (comment, commentId, onSuccess, onError) {
                return replyToComment(comment, commentId, onSuccess, onError, target.replyToComment);
            };
        }
        else if (property === 'getComments') {
            return function (eventId, pageNo, userId, onSuccess, onError) {
                return getComments(eventId, pageNo, userId, onSuccess, onError, target.getComments);
            };
        }
        else {
            return target[property];
        }
    }

};

var proxy = new Proxy(service, handler);

/**
 * Creates comment for event.
 * 
 * @param {Object} comment            - Comment object.
 * @param {String} eventId            - Owning event id.
 * @param {String} userId             - User's id.
 * @param {Function} onSuccess        - Callback function that will be called on operation success.
 * @param {Function} onError          - Callback function that will be called on error.
 * @param {Function} originalFunction - Original function.
 */
function commentEvent (comment, eventId, userId, onSuccess, onError, originalFunction) {
    comment = sanitize(comment);
    eventId = sanitize(eventId);
    return originalFunction(comment, eventId, userId, onSuccess, onError);
}

/**
 * Creates comment for comment.
 * 
 * @param {Object} comment            - Comment object.
 * @param {String} commentId          - Owning comment's id.
 * @param {Function} onSuccess        - Callback function that will be called on operation success.
 * @param {Function} onError          - Callback function that will be called on error.
 * @param {Function} originalFunction - Original function.
 */
function replyToComment (comment, commentId, onSuccess, onError, originalFunction) {
    comment = sanitize(comment);
    commentId = sanitize(commentId);
    return originalFunction(comment, commentId, onSuccess, onError);
}

/**
 * Returnes comments for event.
 * 
 * @param {String} eventId            - Owning event's id.
 * @param {Number} pageNo             - Page number.
 * @param {String} userId             - User's id.
 * @param {Function} onSuccess        - Callback function that will be called on operation success.
 * @param {Function} onError          - Callback function that will be called on error.
 * @param {Function} originalFunction - Original function.
 */
function getComments (eventId, pageNo, userId, onSuccess, onError, originalFunction) {
    eventId = sanitize(eventId);
    pageNo = sanitize(pageNo);
    return originalFunction(eventId, pageNo, userId, onSuccess, onError);
}

module.exports = proxy;