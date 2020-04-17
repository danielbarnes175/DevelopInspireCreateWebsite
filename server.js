const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const bodyParser  = require('body-parser');
const hbs = require('express-handlebars');
const path = require('path');
const favicon = require('serve-favicon');
const port = process.env.PORT || 3000;
const https = require('https');
const fs = require('fs');

const certificate = fs.readFileSync('developinspirecreate.com.crt');
const privateKey = fs.readFileSync('developinspirecreate.com.key');
app.engine('hbs', hbs({
    extname: 'hbs', 
    defaultLayout: 'layout', 
    layoutsDir: path.join(__dirname + '/views/layouts/'),
    partialsDir: path.join(__dirname + '/views/partials/')
}));

app.set('views', path.join(__dirname + '/views/'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

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

const routes = require('./api/routes.js');

routes(app);

var options = {
    key: privateKey,
    cert: certificate
};

https.createServer(options, function (req, res) {
    res.end('secure!');
}).listen(443);

// Redirect from http port 80 to https
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);