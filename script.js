// =============================================
// 1. NAVIGATION & AUTH
// =============================================
let currentUser = null;

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

function showPage(page) {
  // Check if user is logged in
  if (page === 'studio' || page === 'dashboard') {
    if (!currentUser) {
      alert('⚠️ Please login first!');
      openModal('login');
      return;
    }
  }

  document.getElementById('homePage').style.display = 'none';
  document.getElementById('studioPage').style.display = 'none';
  document.getElementById('dashboardPage').style.display = 'none';

  if (page === 'home') document.getElementById('homePage').style.display = 'block';
  else if (page === 'studio') {
    document.getElementById('studioPage').style.display = 'block';
    document.getElementById('studioPage').scrollIntoView({ behavior: 'smooth' });
  } else if (page === 'dashboard') {
    document.getElementById('dashboardPage').style.display = 'block';
    document.getElementById('dashboardUsername').textContent = currentUser.name;
    document.getElementById('dashboardEmail').textContent = currentUser.email;
  }

  document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.textContent.toLowerCase().includes(page)) link.classList.add('active');
  });
  document.getElementById('navLinks').classList.remove('open');
}

// =============================================
// 2. AUTHENTICATION
// =============================================
let isLoginMode = true;

function openModal(mode) {
  isLoginMode = mode === 'login';
  document.getElementById('authModal').style.display = 'flex';
  document.getElementById('modalTitle').textContent = isLoginMode ? 'Login' : 'Sign Up';
  document.getElementById('authBtn').textContent = isLoginMode ? 'Login' : 'Sign Up';
  document.getElementById('switchLink').textContent = isLoginMode ? "Don't have account? Sign Up" : "Already have account? Login";
  document.getElementById('authName').style.display = isLoginMode ? 'none' : 'block';
  document.getElementById('authEmail').value = '';
  document.getElementById('authPassword').value = '';
  document.getElementById('authName').value = '';
}

function closeModal() { document.getElementById('authModal').style.display = 'none'; }

function switchAuthMode() {
  isLoginMode = !isLoginMode;
  openModal(isLoginMode ? 'login' : 'signup');
}

function handleAuth() {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();
  const name = document.getElementById('authName').value.trim();

  if (!email || !password) { alert('Email and password required!'); return; }
  if (!isLoginMode && !name) { alert('Full name required!'); return; }

  const users = JSON.parse(localStorage.getItem('users') || '[]');

  if (isLoginMode) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      updateUI();
      closeModal();
      showPage('studio');
      document.getElementById('message').textContent = '✅ Welcome back, ' + user.name + '!';
    } else {
      alert('❌ Invalid email or password!');
    }
  } else {
    if (users.find(u => u.email === email)) {
      alert('❌ Email already registered!');
      return;
    }
    const newUser = { email, password, name, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUI();
    closeModal();
    showPage('studio');
    document.getElementById('message').textContent = '✅ Account created! Welcome, ' + name + '!';
  }
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateUI();
  showPage('home');
  document.getElementById('message').textContent = '👋 Logged out!';
}

function updateUI() {
  if (currentUser) {
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('userDisplay').style.display = 'inline-block';
    document.getElementById('usernameDisplay').textContent = currentUser.name;
  } else {
    document.getElementById('authButtons').style.display = 'inline-block';
    document.getElementById('userDisplay').style.display = 'none';
  }
}

// Check saved user
window.onload = function() {
  const saved = localStorage.getItem('currentUser');
  if (saved) { currentUser = JSON.parse(saved); updateUI(); }
  loadVoices();
};

// =============================================
// 3. VOICE FUNCTIONS
// =============================================
function loadVoices() {
  const voices = window.speechSynthesis.getVoices();
  const select = document.getElementById('voiceSelect');
  if (!select) return;
  select.innerHTML = '<option value="">Default</option>';
  voices.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.name;
    opt.textContent = v.name + ' (' + v.lang + ')';
    select.appendChild(opt);
  });
}
window.speechSynthesis.onvoiceschanged = loadVoices;
setTimeout(loadVoices, 1000);

function speakScript() {
  const text = document.getElementById('script').value.trim();
  if (!text) { document.getElementById('message').textContent = '⚠️ Script likho!'; return; }
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = document.getElementById('langSelect').value;
  utterance.rate = parseFloat(document.getElementById('rateSlider').value);
  utterance.pitch = parseFloat(document.getElementById('pitchSlider').value);

  const voiceName = document.getElementById('voiceSelect').value;
  if (voiceName) {
    const voice = window.speechSynthesis.getVoices().find(v => v.name === voiceName);
    if (voice) utterance.voice = voice;
  }

  utterance.onstart = () => { document.getElementById('message').textContent = '🎙️ Playing...'; };
  utterance.onend = () => { document.getElementById('message').textContent = '✅ Done!'; };
  window.speechSynthesis.speak(utterance);
}

// =============================================
// 4. VOICE DOWNLOAD
// =============================================
let mediaRecorder, audioChunks = [];

function downloadVoice() {
  const text = document.getElementById('script').value.trim();
  if (!text) { document.getElementById('message').textContent = '⚠️ Script likho!'; return; }
  document.getElementById('message').textContent = '⏳ Recording...';

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = document.getElementById('langSelect').value;
  utterance.rate = parseFloat(document.getElementById('rateSlider').value);
  utterance.pitch = parseFloat(document.getElementById('pitchSlider').value);

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const dest = audioCtx.createMediaStreamDestination();
  mediaRecorder = new MediaRecorder(dest.stream);
  audioChunks = [];
  mediaRecorder.ondataavailable = e => { if (e.data.size) audioChunks.push(e.data); };
  mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: 'audio/mp3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai_voice_' + Date.now() + '.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    document.getElementById('message').textContent = '✅ Downloaded!';
    audioCtx.close();
  };
  mediaRecorder.start();
  utterance.onend = () => mediaRecorder.stop();
  window.speechSynthesis.speak(utterance);
}

// =============================================
// 5. TEXT-TO-IMAGE
// =============================================
function generateImage() {
  const prompt = document.getElementById('imagePrompt').value.trim();
  if (!prompt) { document.getElementById('message').textContent = '⚠️ Describe image!'; return; }
  const container = document.getElementById('imageResult');
  container.innerHTML = '⏳ Generating...';
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`;
  container.innerHTML = `<img src="${url}" style="max-width:100%; max-height:300px; border-radius:12px; border:2px solid #d4af37;">`;
  document.getElementById('message').textContent = '✅ Image generated!';
}

// =============================================
// 6. TEXT-TO-VIDEO (FREE)
// =============================================
async function generateFreeVideo() {
  const script = document.getElementById('script').value.trim();
  if (!script) { document.getElementById('message').textContent = '⚠️ Script likho!'; return; }
  document.getElementById('message').textContent = '⏳ Video generating...';
  document.getElementById('freeVideoResult').innerHTML = '⏳ Please wait...';
  
  try {
    const prompt = encodeURIComponent(script);
    const videoUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1280&height=720&nologo=true`;
    document.getElementById('freeVideoResult').innerHTML = `
      <video controls style="width:100%; max-height:300px; border-radius:12px; border:2px solid #d4af37;">
        <source src="${videoUrl}" type="video/mp4">
      </video>
    `;
    document.getElementById('message').textContent = '✅ Video ready!';
  } catch(e) {
    document.getElementById('freeVideoResult').innerHTML = '❌ Error: ' + e.message;
  }
}

// =============================================
// 7. TRANSLATE
// =============================================
async function translateScript() {
  const text = document.getElementById('script').value.trim();
  if (!text) { document.getElementById('message').textContent = '⚠️ Script likho!'; return; }
  const target = document.getElementById('translateTarget').value;
  document.getElementById('translationResult').innerHTML = '⏳ Translating...';
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    document.getElementById('translationResult').innerHTML = '🌐 <b>Translation:</b> ' + data[0][0][0];
  } catch(e) {
    document.getElementById('translationResult').innerHTML = '❌ Translation failed.';
  }
}

// =============================================
// 8. CAPTIONS
// =============================================
function showCaptions() {
  const script = document.getElementById('script').value.trim();
  if (!script) { document.getElementById('message').textContent = '⚠️ Script likho!'; return; }
  const result = document.getElementById('captionsResult');
  result.style.display = 'block';
  result.innerHTML = '📝 ' + script;
  document.getElementById('message').textContent = '✅ Captions ready!';
}

// =============================================
// 9. VIDEO UPLOAD + EFFECTS
// =============================================
document.addEventListener('DOMContentLoaded', function() {
  const upload = document.getElementById('videoUpload');
  if (upload) {
    upload.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const video = document.getElementById('uploadedVideoPreview');
        video.src = URL.createObjectURL(file);
        video.style.display = 'block';
        video.onloadedmetadata = function() { applyFilter('none'); };
      }
    });
  }
});

function applyFilter(filter) {
  const video = document.getElementById('uploadedVideoPreview');
  if (!video.src || video.style.display === 'none') { document.getElementById('message').textContent = '⚠️ Pehle video upload karein!'; return; }
  const canvas = document.getElementById('videoCanvas');
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
  document.getElementById('message').textContent = '✅ Filter: ' + filter;
}

function downloadUploadedVideo() {
  const video = document.getElementById('uploadedVideoPreview');
  if (!video.src) { document.getElementById('message').textContent = '⚠️ Pehle video upload karein!'; return; }
  const a = document.createElement('a');
  a.href = video.src;
  a.download = 'video_' + Date.now() + '.mp4';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// =============================================
// 10. CHATBOT
// =============================================
async function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  const container = document.getElementById('chatContainer');
  const key = document.getElementById('geminiKey').value.trim();
  if (!key) {
    container.innerHTML += `<div style="background:#1a1a2a; padding:10px; border-radius:8px; margin:5px 0;"><b>Bot:</b> Please enter Gemini API key first.</div>`;
    input.value = '';
    container.scrollTop = container.scrollHeight;
    return;
  }

  container.innerHTML += `<div style="background:#2a2a3a; padding:10px; border-radius:8px; margin:5px 0; text-align:right; max-width:80%; margin-left:auto;"><b>You:</b> ${msg}</div>`;
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
    container.innerHTML += `<div style="background:#1a1a2a; padding:10px; border-radius:8px; margin:5px 0; max-width:80%;"><b>Bot:</b> ${reply}</div>`;
  } catch(e) {
    container.innerHTML += `<div style="background:#1a1a2a; padding:10px; border-radius:8px; margin:5px 0;"><b>Bot:</b> Error: ${e.message}</div>`;
  }
  container.scrollTop = container.scrollHeight;
}

document.getElementById('chatInput').addEventListener('keyup', function(e) {
  if (e.key === 'Enter') sendChat();
});

// =============================================
// 11. PROJECT
// =============================================
function startProject() {
  const name = document.getElementById('projectName').value.trim();
  const script = document.getElementById('script').value.trim();
  if (!name || !script) {
    document.getElementById('message').textContent = '⚠️ Project name aur script likhein!';
    return;
  }
  document.getElementById('message').textContent = '✅ Project "' + name + '" created!';
  
  // Update dashboard project count
  const count = parseInt(localStorage.getItem('projectCount') || '0') + 1;
  localStorage.setItem('projectCount', count);
  document.getElementById('projectCount').textContent = count;
}

// Slider UI
document.addEventListener('DOMContentLoaded', function() {
  ['rate','pitch'].forEach(id => {
    const slider = document.getElementById(id + 'Slider');
    const display = document.getElementById(id + 'Value');
    if (slider && display) {
      slider.addEventListener('input', () => display.textContent = slider.value);
    }
  });
});
