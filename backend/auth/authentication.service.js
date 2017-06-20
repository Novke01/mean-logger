'use strict';

var jwt = require('jsonwebtoken');

var User = require('./../user/user.model');

var auth = {
    authentication: authentication,
    secret: 'jwtSecret'
};

/**
 * Authenticate's user, and adds user's data to request object.
 * 
 * @param {Object} req    - Request object that contains user's content.
 * @param {Object} res    - Response object that will be returned to user.
 * @param {Function} next - Callback that represents next function in chain. 
 */
function authentication (req, res, next) {

    var authToken = req.headers['x-auth-token'];

    if (authToken === undefined) {
        return next({
            'message': 'You are not logged in!',
            'code': 401
        });
    }

    jwt.verify(authToken, auth.secret, onVerify);

    function onVerify (error, decoded) {
        if (error) return next(error);
        
        req.loggedInUser = decoded;
        return next();
    }

}

module.exports = auth;
