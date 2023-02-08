'use strict'

const controller = require('./controller');

module.exports = function(app) {
    app.route('/')
        .get(controller.index);
    app.route('/about')
        .get(controller.about);
    app.route('/blog')
        .get(controller.blog);
    app.route('/contact')
        .get(controller.contact);
    app.route('/contact/send')
        .post(controller.sendEmail);
    app.route('/create')
        .get(controller.create);
    app.route('/develop')
        .get(controller.develop);
    app.route('/donate')
        .get(controller.donate);
    app.route('/inspire')
        .get(controller.inspire);
    app.route('/links')
        .get(controller.links);
    app.route('/logo')
        .get(controller.logo);
    app.route('/notify')
        .get(controller.notify);
    app.route('/notify')
        .post(controller.notifyPost);
    app.route('/notify-about')
        .get(controller.aboutNotify);
    app.route('/nsfw')
        .get(controller.nsfw);
    app.route('/pp')
        .get(controller.pp);
    app.route('/products')
        .get(controller.products);
    app.route('/projects')
        .get(controller.projects);
    app.route('/resources')
        .get(controller.resources);
    app.route('/resume')
        .get(controller.resume);
    app.route('/robots.txt')
        .get(controller.robots);
    app.route('/sendNotification')
        .get(controller.sendNotification);
    app.route('/subscribe')
        .post(controller.subscribe);
    app.route('/cyoa')
        .get(controller.twineGame);
    app.route('/unsubscribe')
        .get(controller.unsubscribe);
    app.route('/verify')
        .get(controller.verify);
    app.route('/videos')
        .get(controller.videos);

    // Life simulator
    app.route('/lifeSimulator')
        .get(controller.lifeSimulator);

    app.route('/tf2/playerStats')
        .get(controller.tf2PlayerStats);
    app.route('/tf2/processPlayerStats')
        .post(controller.processPlayerStats);
    app.route('/tf2/about')
        .get(controller.tf2About);

    // Admin pages
    app.route('/addProject/:authentication_token')
        .get(controller.addProject);
    app.route('/admin')
        .get(controller.admin);
    app.route('/adminDashboard')
        .get(controller.adminDashboard);
    app.route('/authenticate')
        .post(controller.authenticate);
    app.route('/newsletter/:authentication_token')
        .get(controller.newsletter);
    app.route('/newsletter/send/:authentication_token')
        .post(controller.sendNewsletter);

    app.use((req, res, next) => {
        res.status(404).render('404.hbs');
    });
};