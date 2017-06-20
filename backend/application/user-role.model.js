'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var roles = {
	owner:       'Owner', 
	master:      'Master', 
	participant: 'Participant'
};

var userRoleSchema = new Schema({
	userId: {
		type:     Schema.Types.ObjectId,
		ref:      'User',
		required: true
	},
	email: {
		type:     String,
		required: true
	},
    role: {
		type:     String,
	    enum:     roles.values,
		required: true
    }
});

module.exports = {
    userRoleSchema: userRoleSchema,
    roles:          roles
};