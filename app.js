var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('express-handlebars')



var listsRouter = require('./routes/lists');
var usersRouter = require('./routes/users');


const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://localhost:27017/toDo', { useNewUrlParser: true})

var app = express();


const {generateTime, alertThis} = require('./helpers/handlebars-helpers')

// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'list', layoutsDir: __dirname + '/views/layouts/', helpers: {generateTime: generateTime, alertThis: alertThis}}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, ' views')));
app.use(express.static(path.join(__dirname, 'public')));

// we are going to use this cookie
app.use(cookieParser('12345-67890-09876-54321'));

app.use('/', usersRouter);

function auth(req, res, next) {

  if (!req.signedCookies.user) {
    res.statusCode = 200;
      res.render('user/login', {'nameAlert': 'Please login first!'})
  } else {
    if(req.signedCookies.user === 'admin-authenticated') {
      console.log(' middleware signedcookies user ', req.signedCookies.user)
        console.log('middleware session ', req.session)
          console.log('middleware cookies ', req.cookies)
      res.statusCode = 200;
      next();
    } else {
      res.statusCode = 200;
        res.render('user/login', {
          'nameAlert': 'Please log in first cookie'
        })
    }
  }
}

app.use(auth);



app.use('/lists', listsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
