'use strict';

var express = require('express');
var jwt = require('jsonwebtoken');

var User = require('./user.model');
var App = require('./../application/application.model');
var auth = require('./../auth/authentication.service');
var userService = require('./user.service/user.service.proxy');
var mailSender = require('./../mail.sender');

var userCtrl = express.Router();

userCtrl
	.post('/register', userRegistration)
	.put('/verify', verifyUser)
	.post('/login', login)
	.post('/refresh-token', refreshToken);

/**
 * Registers new user.
 * 
 * @param {Object} req    - Request object that contains new user's data in body. 
 * @param {Object} res    - Response object that is returned to user.
 * @param {Function} next - Callback function that represents next function in a chain.
 */
function userRegistration (req, res, next) {

	var newUser = req.body;
    userService.createUser(newUser, onCreateUserSuccess, onError);
	
    function onCreateUserSuccess (user) {
		mailSender.sendVerificationMail(user.email, user.verificationToken);
        res.json({
			'message': 'Successfully registered. Verification email will be sent to you.'
		});
	}

	function onError (error) {
		return next(error);
	}

}

/**
 * Activates user's account.
 * 
 * @param {Object} req    - Request object that contains verification token.
 * @param {Object} res    - Response object that is returned to user.
 * @param {Function} next - Callback function that represents next function in a chain.
 */
function verifyUser (req, res, next) {
    var verificationToken = req.query.verificationToken;
    userService.verifyUser(verificationToken, onVerifyUserSuccess, onError);

    function onVerifyUserSuccess (user) {
		res.json({
			'message': 'User has been verified successfully.',
			'code': 200
		});
	}

    function onError (error) {
		return next(error);
	}
}

/**
 * Logs In user and returnes access token.
 * 
 * @param {Object} req    - Request object that contains user's username and password.
 * @param {Object} res    - Response object that contains user's data and access token.
 * @param {Function} next - Callback function that represents next function in a chain.
 */
function login (req, res, next) {
    var loginData = req.body;
	userService.loginUser(loginData, onLoginSuccess, onError);

    function onLoginSuccess (tokenData) {
        res.json(tokenData);
	}

	function onError (error) {
		return next(error);
	}

}

/**
 * Refreshes access token and returnes new one.
 * 
 * @param {Object} req    - Request object that contains refresh token.
 * @param {Object} res    - Response object that contains new access token.
 * @param {Function} next - Callback function that represents next function in chain.
 */
function refreshToken (req, res, next) {
	var refreshToken = req.body.refreshToken;

	userService.refreshAccessToken(refreshToken, onRefreshToken, onError);

    function onRefreshToken (accessToken) {
		res.json(accessToken);
	}

	function onError (error) {
		return next(error);
	}

}

module.exports = userCtrl;