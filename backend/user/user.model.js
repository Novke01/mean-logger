'use strict';

var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	email: {
		type:     String,
		required: true,
		unique:   true
	},
	password: {
		type:     String,
		required: true,
		set: hashPassword
	},
	salt: {
		type:     String,
		required: true,
		default:  generateSalt
	},
	verificationToken: {
		type:     String,
		required: true,
		unique: true,
		default: generateVerificationToken
	},
	refreshToken: {
		type:     String,
		required: true,
		unique: true,
		default:  generateRefreshToken
	},
	verified: {
		type:     Boolean,
		required: true,
		default:  false
	},
	firstName: {
		type:     String,
		required: true
	},
	lastName: {
		type:     String,
		required: true
	}
});

/**
 * Generates salt for user.
 */
function generateSalt () {
	return bcrypt.genSaltSync();
}

/**
 * Hashes password for user.
 */
function hashPassword (password) {
    return bcrypt.hashSync(password, this.salt);
}

/**
 * Generates refresh token for user.
 */
function generateRefreshToken () {
	return crypto.randomBytes(48).toString('hex');
}

/**
 * Generates verification token for new user.
 */
function generateVerificationToken () {
	return crypto.randomBytes(48).toString('hex');
}

var User = mongoose.model('User', userSchema);

module.exports = User;