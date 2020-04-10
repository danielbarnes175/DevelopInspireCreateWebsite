'use strict';
const properties = require('../package.json');
const path = require('path');

const EmailService = require('../services/EmailService.js');

const controllers = {
    index: function (req, res) {
        res.render('index.hbs', {title: 'Develop / Inspire / Create', condition: false});
    },
    about: function(req, res) {
        res.render('about.hbs', {title: 'About', condition: false});
    },
    videos: function(req, res) {
        res.render('videos.hbs', {title: 'Videos', condition: false});
    },
    projects: function(req, res) {
        res.render('projects.hbs', {title: 'Projects', condition: false});
    },
    contact: function(req, res) {
        if (req.query)
            res.render('contact.hbs', {title: 'Contact', condition: false, attempted: (req.query.attempted == 'true'), result: (req.query.result == 'true')});
        else
            res.render('contact.hbs', {title: 'Contact', condition: false});
    },
    donate: function(req, res) {
        res.render('donate.hbs', {title: 'Donate', condition: false});
    },
    sendEmail: function(req, res) {
        EmailService.submitEmail(req, res);
    }
};

module.exports = controllers;