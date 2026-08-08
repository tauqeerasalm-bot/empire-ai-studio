const express = require('express');
const app = express();
app.use(express.json());

// =============================================
// API KEYS (Environment Variables)
// =============================================
const FAL_API_KEY = process.env.FAL_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// =============================================
// CORS
// =============================================
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// =============================================
// HEALTH CHECKS
// =============================================
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// =============================================
// API: GENERATE VIDEO
// =============================================
app.post('/api/generate-video', async (req, res) => {
  const { script } = req.body;
  if (!script) {
    return res.status(400).json({ error: 'Script chahiye' });
  }

  try {
    if (FAL_API_KEY) {
      const response = await fetch('https://fal.run/fal-ai/wan/v2', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${FAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: script,
          num_frames: 81,
          fps: 16,
          guidance_scale: 7,
          num_inference_steps: 30
        })
      });
      const data = await response.json();
      const videoUrl = data.video?.url || data.video_url || data.output?.video?.url;
      if (videoUrl) {
        return res.json({ videoUrl });
      }
    }

    // Fallback URL (Pollinations)
    const prompt = encodeURIComponent(script);
    const videoUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1280&height=720&nologo=true`;
    res.json({ videoUrl });

  } catch (error) {
    console.error('Generate video error:', error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// API: CHAT (Gemini 1.5 Flash Standard Model)
// =============================================
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message chahiye' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key missing' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );
    const data = await response.json();
    
    // Exact response extraction
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.error?.message || 'No reply';
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// API: TRANSLATE
// =============================================
app.post('/api/translate', async (req, res) => {
  const { text, target } = req.body;
  if (!text || !target) {
    return res.status(400).json({ error: 'Text aur target language chahiye' });
  }

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    const translated = data[0][0][0];
    res.json({ translated });
  } catch (error) {
    console.error('Translate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// SERVER START
// =============================================
const PORT = process.env.PORT || process.env.EXPOSE_PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
      
