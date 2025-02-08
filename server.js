const express = require('express');
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mm = require('music-metadata');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/api/convert', async (req, res) => {
  const { url } = req.body;
  if (!ytdl.validateURL(url)) {
    return res.json({ success: false, message: 'Invalid URL' });
  }

  const outputPath = path.resolve(__dirname, 'output.mp3');
  const stream = ytdl(url, { filter: 'audioonly' });
  ffmpeg(stream)
    .audioBitrate(128)
    .save(outputPath)
    .on('end', async () => {
      try {
        const metadata = await mm.parseFile(outputPath);
        const bpm = metadata.common.bpm || 'Unknown';
        const key = metadata.common.key || 'Unknown';
        res.json({ success: true, downloadUrl: `/download/output.mp3`, bpm, key });
      } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Metadata extraction failed' });
      }
    })
    .on('error', (err) => {
      console.error(err);
      res.json({ success: false, message: 'Conversion failed' });
    });
});

app.use('/download', express.static(path.resolve(__dirname)));

const handleConvert = async () => {
  const response = await fetch('http://localhost:3000/api/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: youtubeLink }),
  });
  const data = await response.json();
  if (data.success) {
    setBpm(data.bpm);
    setKey(data.key);
    setAudioUrl(data.downloadUrl);
  } else {
    alert('Conversion failed');
  }
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));