var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var router = require('./src/routes/index')

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({credentials:true, origin: 'http://localhost:8080'}));

/*******
 * handlebar settings
 ******/
const handlebars = handlebarSetting();
app.engine('hbs',handlebars.engine).set('view engine','hbs');
app.set('views',path.join(__dirname,'./views/'));

/* contents scheduling */
require('./src/lib/contentsScheduling')

app.use('/', router)

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


/**
 * @param
 * @desc 핸들바 셋팅
 * @return handlebar
 */
function handlebarSetting(){

  const handlebars =require('express-handlebars').create({
      extname:'hbs',
  });
  return handlebars;
}

module.exports = app;
