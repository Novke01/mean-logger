'use strict';

var sanitize = require('mongo-sanitize');

var service = require('./user.service');

var handler = {
    
    get: function (target, property, receiver) {
        if (property === 'getUserById') {
            return function (id, onSuccess, onError) {
                return getUserById(id, onSuccess, onError, target.getUserById);
            };
        }
        else if (property === 'getUserByEmail') {
            return function (email, onSuccess, onError) {
                return getUserByEmail(email, onSuccess, onError, target.getUserByEmail);
            };
        }
        else if (property === 'createUser') {
            return function (user, onSuccess, onError) {
                return createUser(user, onSuccess, onError, target.createUser);
            };
        }
        else if (property === 'verifyUser') {
            return function (verificationToken, onSuccess, onError) {
                return verifyUser(verificationToken, onSuccess, onError, target.verifyUser);
            };
        }
        else if (property === 'loginUser') {
            return function (loginData, onSuccess, onError) {
                return loginUser(loginData, onSuccess, onError, target.loginUser);
            };
        }
        else if (property === 'refreshAccessToken') {
            return function (refreshToken, onSuccess, onError) {
                return refreshAccessToken(refreshToken, onSuccess, onError, target.refreshAccessToken);
            };
        }
        else {
            return target[property];
        }
    }

};

var proxy = new Proxy(service, handler);

/**
 * Fetches user from database by id.
 * 
 * @param {String} id                 - User's id.
 * @param {Function} onSuccess        - Callback function that will be called on operation success.
 * @param {Function} onError          - Callback function that will be called on error.
 * @param {Function} originalFunction - Original function.
 */
function getUserById (id, onSuccess, onError, originalFunction) {
    id = sanitize(id);
    return originalFunction(id, onSuccess, onError);
}

/**
 * Fetches user from database by email.
 * 
 * @param {String} email              - User's email address.
 * @param {Function} onSuccess        - Callback function that will be called on operation success.
 * @param {Function} onError          - Callback function that will be called on error.
 * @param {Function} originalFunction - Original function.
 */
function getUserByEmail (email, onSuccess, onError, originalFunction) {
    email = sanitize(email);
    return originalFunction(email, onSuccess, onError);
}

/**
 * Creates user in database.
 * 
 * @param {Object} user               - User object. 
 * @param {Function} onSuccess        - Callback function that will be called on operation success.
 * @param {Function} onError          - Callback function that will be called on error.
 * @param {Function} originalFunction - Original function.
 */
function createUser (user, onSuccess, onError, originalFunction) {
    user = sanitize(user);
    return originalFunction(user, onSuccess, onError);
}

/**
 * Verifies user's account.
 * 
 * @param {String} verificationToken  - User's verification token.
 * @param {Function} onSuccess        - Callback function that will be called on operation success.
 * @param {Function} onError          - Callback function that will be called on error.
 * @param {Function} originalFunction - Original function.
 */
function verifyUser (verificationToken, onSuccess, onError, originalFunction) {
    verificationToken = sanitize(verificationToken);
    return originalFunction(verificationToken, onSuccess, onError);
}

/**
 * Log's in user and returns access and refresh token.
 * 
 * @param {Object} loginData          - User's login input.
 * @param {Function} onSuccess        - Callback function that will be called on operation success.
 * @param {Function} onError          - Callback function that will be called on error.
 * @param {Function} originalFunction - Original function.
 */
function loginUser (loginData, onSuccess, onError, originalFunction) {
    loginData = sanitize(loginData);
    return originalFunction(loginData, onSuccess, onError);
}

/**
 * Return's new access token.
 * 
 * @param {String} refreshToken       - User's refresh token.
 * @param {Function} onSuccess        - Callback function that will be called on operation success.
 * @param {Function} onError          - Callback function that will be called on error.
 * @param {Function} originalFunction - Original function.
 */
function refreshAccessToken (refreshToken, onSuccess, onError, originalFunction) {
    refreshToken = sanitize(refreshToken);
    return originalFunction(refreshToken, onSuccess, onError);
}

module.exports = proxy;