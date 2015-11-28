//실제롤 맨처음 실행되는 부분

// modules =================================================
// require는 c의 include, java의 import라고 생각하면 편함
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');

// configuration ===========================================

// config files
var db = require('./config/db');

// set our port, 포트지정이 없으면 3000
var port = process.env.PORT || 3000;

// connect to our mongoDB database
mongoose.connect(db.url);

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('X-HTTP-Method-Override'));

// static파일 경로 지정; 만약 url이 /img라면 /public/img를 참조
app.use(express.static(__dirname + '/public'));

// routes ==================================================
require('./app/routes')(app); // configure our routes

// start app ===============================================
// app.listen는 app이 지금부터 port로 들어오면 요청을 받는다는 의미.
// 만약 port로 요청이 들어오면 그에따른 event를 실행시킴.
app.listen(port);

// shoutout to the user
console.log('Server on port ' + port);

// expose app
exports = module.exports = app;