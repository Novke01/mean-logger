'use strict';

var mongoose = require('mongoose');
var uuidV4 = require('uuid/v4');

var eventSchema = require('./../event/event.model');
var User = require('./../user/user.model');
var userRole = require('./user-role.model');

var Schema = mongoose.Schema;

var applicationSchema = new Schema({
	name: {
		type:     String,
		required: true
	},
	technology: {
		type:     String,
		required: true
	},
	version: {
		type:     String
	},
	repository: {
		type:     String
	},
	dsn: {
		type:     String,
		required: true,
		unique:   true
	},
	key: {
		type:     String,
		required: true,
		unique:   true,
		default:  generateKey
	},
	events: [
		eventSchema
	],
	users: [
        userRole.userRoleSchema
	]
});

function generateKey () {
	return uuidV4();
}

var Application = mongoose.model('Application', applicationSchema);
module.exports = Application;