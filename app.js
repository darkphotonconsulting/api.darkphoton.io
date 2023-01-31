var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var scanRouter = require('./routes/scan');
var aboutRouter = require('./routes/about');
var contactsRouter = require('./routes/contacts');
var companyRouter = require('./routes/companies');
var serviceRouter = require('./routes/services');
var philosophyRouter = require('./routes/philosophies')
var employerRouter = require('./routes/employers');
var employmentRouter = require('./routes/employments');
var responsibilityRouter = require('./routes/responsibilities');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/scan', scanRouter);
app.use('/about', aboutRouter);
app.use('/contacts', contactsRouter);
app.use('/companies', companyRouter);
app.use('/employers', employerRouter);
app.use('/employments', employmentRouter);
app.use('/responsibilities', responsibilityRouter);
app.use('/services', serviceRouter);
app.use('/philosophies', philosophyRouter);




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
