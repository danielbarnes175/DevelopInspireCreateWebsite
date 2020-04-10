const nodemailer = require('nodemailer');
const url = require('url');
const fs = require('fs');

module.exports = {
    authenticate: function(req, res) {
        if (req.body.authCode != process.env.ADMIN_AUTHENTICATION_CODE)
            res.redirect('/admin');
        else {
            // Authenticate
            res.redirect(url.format({
                pathname:"/../adminDashboard",
                query: {
                   "authentication_token": process.env.ADMIN_AUTHENTICATION_TOKEN
                 }
            }));
        }
    }
}