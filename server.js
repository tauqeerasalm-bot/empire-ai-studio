const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const FAL_API_KEY = process.env.FAL_API_KEY;

app.post('/generate-video', async (req, res) => {
  const { script } = req.body;

  if (!script) {
    return res.status(400).json({ error: "Script chahiye" });
  }

  try {
    const response = await fetch("https://fal.run/fal-ai/wan/v2", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: script,
        num_frames: 81,
        fps: 16
      })
    });

    const data = await response.json();
    const videoUrl = data.video?.url || data.video_url;

    if (!videoUrl) throw new Error("Video URL nahi mila");
    res.json({ videoUrl: videoUrl });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
