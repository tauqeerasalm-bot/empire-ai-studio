// =============================================
// 1. AUTHENTICATION (Login/Signup)
// =============================================
let currentUser = null;
let isLoginMode = true;

function switchAuthMode() {
  isLoginMode = !isLoginMode;
  document.getElementById('loginBtn').textContent = isLoginMode ? 'Login' : 'Sign Up';
  document.getElementById('switchLink').textContent = isLoginMode ? "Don't have account? Sign Up" : "Already have account? Login";
  document.getElementById('loginName').style.display = isLoginMode ? 'none' : 'block';
  document.getElementById('loginError').textContent = '';
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const name = document.getElementById('loginName').value.trim();

  if (!email || !password) {
    document.getElementById('loginError').textContent = '⚠️ Email and password required!';
    return;
  }
  if (!isLoginMode && !name) {
    document.getElementById('loginError').textContent = '⚠️ Full name required!';
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  if (isLoginMode) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      document.getElementById('loginError').textContent = '';
      showApp();
    } else {
      document.getElementById('loginError').textContent = '❌ Invalid email or password!';
    }
  } else {
    if (users.find(u => u.email === email)) {
      document.getElementById('loginError').textContent = '❌ Email already registered!';
      return;
    }
    const newUser = { email, password, name, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    document.getElementById('loginError').textContent = '';
    showApp();
  }
}

function showApp() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('appContainer').style.display = 'block';
  document.getElementById('displayName').textContent = currentUser.name;
  document.getElementById('dashName').textContent = currentUser.name;
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('appContainer').style.display = 'none';
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginError').textContent = '';
}

// Check saved user on load
window.onload = function() {
  const saved = localStorage.getItem('currentUser');
  if (saved) {
    currentUser = JSON.parse(saved);
    showApp();
    // Load voices for audio tool
    loadAudioVoices();
  }
  // Slider updates
  setupSliders();
};

// Enter key for login
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && document.getElementById('loginPage').style.display !== 'none') {
    handleLogin();
  }
});

// =============================================
// 2. TOOL SWITCHING (Only one tool at a time)
// =============================================
function switchTool(tool) {
  // Update sidebar
  document.querySelectorAll('.sidebar .tool-item').forEach(el => el.classList.remove('active'));
  document.querySelector(`.sidebar .tool-item[data-tool="${tool}"]`).classList.add('active');

  // Update panel content
  document.querySelectorAll('.panel .tool-content').forEach(el => el.classList.remove('active'));
  document.getElementById(`tool-${tool}`).classList.add('active');

  // Update title
  const titles = {
    'dashboard': '📊 Dashboard',
    'text-to-video': '🎬 Text-to-Video',
    'text-to-audio': '🗣️ Text-to-Audio',
    'text-to-image': '🖼️ Text-to-Image',
    'ai-chat': '🤖 AI Chat',
    'translate': '🌍 Translate',
    'captions': '📝 Captions',
    'video-effects': '🎨 Video Effects'
  };
  document.getElementById('toolTitle').innerHTML = `<h2>${titles[tool] || 'Tool'}</h2>`;
}

// =============================================
// 3. TEXT-TO-VIDEO (Free)
// =============================================
async function generateVideo() {
  const script = document.getElementById('videoScript').value.trim();
  if (!script) {
    document.getElementById('videoMessage').textContent = '⚠️ Please enter a script!';
    return;
  }
  document.getElementById('videoMessage').textContent = '⏳ Generating video...';
  document.getElementById('videoResult').style.display = 'block';
  document.getElementById('videoResult').innerHTML = '⏳ Please wait...';

  try {
    const prompt = encodeURIComponent(script);
    const videoUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1280&height=720&nologo=true`;
    document.getElementById('videoResult').innerHTML = `
      <video controls style="width:100%; max-height:400px; border-radius:12px;">
        <source src="${videoUrl}" type="video/mp4">
      </video>
    `;
    document.getElementById('videoMessage').textContent = '✅ Video generated!';
  } catch(e) {
    document.getElementById('videoResult').innerHTML = '❌ Error: ' + e.message;
    document.getElementById('videoMessage').textContent = '❌ Failed to generate.';
  }
}

// =============================================
// 4. TEXT-TO-AUDIO
// =============================================
let audioMediaRecorder, audioChunks = [];
let audioUtterance = null;

function loadAudioVoices() {
  const voices = window.speechSynthesis.getVoices();
  // Just cache voices
}
window.speechSynthesis.onvoiceschanged = loadAudioVoices;
setTimeout(loadAudioVoices, 1000);

function speakAudio() {
  const text = document.getElementById('audioScript').value.trim();
  if (!text) {
    document.getElementById('audioMessage').textContent = '⚠️ Enter text to speak!';
    return;
  }
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = document.getElementById('audioLang').value;
  utterance.rate = parseFloat(document.getElementById('audioRate').value);
  utterance.pitch = parseFloat(document.getElementById('audioPitch').value);

  const style = document.getElementById('audioStyle').value;
  switch(style) {
    case 'poetry': utterance.rate = 0.6; utterance.pitch = 1.1; break;
    case 'sad': utterance.rate = 0.5; utterance.pitch = 0.8; break;
    case 'excited': utterance.rate = 1.4; utterance.pitch = 1.3; break;
    case 'robot': utterance.rate = 1.0; utterance.pitch = 0.5; break;
    default: break;
  }

  utterance.onstart = () => { document.getElementById('audioMessage').textContent = '🎙️ Playing...'; };
  utterance.onend = () => { document.getElementById('audioMessage').textContent = '✅ Done!'; };
  utterance.onerror = () => { document.getElementById('audioMessage').textContent = '❌ Error playing audio.'; };
  window.speechSynthesis.speak(utterance);
  audioUtterance = utterance;
}

function downloadAudio() {
  const text = document.getElementById('audioScript').value.trim();
  if (!text) {
    document.getElementById('audioMessage').textContent = '⚠️ Enter text to download!';
    return;
  }
  document.getElementById('audioMessage').textContent = '⏳ Recording...';

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = document.getElementById('audioLang').value;
  utterance.rate = parseFloat(document.getElementById('audioRate').value);
  utterance.pitch = parseFloat(document.getElementById('audioPitch').value);

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const dest = audioCtx.createMediaStreamDestination();
  audioMediaRecorder = new MediaRecorder(dest.stream);
  audioChunks = [];
  audioMediaRecorder.ondataavailable = e => { if (e.data.size) audioChunks.push(e.data); };
  audioMediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: 'audio/mp3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai_voice_' + Date.now() + '.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    document.getElementById('audioMessage').textContent = '✅ Downloaded!';
    audioCtx.close();
  };
  audioMediaRecorder.start();
  utterance.onend = () => audioMediaRecorder.stop();
  utterance.onerror = () => { document.getElementById('audioMessage').textContent = '❌ Error recording.'; audioMediaRecorder.stop(); };
  window.speechSynthesis.speak(utterance);
}

// =============================================
// 5. TEXT-TO-IMAGE
// =============================================
function generateImage() {
  const prompt = document.getElementById('imagePrompt').value.trim();
  if (!prompt) {
    document.getElementById('imageMessage').textContent = '⚠️ Describe the image!';
    return;
  }
  document.getElementById('imageMessage').textContent = '⏳ Generating...';
  document.getElementById('imageResult').style.display = 'block';
  
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`;
  document.getElementById('imageResult').innerHTML = `<img src="${url}" style="max-width:100%; max-height:400px; border-radius:12px; border:2px solid #d4af37;">`;
  document.getElementById('imageMessage').textContent = '✅ Image generated!';
}

// =============================================
// 6. AI CHAT (Gemini)
// =============================================
async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  const container = document.getElementById('chatContainer');
  const key = document.getElementById('chatKey').value.trim();
  if (!key) {
    container.innerHTML += `<div style="background:#1a1a2a; padding:12px; border-radius:10px; margin:5px 0;"><b>Bot:</b> Please enter Gemini API key.</div>`;
    input.value = '';
    container.scrollTop = container.scrollHeight;
    return;
  }

  container.innerHTML += `<div style="background:#2a2a3a; padding:12px; border-radius:10px; margin:5px 0; text-align:right; max-width:80%; margin-left:auto;"><b>You:</b> ${msg}</div>`;
  input.value = '';
  container.scrollTop = container.scrollHeight;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: msg }] }] })
    });
    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '⚠️ No reply.';
    container.innerHTML += `<div style="background:#1a1a2a; padding:12px; border-radius:10px; margin:5px 0;"><b>Bot:</b> ${reply}</div>`;
  } catch(e) {
    container.innerHTML += `<div style="background:#1a1a2a; padding:12px; border-radius:10px; margin:5px 0;"><b>Bot:</b> Error: ${e.message}</div>`;
  }
  container.scrollTop = container.scrollHeight;
}

document.getElementById('chatInput').addEventListener('keyup', function(e) {
  if (e.key === 'Enter') sendChatMessage();
});

// =============================================
// 7. TRANSLATE
// =============================================
async function translateText() {
  const text = document.getElementById('translateScript').value.trim();
  if (!text) {
    document.getElementById('translateMessage').textContent = '⚠️ Enter text to translate!';
    return;
  }
  const target = document.getElementById('translateTarget').value;
  document.getElementById('translateMessage').textContent = '⏳ Translating...';
  document.getElementById('translateResult').style.display = 'block';

  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    document.getElementById('translateResult').innerHTML = data[0][0][0];
    document.getElementById('translateMessage').textContent = '✅ Translation ready!';
  } catch(e) {
    document.getElementById('translateResult').innerHTML = '❌ Error: ' + e.message;
    document.getElementById('translateMessage').textContent = '❌ Translation failed.';
  }
}

// =============================================
// 8. CAPTIONS
// =============================================
function generateCaptions() {
  const script = document.getElementById('captionsScript').value.trim();
  if (!script) {
    document.getElementById('captionsMessage').textContent = '⚠️ Enter script for captions!';
    return;
  }
  document.getElementById('captionsResult').style.display = 'block';
  document.getElementById('captionsResult').innerHTML = '📝 ' + script;
  document.getElementById('captionsMessage').textContent = '✅ Captions generated!';
}

// =============================================
// 9. VIDEO EFFECTS
// =============================================
document.getElementById('effectVideo').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const video = document.getElementById('effectVideoPreview');
    video.src = URL.createObjectURL(file);
    video.style.display = 'block';
  }
});

function applyVideoFilter(filter) {
  const video = document.getElementById('effectVideoPreview');
  if (!video.src || video.style.display === 'none') {
    document.getElementById('effectMessage').textContent = '⚠️ Please upload a video first!';
    return;
  }
  const canvas = document.getElementById('effectCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 360;
  
  const draw = () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    if (filter !== 'none') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      if (filter === 'grayscale') {
        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.34 * data[i] + 0.5 * data[i+1] + 0.16 * data[i+2];
          data[i] = data[i+1] = data[i+2] = gray;
        }
      } else if (filter === 'sepia') {
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i], g = data[i+1], b = data[i+2];
          data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          data[i+1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          data[i+2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        }
      } else if (filter === 'brightness') {
        for (let i = 0; i < data.length; i++) data[i] = Math.min(255, data[i] * 1.3);
      }
      ctx.putImageData(imageData, 0, 0);
    }
    requestAnimationFrame(draw);
  };
  video.play();
  setTimeout(draw, 100);
  document.getElementById('effectMessage').textContent = '✅ Filter: ' + filter;
}

function downloadEffectVideo() {
  const video = document.getElementById('effectVideoPreview');
  if (!video.src) {
    document.getElementById('effectMessage').textContent = '⚠️ Please upload a video!';
    return;
  }
  const a = document.createElement('a');
  a.href = video.src;
  a.download = 'video_' + Date.now() + '.mp4';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  document.getElementById('effectMessage').textContent = '✅ Download started!';
}

// =============================================
// 10. SLIDER UI UPDATES
// =============================================
function setupSliders() {
  const rateSlider = document.getElementById('audioRate');
  const rateVal = document.getElementById('audioRateVal');
  if (rateSlider && rateVal) {
    rateSlider.addEventListener('input', () => rateVal.textContent = rateSlider.value);
  }
  const pitchSlider = document.getElementById('audioPitch');
  const pitchVal = document.getElementById('audioPitchVal');
  if (pitchSlider && pitchVal) {
    pitchSlider.addEventListener('input', () => pitchVal.textContent = pitchSlider.value);
  }
}
