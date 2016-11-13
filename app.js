var expressWinston = require('express-winston');
var winston = require('winston');
var Papertrail = require('winston-papertrail').Papertrail;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var readingRoute = require('./routes/readingRouter');
var latestRoute = require('./routes/latestRouter');
var historyRoute = require('./routes/historyRouter');
var summaryRoute = require('./routes/summaryRouter');
var mongoose = require('mongoose');

var myLogger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            json: true,
            expressFormat: true,
            colorize: true
        }),
        new winston.transports.Papertrail({
            host: 'logs4.papertrailapp.com',
            port: 32583,
            program: 'rest-server',
            colorize: true
        })
    ]
});

var url = 'mongodb://'+process.env.DB_USER+":"+process.env.DB_PWD+"@"+process.env.DB_SERVER+':'+process.env.DB_PORT+'/charcuterie';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    myLogger.info("Connected correctly to server");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Place the express-winston logger before the router.
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: true,
            expressFormat: true,
            colorize: true
        }),
        new Papertrail({
            host: 'logs4.papertrailapp.com',
            port: 32583,
            program: 'rest-server',
            colorize: true

        })
    ]
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/readings', readingRoute);
app.use('/latest', latestRoute);
app.use('/history', historyRoute);
app.use('/summary', summaryRoute);

// Place the express-winston errorLogger after the router.
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            expressFormat: true,
            colorize: true
        }),
        new Papertrail({
            host: 'logs4.papertrailapp.com',
            port: 32583,
            program: 'rest-server',
            colorize: true

        })
    ]
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace

/* istanbul ignore next */
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
/* istanbul ignore next */
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
