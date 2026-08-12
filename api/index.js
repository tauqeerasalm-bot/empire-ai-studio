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

    if (!response.ok) {
      console.error('GEMINI ERROR:', JSON.stringify(data));
      return res.status(response.status).json({ error: data?.error?.message || 'Gemini request failed' });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.error?.message || 'No reply';
    res.json({ reply });
  } catch (err) {
    console.error('CHAT ENDPOINT CRASH:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Video Endpoint (Hugging Face / Pollinations Fallback)
app.post('/api/generate-video', async (req, res) => {
  const { script } = req.body;
  const hfKey = process.env.HF_API_KEY;

  if (!script) return res.status(400).json({ error: 'Script missing' });

  const pollinationsFallback = () =>
    `https://image.pollinations.ai/prompt/${encodeURIComponent(script)}?width=1280&height=720&nologo=true`;

  // No key at all -> straight to fallback, but log it so it's obvious why
  if (!hfKey) {
    console.warn('HF_API_KEY missing — using Pollinations image fallback.');
    return res.json({ videoUrl: pollinationsFallback(), fallback: true, reason: 'HF_API_KEY missing' });
  }

  try {
    // Hugging Face Inference API — free tier, rate-limited, shared GPU pool.
    // Model: ali-vilab/text-to-video-ms-1.7b (a widely available free text-to-video model)
    const response = await fetch(
      'https://api-inference.huggingface.co/models/ali-vilab/text-to-video-ms-1.7b',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: script })
      }
    );

    console.log('HF STATUS:', response.status);
    const contentType = response.headers.get('content-type') || '';

    // Success -> Hugging Face returns raw video bytes (video/mp4)
    if (response.ok && contentType.includes('video')) {
      const buffer = Buffer.from(await response.arrayBuffer());
      const base64 = buffer.toString('base64');
      const videoUrl = `data:video/mp4;base64,${base64}`;
      return res.json({ videoUrl, fallback: false });
    }

    // Not ok, or not a video -> read as JSON/text to see why (model loading, rate limit, etc.)
    const raw = await response.text();
    console.log('HF RESPONSE:', raw.slice(0, 500));

    let reason = `Hugging Face error ${response.status}`;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.error) reason = parsed.error; // e.g. "Model is currently loading", "rate limit exceeded"
    } catch (_) { /* not JSON, ignore */ }

    return res.json({ videoUrl: pollinationsFallback(), fallback: true, reason });

  } catch (err) {
    console.error('VIDEO ENDPOINT CRASH:', err);
    return res.json({ videoUrl: pollinationsFallback(), fallback: true, reason: err.message });
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

    if (!response.ok) {
      console.error('TRANSLATE ERROR:', response.status);
      return res.status(response.status).json({ error: 'Translate request failed' });
    }

    const data = await response.json();
    const translated = data?.[0]?.[0]?.[0];

    if (!translated) {
      console.error('TRANSLATE: unexpected response shape', JSON.stringify(data));
      return res.status(500).json({ error: 'Unexpected translate response' });
    }

    res.json({ translated });
  } catch (err) {
    console.error('TRANSLATE ENDPOINT CRASH:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start Server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => console.log(`Server live on ${PORT}`));
}

module.exports = app;
