var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://Project2:Project2@cluster0.evw5m.mongodb.net/P2AAUGRP2?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// declaring routers
var indexRouter = require('./routes/index');
var monthlyRouter = require('./routes/monthly');
var transactionsRouter = require('./routes/transactions');
var budgetRouter = require('./routes/budget');
var savingsRouter = require('./routes/savings');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

//parsing json
app.use(express.json());

//url stuff
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//for public files like css and scripts
app.use(express.static(path.join(__dirname, 'public')));

//for detecting recent changes
app.locals.recentlyDeleted = "false";

// using routers
app.use('/', indexRouter);
app.use('/monthly', monthlyRouter);
app.use('/transactions', transactionsRouter);
app.use('/budget', budgetRouter);
app.use('/savings', savingsRouter);

app.get('/refreshT', function(req, res, next) {
  res.redirect('/transactions');
});

app.use(express.urlencoded({extended: true}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
