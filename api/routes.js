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
};