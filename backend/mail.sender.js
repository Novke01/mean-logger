'use strict';

var nodemailer = require('nodemailer');

var mailSender = {
	sendVerificationMail: sendVerificationMail,
	sendEventNotification: sendEventNotification
};

// SMTP configuration (TODO: insert your email config).
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'test.mean.logger@gmail.com',
		pass: ''// TODO: insert password
	}
});

/**
 * Sends verification mail to user.
 * 
 * @param {String} email             - User's email. 
 * @param {String} verificationToken - User's verification token.
 */
function sendVerificationMail (email, verificationToken) {

    var mail = {
		from:    'MEAN Logger',
		to:      email,
		subject: 'MEAN Logger account verification',
		html:    '<h2>One more step</h2>' +
		         '<p>To verify your email address click ' +
		         '<a href="http://localhost:8081/verify.html?verificationToken=' + verificationToken +'">here</a>' +
				 '.</p>'
	};

	transporter.sendMail(mail, onMailSendingFinished);

}

/**
 * Sends notification to user that event happened in one of his applications.
 * 
 * @param {String} emails - List of receivers.
 * @param {String} role   - User's role.
 * @param {Event} event   - Event object.
 */
function sendEventNotification (emails, applicationName, version, stackTrace) {

    var mail = {
		from:    'MEAN Logger',
		to:      emails,
		subject: 'MEAN Logger Event Notification',
		html:    '<h2>Error Notification</h2>' +
		         '<p>Error happened in application ' + applicationName + ' ' + version + ':' +
				 '<pre>' + stackTrace + '</pre>' +
				 '</p>'
	};

	transporter.sendMail(mail, onMailSendingFinished);

}

/**
 * Function that is used as callback for mail sending.
 * 
 * @param {Error} error - Error object.
 * @param {Object} info - Object with response information. 
 */
function onMailSendingFinished (error, info) {
    if (error) console.log(error);
	else       console.log(info);
}

module.exports = mailSender;