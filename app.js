// Global
global.__base = __dirname;
global.__base_url = "http://localhost:3000";
global.__db_url = "mongodb://localhost:27017/algorithm-time"

// Require
var express = require('express');
var app = express();
var server = require('http').Server(app);
app.io = require('socket.io')();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Connect to DB
var models = {};
mongoose.connect(__db_url);
models.user_model = require('./models/user_model.js');

// Routes
var home = require('./routes/home')(models);
var user = require('./routes/user/index')(models);
var admin = require('./routes/admin/index')(models);
var amdin_user = require('./routes/admin/user')(models);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'eps');
app.set('view cache', false);

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/user', user);
app.use('/admin', admin);
app.use('/admin/user', amdin_user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// start listen with socket.io
app.io.on('connection', function(socket){  
  console.log('a user connected');
  app.io.sockets.emit('user_count', app.io.engine.clientsCount);

  socket.on('disconnect', function(){
    app.io.sockets.emit('user_count', app.io.engine.clientsCount);
    console.log('a user disconnect');
  });
});

module.exports = app;
