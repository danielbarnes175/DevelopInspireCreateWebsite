'use strict';
const properties = require('../package.json');
const path = require('path');
const sanitize = require('sanitize-filename');

const EmailService = require('../services/EmailService.js');
const AdminService = require('../services/AdminService.js');
const YouTubeService = require('../services/YouTubeService.js');
const NotifyService = require('../services/NotifyService.js');
const BlogService = require('../services/BlogService.js');
const { getBlogTitle } = require('../services/BlogService.js');

const controllers = {
    index: function (req, res) {
        if (req.query)
            res.render('index.hbs', { title: 'Develop / Inspire / Create', attempted: (req.query.attempted == 'true'), result: (req.query.result == 'true') });
        else
            res.render('index.hbs', { title: 'Develop / Inspire / Create' });
    },
    about: function (req, res) {
        res.render('about.hbs', { title: 'About' });
    },
    links: function (req, res) {
        res.render('links.hbs', { title: 'Links' });
    },
    logo: function (req, res) {
        res.sendFile(path.resolve("public/images/DevelopInspireCreate.png"));
    },
    videos: async function (req, res) {
        let videoList = await YouTubeService.getVideos(req, res);
        res.render('videos.hbs', { title: 'Videos', videos: videoList });
    },
    contact: function (req, res) {
        let scripts = [{ script: 'https://www.google.com/recaptcha/api.js?render=6Le7JK0bAAAAADV3P6ZDDOXJHJImPrefIVghEs_7' }];
        if (req.query)
            res.render('contact.hbs', { title: 'Contact', attempted: (req.query.attempted == 'true'), result: (req.query.result == 'true'), scripts: scripts });
        else
            res.render('contact.hbs', { title: 'Contact', scripts: scripts });
    },
    donate: function (req, res) {
        res.render('donate.hbs', { title: 'Donate' });
    },
    develop: function (req, res) {
        res.render('develop.hbs', { title: 'Develop' });
    },
    inspire: function (req, res) {
        res.render('inspire.hbs', { title: 'Inspire' });
    },
    create: function (req, res) {
        res.render('create.hbs', { title: 'Create' });
    },
    pp: function (req, res) {
        res.render('privacyPolicy.hbs', { title: 'Privacy Policy' });
    },
    products: function (req, res) {
        res.render('products.hbs', { title: 'Products' });
    },
    projects: function (req, res) {
        res.render('projects.hbs', { title: 'Cool Stuff' });
    },
    sendEmail: function (req, res) {
        EmailService.submitEmail(req, res);
    },
    subscribe: function (req, res) {
        EmailService.registerEmail(req, res);
    },
    twineGame: function (req, res) {
        res.sendFile(path.resolve('views/Isekai.html'));
    },
    unsubscribe: function (req, res) {
        EmailService.unregisterEmail(req, res);
        res.render('unsubscribe.hbs', { title: 'Unsubscribe' });
    },
    blog: async (req, res, next) => {
        if (req.query && req.query.blog) {
            let title = await BlogService.getBlogTitle(req.query.blog);
            let filename = sanitize(req.query.blog);
            res.render(`blogs/${filename}.hbs`, { title: title }, (err, html) => {
                if (err) {
                    res.render(`blogs_tech/${filename}.hbs`, { title: title }, (err, html) => {
                        if (err) next();
                        else res.send(html);
                    });
                } else {
                    res.send(html);
                }
            });
        }
        else {
            let blogList = await BlogService.getBlogs();
            res.render('blogs/blogIndex.hbs', { title: 'Blog Posts', blogs: blogList });
        }
    },
    verify: function (req, res) {
        let id = req.query.id;
        EmailService.verifyId(id);
        res.render('verified.hbs', { title: 'Email Verified' });
    },
    admin: function (req, res) {
        res.render('admin/authenticate.hbs', { title: 'Admin Authentication' });
    },
    authenticate: function (req, res) {
        AdminService.authenticate(req, res);
    },
    adminDashboard: function (req, res) {
        if (req.query && req.query.authentication_token === process.env.ADMIN_AUTHENTICATION_TOKEN)
            res.render('admin/adminDashboard.hbs', { title: 'Admin Control Panel', "authentication_token": req.query.authentication_token });
        else
            res.render('admin/authenticate.hbs', { title: 'Admin Authentication' });
    },
    newsletter: function (req, res) {
        if (req.params && req.params.authentication_token === ":" + process.env.ADMIN_AUTHENTICATION_TOKEN)
            res.render('admin/newsletter.hbs', { title: 'Newsletter', authenticated: true });
        else
            res.render('admin/newsletter.hbs', { title: 'Newsletter' });
    },
    sendNewsletter: function (req, res) {
        EmailService.sendNewsletter(req, res);
    },
    addProject: function (req, res) {
        if (req.params && req.params.authentication_token === ":" + process.env.ADMIN_AUTHENTICATION_TOKEN)
            res.render('admin/addProject.hbs', { title: 'Create New Project', authenticated: true });
        else
            res.render('admin/addProject.hbs', { title: 'Create New Project' });
    },
    resources: function (req, res) {
        res.render('resources.hbs', { title: 'Resources' });
    },
    resume: function (req, res) {
        if (req.query && req.query.pdf) {
            res.redirect('DanielBarnesResumeSE.pdf');
        } else {
            res.render('resume.hbs', { title: 'Resume' });
        }
    },
    robots: function (req, res) {
        res.type('text/plain');
        res.sendFile('robots.txt');
    },

    notify: function (req, res) {
        res.render('notify.hbs', { title: 'NotifyMe', layout: 'notifyMeLayout' });
    },
    notifyPost: function (req, res) {
        NotifyService.notify(req, res);
    },
    sendNotification: function (req, res) {
        res.render('notified.hbs', { title: 'NotifyMe', layout: 'notifyMeLayout', cache: false });
    },
    aboutNotify: function (req, res) {
        res.render('notify-about.hbs', { title: 'NotifyMe', layout: 'notifyMeLayout' });
    },
    nsfw: function (req, res) {
        res.render('nsfw.hbs', { title: '( ಠ◡ಠ )' });
    },

    // Life Simulator
    lifeSimulator: function (req, res) {
        let scripts = [{ script: 'js/LifeSimulator/LifeSimulatorService.js' }];
        res.render('lifeSimulator/lifeSimulator.hbs', { title: 'Life Simulator', scripts: scripts, onLoad: 'initialSetup()' });
    }
};

module.exports = controllers;