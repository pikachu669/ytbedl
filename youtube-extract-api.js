const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");

const app = express();
const port = 3000;

app.use(cors());

// GET /api?url=<youtube_url>
app.get('/api', async (req, res) => {
  const youtubeURL = req.query.url;

  if (!youtubeURL || !ytdl.validateURL(youtubeURL)) {
    return res.status(400).json({ error: 'Valid YouTube URL is required' });
  }

  try {
    const info = await ytdl.getInfo(youtubeURL);
    const formats = ytdl.filterFormats(info.formats, 'audioandvideo');

    const videoDetails = {
      title: info.videoDetails.title,
      lengthSeconds: info.videoDetails.lengthSeconds,
      videoURL: youtubeURL,
      formats: formats.map(f => ({
        quality: f.qualityLabel,
        type: f.container,
        url: f.url
      })),
      credit: "Developer: @labani"
    };

    res.json(videoDetails);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`YouTube API listening at http://localhost:${port}`);
});

module.exports = app;
