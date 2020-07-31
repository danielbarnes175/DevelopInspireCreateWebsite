const axios = require('axios');
const fs = require('fs');
const url = require('url');

module.exports = {
    notify: async (res) => {
        let api_key = process.env.NOTIFY_API_KEY;
        let user_key = process.env.NOTIFY_USER_KEY;
        let message = 'Somebody is pushing all my buttons!';
        let endpoint = `https://api.pushover.net/1/messages.json?token=${api_key}&user=${user_key}&message=${message}`;
        let rateEndpoint = `https://api.pushover.net/1/apps/limits.json?token=${api_key}`;
    
        let rateResult = await axios.get(rateEndpoint);

        if (rateResult.data.remaining >= 100) {
            axios.post(endpoint);
        }
        
        res.redirect(url.format({
            pathname:"/../sendNotification"
        }));
    }
}