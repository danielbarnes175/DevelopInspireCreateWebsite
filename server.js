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
const axios = require('axios');

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
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

// Logging middleware
app.use(function(req, res, next) {
  logging(req, res);
  next();
});

const routes = require('./api/routes.js');
routes(app);

app.use(function(req, res, next){
  res.status(404).render('404.hbs');
  logging(req, res);
});

var options = {
    key: privateKey,
    cert: certificate
};

https.createServer(options, app).listen(443);

// Redirect from http port 80 to https
var http = require('http');
http.createServer(app).listen(80);

console.log("Server Running");

const logging = (req, res) => {
  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  let method = req.method;
  let url = req.url;
  let status = res.statusCode;

  // Console Log
  let log = `[${formatted_date}]: ${status} ${method} ${url}`;
  console.log(log);

  // Discord Webhook Log
  log = {
    "embeds": [
      {
        "description": `**[${formatted_date}]: ${status} ${method} ${url}**`,
        "color": 15258703,
      }
    ]
  }

  axios.post(process.env.DISCORD_WEBHOOK_URL, log);
}