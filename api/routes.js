'use strict'

const controller = require('./controller');

module.exports = function(app) {
    app.route('/')
        .get(controller.index);
    app.route('/about')
        .get(controller.about);
    app.route('/videos')
        .get(controller.videos);
    app.route('/contact')
        .get(controller.contact);
    app.route('/donate')
        .get(controller.donate);
    app.route('/pp')
        .get(controller.pp);
    app.route('/contact/send')
        .post(controller.sendEmail);
    app.route('/subscribe')
        .post(controller.subscribe);
    app.route('/blog')
        .get(controller.blog);
    app.route('/verify')
        .get(controller.verify);
    app.route('/robots.txt')
        .get(controller.robots);
    app.route('/notify')
        .get(controller.notify);
    app.route('/notify')
        .post(controller.notifyPost);
    app.route('/notify-about')
        .get(controller.aboutNotify);
    app.route('/sendNotification')
        .get(controller.sendNotification);
    app.route('/nsfw')
        .get(controller.nsfw);

    app.route('/links')
        .get(controller.links);
    app.route('/develop')
        .get(controller.develop);
    app.route('/inspire')
        .get(controller.inspire);
    app.route('/create')
        .get(controller.create);

    // Admin pages
    app.route('/admin')
        .get(controller.admin);
    app.route('/authenticate')
        .post(controller.authenticate);
    app.route('/adminDashboard')
        .get(controller.adminDashboard);
    app.route('/newsletter/:authentication_token')
        .get(controller.newsletter);
    app.route('/newsletter/send/:authentication_token')
        .post(controller.sendNewsletter);
    app.route('/addProject/:authentication_token')
        .get(controller.addProject);
};