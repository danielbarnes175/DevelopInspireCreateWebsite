const axios = require('axios');
const key = process.env.YOUTUBE_API_KEY;
const channelID = "UCFhcd2AR1Goxw0UzQ8_n1pQ";
const baseYTApi = "https://www.googleapis.com/youtube/v3";
const fullYTApi = `https://www.googleapis.com/youtube/v3/search?key=${key}&channelId=${channelID}&part=snippet,id&order=date&maxResults=20`


module.exports = {
    getVideos: async function (req, res) {
        try {
            var body = await callApi();
        } catch (err) {
            console.log(err);
        }

        let videos = [];
        for (let i = 0; i < body.data.items.length - 1; i++) {
            let video = {
                title: body.data.items[i].snippet.title,
                description: body.data.items[i].snippet.description,
                image: body.data.items[i].snippet.thumbnails.medium.url,
                url: "https://www.youtube.com/watch?v=" + body.data.items[i].id.videoId
            }

            videos.push(video);
        }

        return videos;
    }
}

async function callApi() {
    let body = await axios.get(fullYTApi);
    return body;
}