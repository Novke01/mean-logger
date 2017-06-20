'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var commentSchema = new Schema({
	user: {
		type:     Schema.Types.ObjectId, 
		ref:      'User'
	},
	text: {
		type:     String,
		required: true
	},
	createdAt: {
		type:     Date,
		required: true,
		default:  Date.now
	}
});
commentSchema.add({comments:[commentSchema]});

module.exports = commentSchema;