const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const path = require('path');
const favicon = require('serve-favicon');
const https = require('https');
const fs = require('fs');
const axios = require('axios');
const { logRequest } = require('./services/LoggingService.js');
const helpers = require('./helpers/handlebars-helpers.js');

const port = process.env.PORT || 3000;
const app = express();
dotenv.config();

const certificate = fs.readFileSync(process.env.SSL_CERTIFICATE_PATH);
const privateKey = fs.readFileSync(process.env.SSL_KEY_PATH);

app.engine('hbs', hbs({
    extname: 'hbs', 
    defaultLayout: 'layout', 
    layoutsDir: path.join(__dirname + '/views/layouts/'),
    partialsDir: path.join(__dirname + '/views/partials/'),
    helpers: helpers
}));

app.set('views', path.join(__dirname + '/views/'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

// Logging middleware
app.use(function(req, res, next) {
  res.on("finish", function() {
    logRequest(req, res);
  });

  next();
});

const routes = require('./api/routes.js');
routes(app);

var options = {
    key: privateKey,
    cert: certificate
};

https.createServer(options, app).listen(443);

// Redirect from http port 80 to https
var http = require('http');
http.createServer(app).listen(80);

console.log("Server Running");
