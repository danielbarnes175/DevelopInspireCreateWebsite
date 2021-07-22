const axios = require('axios');

module.exports = {
    logRequest: function (req, res) {
        let current_datetime = new Date();
        let formatted_date =
            current_datetime.getFullYear() +
            "-" +
            (current_datetime.getMonth() + 1) +
            "-" +
            current_datetime.getDate() +
            " " +
            current_datetime.getHours() +
            ":" +
            current_datetime.getMinutes() +
            ":" +
            current_datetime.getSeconds();
        let method = req.method;
        let url = req.url;
        let status = res.statusCode;

        // Console Log
        let log = `[${formatted_date}]: ${status} ${method} ${url}`;
        console.log(log);

        // Discord Webhook Log
        log = {
            "embeds": [
                {
                    "description": `**[${formatted_date}]: ${status} ${method} ${url}**`,
                    "color": 15258703,
                }
            ]
        }

        axios.post(process.env.DISCORD_WEBHOOK_URL, log);
    },
    logError: (error) => {
        // Discord Webhook Log
        log = {
            "embeds": [
                {
                    "title": error.message,
                    "description": `**${error}**`,
                    "color": 16711680,
                }
            ]
        }

        axios.post(process.env.DISCORD_WEBHOOK_URL, log);
    }
}