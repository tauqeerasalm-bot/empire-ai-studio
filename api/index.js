const express = require('express');
const app = express();
app.use(express.json());

const FAL_API_KEY = process.env.FAL_API_KEY;

app.post('/api/generate-video', async (req, res) => {
  const { script } = req.body;
  if (!script) return res.status(400).json({ error: "Script chahiye" });

  try {
    const response = await fetch("https://fal.run/fal-ai/wan/v2", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: script, num_frames: 81, fps: 16 })
    });
    const data = await response.json();
    const videoUrl = data.video?.url || data.video_url;
    if (!videoUrl) throw new Error("Video URL nahi mila");
    res.json({ videoUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
