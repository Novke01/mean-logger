'use strict';

var mongoose = require('mongoose');

var commentSchema = require('./../comment/comment.model');

var Schema = mongoose.Schema;

var eventSchema = new Schema({
	version: {
		type:     String,
		required: true
	},
	stack: {
		type:     String,
		required: true
	},
	time: {
		type:     Date,
		required: true,
		default:  Date.now
	},
	fragment: {
		type:     String,
		required: true
	},
	comments: [commentSchema]
});

module.exports = eventSchema;