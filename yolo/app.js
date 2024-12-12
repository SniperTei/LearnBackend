var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var movieRouter = require('./routes/movie');
var bookRouter = require('./routes/book');
var alcoholRouter = require('./routes/alcohol');
var drinkRouter = require('./routes/drink');
var foodRouter = require('./routes/food');
var alcoholTypeRouter = require('./routes/alcohol_type');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// cors
app.use(cors());
// 路由
app.use('/', indexRouter);
app.use('/api/v1/', usersRouter);
app.use('/api/v1/', movieRouter);
app.use('/api/v1/', bookRouter);
app.use('/api/v1/', alcoholRouter);
app.use('/api/v1/', drinkRouter);
app.use('/api/v1/', foodRouter);
app.use('/api/v1/', alcoholTypeRouter);

// 数据库连接
require('./config/mongodb')();

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
