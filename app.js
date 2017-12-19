var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');
const port = process.env.PORT || 8000;

// var index = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/pomeranian')));

// app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    next(err);
});

var sslOptions = {
    key: fs.readFileSync('./ssl/localhost.key'),
    cert:fs.readFileSync('./ssl/localhost.cert'),
    requestCert: false,
    rejectUnauthorized: false
};
var server = https.createServer(sslOptions, app);
server.listen(port, function () {
    console.log(`listening on port ${port}`);
});

module.exports = app;
