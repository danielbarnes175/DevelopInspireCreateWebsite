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

// Handle 404
// app.use(function(req, res) {
//   res.status(404).render('404.hbs');
// });

// // Handle 500
// app.use(function(error, req, res, next) {
//   res.send('500: Internal Server Error', 500);
// });

const routes = require('./api/routes.js');

routes(app);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    //res.status(err.status || 500);
    res.render('404.hbs', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  //res.status(err.status || 500);
  res.render('404.hbs', {
    message: err.message,
    error: {}
  });
});

app.use(function(req, res, next){
  res.status(404).render('404.hbs');
});

var options = {
    key: privateKey,
    cert: certificate
};

https.createServer(options, app).listen(443);

// Redirect from http port 80 to https
var http = require('http');
http.createServer(app).listen(80);