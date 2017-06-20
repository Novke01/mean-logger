'use strict';

var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var sanitize = require('mongo-sanitize');

var auth = require('./../../auth/authentication.service');
var User = require('./../user.model');

var userService = {
    getUserById:        getUserById,
    getUserByEmail:     getUserByEmail,
    createUser:         createUser,
    verifyUser:         verifyUser,
    loginUser:          loginUser,
    refreshAccessToken: refreshAccessToken
};

/**
 * Fetches user by id from database.
 * 
 * @param {String} id          - User's id.
 * @param {Function} onSuccess - Callback that is called on successful operation.
 * @param {Function} onError   - Callback that is called on error.
 */
function getUserById (id, onSuccess, onError) {
    
    User.findById(id).exec(onUserFound);

    function onUserFound (error, user) {
        if (error) return onError(error);
        onSuccess(user);
    }

}

/**
 * Fetches user by email from database.
 * 
 * @param {String} email       - User's email address.
 * @param {Function} onSuccess - Callback that is called on successful operation.
 * @param {Function} onError   - Callback that is called on error.
 */
function getUserByEmail (email, onSuccess, onError) {

    User.findOne({
        email: email
    })
    .exec(onUserFound);

    function onUserFound (error, user) {
        if (error) return onError(error);
        onSuccess(user);
    }

}

/**
 * Creates new user.
 * 
 * @param {User} user          - User that will be created. 
 * @param {Function} onSuccess - Callback that is called on operation success.
 * @param {Function} onError   - Callback that is called on error.
 */
function createUser (user, onSuccess, onError) {
    
    user = new User(user);

    user.save(onUserSaved);

    function onUserSaved (error) {
        if (error) return onError(error);
        onSuccess(user);
    }

}

/**
 * Verifies newly registered user.
 * 
 * @param {String} verificationToken - User's generated verification token.
 * @param {Function} onSuccess       - Callback function that is called on operation success.
 * @param {Function} onError         - Callback function that is celled on error.
 */
function verifyUser (verificationToken, onSuccess, onError) {

    User.findOne({
        'verificationToken': verificationToken
    })
    .exec(onGetUser);

    function onGetUser (error, user) {
        if (error) return onError(error);
        if (!user) return onError({
            message: 'Invalid token',
            code:    400
        });
        user.verified = true;
        user.save(function (error) { return onUserSaved(error, user); });
    }

    function onUserSaved(error, user) {
        if (error) return onError(error);
        onSuccess(user);
    }

}

/**
 * Logs In user and returnes access token.
 * 
 * @param {Object} loginData   - Log In object that contains username and password. 
 * @param {Function} onSuccess - Callback function that is called on operation success. 
 * @param {Function} onError   - Callback function that is called on error.
 */
function loginUser (loginData, onSuccess, onError) {

    User.findOne({
        'email': loginData.email,
    })
    .exec(onUserFound);

    function onUserFound (error, user) {
        if (error) return onError(error);
        if (!user) return onError({
            message: 'User not found.',
            code:    400
        });
        bcrypt.compare(loginData.password, user.password, function (error, result) { 
            onPasswordsCompared(error, result, user); 
        });
    }

    function onPasswordsCompared (error, result, user) {
        
        if (error) return onError(error);
        if (!result) {
            return onError({
                'message': 'Wrong password!',
                'code':    400
            });
        }

        jwt.sign({
            'id':        user._id,
            'email':     user.email,
            'firstName': user.firstName,
            'lastName':  user.lastName
        }, 
        auth.secret,
        {
            'expiresIn': 1 * 60        // One hour
        },
        function (error, token) {
            onSignFinished(error, token, user.refreshToken); 
        });
        
    }

    function onSignFinished (error, accessToken, refreshToken) {
        if (error) return onError(error);
        onSuccess({
            'access-token': accessToken,
            'refresh-token': refreshToken
        });
    }

}

/**
 * Returnes new access token.
 * 
 * @param {String} refreshToken - User's refresh token by which user will be found.
 * @param {Function} onSuccess  - Callback function that is called on operation success.
 * @param {Function} onError    - Callback function that is called on error.
 */
function refreshAccessToken (refreshToken, onSuccess, onError) {

    User.findOne({
        'refreshToken': refreshToken
    })
    .exec(onUserFound);

    function onUserFound (error, user) {
        if (error) return onError(error);
        
        jwt.sign({
            'id':        user.id,
            'email':     user.email,
            'firstName': user.firstName,
            'lastName':  user.lastName
        }, 
        auth.secret,
        {
            'expiresIn': 60 * 60        // One hour
        },
        function (error, token) { 
            onSignFinished(error, token); 
        });
    }

    function onSignFinished (error, accessToken) {
        if (error) return onError(error);
        onSuccess({
            'access-token': accessToken
        });
    }

}

module.exports = userService;