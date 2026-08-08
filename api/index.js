const express = require('express');
const app = express();
app.use(express.json());

// CORS settings
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Health Checks
app.get('/', (req, res) => res.send('OK'));
app.get('/health', (req, res) => res.send('OK'));

// 1. Chat Endpoint (Gemini)
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const key = process.env.GEMINI_API_KEY;

  if (!message) return res.status(400).json({ error: 'Message missing' });
  if (!key) return res.status(500).json({ error: 'GEMINI_API_KEY missing' });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );
    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.error?.message || 'No reply';
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Video Endpoint (Fal.ai / Pollinations Fallback)
app.post('/api/generate-video', async (req, res) => {
  const { script } = req.body;
  const falKey = process.env.FAL_API_KEY;

  if (!script) return res.status(400).json({ error: 'Script missing' });

  try {
    if (falKey) {
      const response = await fetch('https://fal.run/fal-ai/wan/v2', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${falKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: script })
      });
      const data = await response.json();
      const videoUrl = data.video?.url || data.video_url || data.output?.video?.url;
      if (videoUrl) return res.json({ videoUrl });
    }

    // Fallback URL
    const videoUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(script)}?width=1280&height=720&nologo=true`;
    res.json({ videoUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Translate Endpoint
app.post('/api/translate', async (req, res) => {
  const { text, target } = req.body;
  if (!text || !target) return res.status(400).json({ error: 'Text/target missing' });

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    res.json({ translated: data[0][0][0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server live on ${PORT}`));
