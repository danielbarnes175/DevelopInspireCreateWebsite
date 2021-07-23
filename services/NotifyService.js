const axios = require('axios');
const fs = require('fs');
const url = require('url');
const { logError } = require('./LoggingService.js');

module.exports = {
    notify: async (req, res) => {
        let api_key = process.env.NOTIFY_API_KEY;
        let user_key = process.env.NOTIFY_USER_KEY;

        let message = 'Somebody is pushing all my buttons!';
        if (req.body && req.body.message) {
            message = req.body.message;
        }
        
        let endpoint = encodeURI(`https://api.pushover.net/1/messages.json?token=${api_key}&user=${user_key}&message=${message}`);
        let rateEndpoint = `https://api.pushover.net/1/apps/limits.json?token=${api_key}`;
    
        let rateResult = await axios.get(rateEndpoint);

        if (rateResult.data.remaining >= 100) {
            try {
            axios.post(endpoint);
            } catch (err) {
                logError(err);
            }
        }
        
        res.redirect(url.format({
            pathname:"/../sendNotification"
        }));
    }
}