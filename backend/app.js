'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var connect = require('connect');
var serveStatic = require('serve-static');

var ApplicationCtrl = require('./application/application.controller');
var UserCtrl = require('./user/user.controller');
var EventCtrl = require('./event/event.controller');
var CommentCtrl = require('./comment/comment.controller');

var cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/test');

app.get('/verify.html\?', function (req, res, next) {
    res.sendFile('verify.html', {
		root: './static'
	});
});
app.use(serveStatic(__dirname + '/dist'));

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;

app.use('/api/events', cors(), EventCtrl);
app.use('/api/applications', cors(), ApplicationCtrl);
app.use('/api/users', cors(), UserCtrl);
app.use('/api/comments', cors(), CommentCtrl);

app.use(function(error, req, res, next) {
	console.log(error);
	var message = error.message;
	var code = error.code || 400;
	
	res.status(code).json({
		message: message,
		code: code
	});
});

app.listen(port);
console.log('Server running on port ' + port);
