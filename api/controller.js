'use strict';
const properties = require('../package.json');
const path = require('path');

const EmailService = require('../services/EmailService.js');
const AdminService = require('../services/AdminService.js');
const YouTubeService = require('../services/YouTubeService.js');

const controllers = {
    index: function (req, res) {
        if (req.query)
            res.render('index.hbs', {title: 'Develop / Inspire / Create', condition: false, attempted: (req.query.attempted == 'true'), result: (req.query.result == 'true')});
        else
            res.render('index.hbs', {title: 'Develop / Inspire / Create', condition: false});
    },
    about: function(req, res) {
        res.render('about.hbs', {title: 'About', condition: false});
    },
    videos: async function(req, res) {
        let videoList = await YouTubeService.getVideos(req, res);
        res.render('videos.hbs', {title: 'Videos', condition: false, videos: videoList});
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
    },
    subscribe: function(req, res) {
        EmailService.registerEmail(req, res);
    },
    admin: function(req, res) {
        res.render('admin/authenticate.hbs', {title: 'Admin Authentication', condition: false});
    },
    authenticate: function(req, res) {
        AdminService.authenticate(req, res);
    },
    adminDashboard: function(req, res) {
        if (req.query && req.query.authentication_token === process.env.ADMIN_AUTHENTICATION_TOKEN)
            res.render('admin/adminDashboard.hbs', {title: 'Admin Control Panel', condition: false, "authentication_token": req.query.authentication_token});
        else
            res.render('admin/authenticate.hbs', {title: 'Admin Authentication', condition: false});
    },
    newsletter: function(req, res) {
        if (req.params && req.params.authentication_token === ":" + process.env.ADMIN_AUTHENTICATION_TOKEN)
            res.render('admin/newsletter.hbs', {title: 'Newsletter', condition: false, authenticated: true}); 
        else
            res.render('admin/newsletter.hbs', {title: 'Newsletter', condition: false});
    },
    sendNewsletter: function(req, res) {
            EmailService.sendNewsletter(req, res);
    },
    addProject: function(req, res) {
        if (req.params && req.params.authentication_token === ":" + process.env.ADMIN_AUTHENTICATION_TOKEN)
            res.render('admin/addProject.hbs', {title: 'Create New Project', condition: false, authenticated: true}); 
        else
            res.render('admin/addProject.hbs', {title: 'Create New Project', condition: false});
    }
};

module.exports = controllers;