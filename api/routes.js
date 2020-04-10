'use strict'

const controller = require('./controller');

module.exports = function(app) {
    app.route('/')
        .get(controller.index);
    app.route('/about')
        .get(controller.about);
    app.route('/videos')
        .get(controller.videos);
    app.route('/projects')
        .get(controller.projects);
    app.route('/contact')
        .get(controller.contact);
    app.route('/donate')
        .get(controller.donate);
    app.route('/contact/send')
        .post(controller.sendEmail);
    app.route('/subscribe')
        .post(controller.subscribe);

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