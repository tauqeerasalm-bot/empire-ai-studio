// =============================================
// 1. LANGUAGES LIST (50+)
// =============================================
const LANGUAGES = [
  { code: 'af-ZA', name: 'Afrikaans' },
  { code: 'sq-AL', name: 'Albanian' },
  { code: 'am-ET', name: 'Amharic' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'hy-AM', name: 'Armenian' },
  { code: 'az-AZ', name: 'Azerbaijani' },
  { code: 'eu-ES', name: 'Basque' },
  { code: 'be-BY', name: 'Belarusian' },
  { code: 'bn-BD', name: 'Bengali' },
  { code: 'bs-BA', name: 'Bosnian' },
  { code: 'bg-BG', name: 'Bulgarian' },
  { code: 'ca-ES', name: 'Catalan' },
  { code: 'ceb-PH', name: 'Cebuano' },
  { code: 'zh-CN', name: 'Chinese' },
  { code: 'hr-HR', name: 'Croatian' },
  { code: 'cs-CZ', name: 'Czech' },
  { code: 'da-DK', name: 'Danish' },
  { code: 'nl-NL', name: 'Dutch' },
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'eo-EO', name: 'Esperanto' },
  { code: 'et-EE', name: 'Estonian' },
  { code: 'fil-PH', name: 'Filipino' },
  { code: 'fi-FI', name: 'Finnish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'gl-ES', name: 'Galician' },
  { code: 'ka-GE', name: 'Georgian' },
  { code: 'de-DE', name: 'German' },
  { code: 'el-GR', name: 'Greek' },
  { code: 'gu-IN', name: 'Gujarati' },
  { code: 'he-IL', name: 'Hebrew' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'hu-HU', name: 'Hungarian' },
  { code: 'is-IS', name: 'Icelandic' },
  { code: 'id-ID', name: 'Indonesian' },
  { code: 'ga-IE', name: 'Irish' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'jv-ID', name: 'Javanese' },
  { code: 'kn-IN', name: 'Kannada' },
  { code: 'kk-KZ', name: 'Kazakh' },
  { code: 'km-KH', name: 'Khmer' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'lo-LA', name: 'Lao' },
  { code: 'lv-LV', name: 'Latvian' },
  { code: 'lt-LT', name: 'Lithuanian' },
  { code: 'mk-MK', name: 'Macedonian' },
  { code: 'ms-MY', name: 'Malay' },
  { code: 'ml-IN', name: 'Malayalam' },
  { code: 'mt-MT', name: 'Maltese' },
  { code: 'mr-IN', name: 'Marathi' },
  { code: 'mn-MN', name: 'Mongolian' },
  { code: 'ne-NP', name: 'Nepali' },
  { code: 'no-NO', name: 'Norwegian' },
  { code: 'fa-IR', name: 'Persian' },
  { code: 'pl-PL', name: 'Polish' },
  { code: 'pt-PT', name: 'Portuguese' },
  { code: 'pa-IN', name: 'Punjabi' },
  { code: 'ro-RO', name: 'Romanian' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'sr-RS', name: 'Serbian' },
  { code: 'si-LK', name: 'Sinhala' },
  { code: 'sk-SK', name: 'Slovak' },
  { code: 'sl-SI', name: 'Slovenian' },
  { code: 'so-SO', name: 'Somali' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'su-ID', name: 'Sundanese' },
  { code: 'sw-KE', name: 'Swahili' },
  { code: 'sv-SE', name: 'Swedish' },
  { code: 'ta-IN', name: 'Tamil' },
  { code: 'te-IN', name: 'Telugu' },
  { code: 'th-TH', name: 'Thai' },
  { code: 'tr-TR', name: 'Turkish' },
  { code: 'uk-UA', name: 'Ukrainian' },
  { code: 'ur-PK', name: 'Urdu' },
  { code: 'uz-UZ', name: 'Uzbek' },
  { code: 'vi-VN', name: 'Vietnamese' },
  { code: 'cy-GB', name: 'Welsh' },
  { code: 'xh-ZA', name: 'Xhosa' },
  { code: 'yo-NG', name: 'Yoruba' },
  { code: 'zu-ZA', name: 'Zulu' }
];

// =============================================
// 2. POPULATE LANGUAGE DROPDOWNS
// =============================================
function populateLanguages() {
  const selects = ['audioLang', 'dubLang', 'transTarget', 'capLang'];
  selects.forEach(id => {
    const select = document.getElementById(id);
    if (select) {
      select.innerHTML = '';
      LANGUAGES.forEach(lang => {
        const opt = document.createElement('option');
        opt.value = lang.code;
        opt.textContent = lang.name;
        select.appendChild(opt);
      });
    }
  });
}

// =============================================
// 3. LOGIN / AUTH
// =============================================
let currentUser = null;
let isLogin = true;

function switchMode() {
  isLogin = !isLogin;
  document.getElementById('loginBtn').textContent = isLogin ? 'Login' : 'Sign Up';
  document.getElementById('switchLink').textContent = isLogin ? "Don't have account? Sign Up" : "Already have account? Login";
  document.getElementById('loginName').style.display = isLogin ? 'none' : 'block';
  document.getElementById('loginError').textContent = '';
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value.trim();
  const name = document.getElementById('loginName').value.trim();

  if (!email || !pass) {
    document.getElementById('loginError').textContent = '⚠️ Email & password required!';
    return;
  }
  if (!isLogin && !name) {
    document.getElementById('loginError').textContent = '⚠️ Full name required!';
    return;
  }

  let users = JSON.parse(localStorage.getItem('users') || '[]');

  if (isLogin) {
    let user = users.find(u => u.email === email && u.pass === pass);
    if (user) {
      currentUser = user;
      localStorage.setItem('user', JSON.stringify(currentUser));
      document.getElementById('loginError').textContent = '';
      showApp();
    } else {
      const newUser = { email, pass, name: name || email.split('@')[0], projects: [], stats: { videos: 0, images: 0, audio: 0 } };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      currentUser = newUser;
      localStorage.setItem('user', JSON.stringify(currentUser));
      document.getElementById('loginError').textContent = '';
      showApp();
    }
  } else {
    if (users.find(u => u.email === email)) {
      document.getElementById('loginError').textContent = '❌ Email exists! Try logging in.';
      return;
    }
    const newUser = { email, pass, name, projects: [], stats: { videos: 0, images: 0, audio: 0 } };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = newUser;
    localStorage.setItem('user', JSON.stringify(currentUser));
    document.getElementById('loginError').textContent = '';
    showApp();
  }
}

function showApp() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('displayName').textContent = currentUser.name || currentUser.email;
  document.getElementById('dashName').textContent = currentUser.name || currentUser.email;
  updateDashboard();
  populateLanguages();
}

function logout() {
  currentUser = null;
  localStorage.removeItem('user');
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}

window.onload = function() {
  const saved = localStorage.getItem('user');
  if (saved) {
    currentUser = JSON.parse(saved);
    showApp();
  }
  setupSliders();
};

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('loginPage').style.display !== 'none') {
    handleLogin();
  }
});

// =============================================
// 4. TOOL SWITCHING
// =============================================
function switchTool(tool) {
  document.querySelectorAll('.sidebar .tool').forEach(el => el.classList.remove('active'));
  document.querySelector(`.sidebar .tool[data-tool="${tool}"]`).classList.add('active');
  document.querySelectorAll('.panel .content').forEach(el => el.classList.remove('active'));
  document.getElementById(`content-${tool}`).classList.add('active');
  const titles = {
    dashboard: '📊 Dashboard',
    projects: '📁 Project Manager',
    video: '🎬 Text→Video',
    audio: '🗣️ Text→Audio',
    image: '🖼️ Text→Image',
    dubbing: '🔊 Voice Dubbing',
    clone: '🎭 Voice Clone',
    chat: '🤖 AI Chat',
    translate: '🌍 Translate',
    captions: '📝 Captions',
    effects: '🎨 Effects',
    channels: '📡 Channels',
    editor: '🖌️ Image Editor'
  };
  document.getElementById('panelTitle').innerHTML = `<h2>${titles[tool] || 'Tool'}</h2>`;
  if (tool === 'dashboard') updateDashboard();
  if (tool === 'projects') renderProjects();
}

// =============================================
// 5. DASHBOARD
// =============================================
function updateDashboard() {
  if (!currentUser) return;
  const stats = currentUser.stats || { videos: 0, images: 0, audio: 0 };
  document.getElementById('statProjects').textContent = (currentUser.projects || []).length;
  document.getElementById('statVideos').textContent = stats.videos || 0;
  document.getElementById('statImages').textContent = stats.images || 0;
  document.getElementById('statAudio').textContent = stats.audio || 0;

  const projects = currentUser.projects || [];
  const recent = projects.slice(-3).reverse();
  const container = document.getElementById('recentProjects');
  container.innerHTML = '';
  if (recent.length === 0) {
    container.innerHTML = '<p style="color:#666;">No projects yet.</p>';
  } else {
    recent.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <h4>${p.name}</h4>
        <p style="color:#888; font-size:13px;">${p.type} • ${p.date || 'Today'}</p>
        <div class="actions">
          <button class="btn-view" onclick="alert('Open: ${p.name}')">Open</button>
          <button class="btn-del" onclick="deleteProject('${p.id}')">Delete</button>
        </div>
      `;
      container.appendChild(card);
    });
  }
}

// =============================================
// 6. PROJECT MANAGER
// =============================================
function createProject() {
  const name = document.getElementById('projectNameInput').value.trim();
  const type = document.getElementById('projectType').value;
  if (!name) { document.getElementById('projectMsg').textContent = '⚠️ Enter project name!'; return; }

  if (!currentUser.projects) currentUser.projects = [];
  const project = {
    id: Date.now().toString(),
    name: name,
    type: type,
    date: new Date().toLocaleDateString(),
    createdAt: new Date().toISOString()
  };
  currentUser.projects.push(project);
  saveUser();
  renderProjects();
  document.getElementById('projectNameInput').value = '';
  document.getElementById('projectMsg').textContent = '✅ Project created!';
  updateDashboard();
}

function renderProjects() {
  const container = document.getElementById('projectList');
  const projects = currentUser?.projects || [];
  container.innerHTML = '';
  if (projects.length === 0) {
    container.innerHTML = '<p style="color:#666;">No projects yet.</p>';
    return;
  }
  const sorted = [...projects].reverse();
  sorted.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    const typeEmoji = { video: '🎬', audio: '🗣️', image: '🖼️', chat: '🤖', other: '📁' };
    card.innerHTML = `
      <h4>${typeEmoji[p.type] || '📁'} ${p.name}</h4>
      <p style="color:#888; font-size:13px;">Type: ${p.type} • ${p.date || 'Today'}</p>
      <div class="actions">
        <button class="btn-view" onclick="openProject('${p.id}')">Open</button>
        <button class="btn-del" onclick="deleteProject('${p.id}')">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function openProject(id) {
  const project = currentUser.projects.find(p => p.id === id);
  if (!project) return;
  const toolMap = { video: 'video', audio: 'audio', image: 'image', chat: 'chat', other: 'dashboard' };
  const tool = toolMap[project.type] || 'dashboard';
  switchTool(tool);
}

function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  currentUser.projects = currentUser.projects.filter(p => p.id !== id);
  saveUser();
  renderProjects();
  updateDashboard();
  document.getElementById('projectMsg').textContent = '🗑️ Deleted.';
}

function saveUser() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const idx = users.findIndex(u => u.email === currentUser.email);
  if (idx > -1) users[idx] = currentUser;
  else users.push(currentUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('user', JSON.stringify(currentUser));
}

// =============================================
// BACKEND BASE URL (PXXL) — frontend is on GitHub Pages, backend is separate
// =============================================
const API_BASE = 'https://empire-ai-studio.pxxlspace.cv';

// =============================================
// 7. TEXT→VIDEO
// =============================================
async function genVideo() {
  const s = document.getElementById('videoScript').value.trim();
  if (!s) { document.getElementById('videoMsg').textContent = '⚠️ Enter script!'; return; }
  document.getElementById('videoMsg').textContent = '⏳ Generating...';
  const r = document.getElementById('videoResult');
  r.style.display = 'block';
  try {
    const res = await fetch(`${API_BASE}/api/generate-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script: s })
    });
    const data = await res.json();

    if (!data.videoUrl) {
      r.innerHTML = '❌ Error';
      document.getElementById('videoMsg').textContent = '❌ Failed: ' + (data.error || data.reason || 'Unknown error');
      return;
    }

    if (data.fallback) {
      // Backend fell back to an image (Fal.ai unavailable) — show as image, not <video>
      r.innerHTML = `<img src="${data.videoUrl}" style="width:100%; max-height:250px; border-radius:8px;">`;
      document.getElementById('videoMsg').textContent = '⚠️ Real video unavailable, showing image fallback (' + (data.reason || '') + ')';
    } else {
      r.innerHTML = `<video controls style="width:100%; max-height:250px; border-radius:8px;"><source src="${data.videoUrl}" type="video/mp4"></video>`;
      document.getElementById('videoMsg').textContent = '✅ Video ready!';
    }

    document.getElementById('videoCaptions').style.display = 'block';
    document.getElementById('videoCaptions').innerHTML = '📝 ' + s;
    if (currentUser) { currentUser.stats = currentUser.stats || {}; currentUser.stats.videos = (currentUser.stats.videos || 0) + 1; saveUser(); updateDashboard(); }
  } catch(e) { r.innerHTML = '❌ Error'; document.getElementById('videoMsg').textContent = '❌ Failed: ' + e.message; }
}

// =============================================
// 8. TEXT→AUDIO (50+ Languages, 15+ Styles, Gender, Age)
// =============================================
let audioRec, audioChunks = [];

function speakAudio() {
  const t = document.getElementById('audioScript').value.trim();
  if (!t) { document.getElementById('audioMsg').textContent = '⚠️ Enter text!'; return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t);
  u.lang = document.getElementById('audioLang').value;
  u.rate = parseFloat(document.getElementById('audioRate').value);
  
  const gender = document.getElementById('audioGender').value;
  const age = document.getElementById('audioAge').value;
  const style = document.getElementById('audioStyle').value;
  
  // Gender + Age adjustments (pitch)
  let pitch = 1.0;
  if (gender === 'male') pitch = 0.85;
  else if (gender === 'female') pitch = 1.2;
  if (age === 'young') pitch *= 1.1;
  else if (age === 'old') pitch *= 0.8;
  
  // Style adjustments
  if (style === 'neutral') { u.rate = 0.9; u.pitch = pitch; }
  else if (style === 'poetry') { u.rate = 0.6; u.pitch = pitch * 1.1; }
  else if (style === 'sad') { u.rate = 0.5; u.pitch = pitch * 0.8; }
  else if (style === 'excited') { u.rate = 1.4; u.pitch = pitch * 1.3; }
  else if (style === 'robot') { u.rate = 1.0; u.pitch = 0.5; }
  else if (style === 'dramatic') { u.rate = 0.7; u.pitch = pitch * 1.2; }
  else if (style === 'horror') { u.rate = 0.4; u.pitch = pitch * 0.6; }
  else if (style === 'cartoon') { u.rate = 1.3; u.pitch = pitch * 1.8; }
  else if (style === 'deep') { u.rate = 0.6; u.pitch = pitch * 0.6; }
  else if (style === 'whisper') { u.rate = 0.3; u.pitch = pitch * 0.7; }
  else if (style === 'cheerful') { u.rate = 1.2; u.pitch = pitch * 1.2; }
  else if (style === 'grumpy') { u.rate = 0.6; u.pitch = pitch * 0.7; }
  else if (style === 'formal') { u.rate = 0.8; u.pitch = pitch * 0.9; }
  else if (style === 'casual') { u.rate = 1.1; u.pitch = pitch * 1.0; }
  else if (style === 'narrator') { u.rate = 0.75; u.pitch = pitch * 0.9; }
  
  u.onstart = () => document.getElementById('audioMsg').textContent = `🎙️ ${gender}/${age} - ${style}...`;
  u.onend = () => {
    document.getElementById('audioMsg').textContent = '✅ Done!';
    if (currentUser) { currentUser.stats = currentUser.stats || {}; currentUser.stats.audio = (currentUser.stats.audio || 0) + 1; saveUser(); updateDashboard(); }
  };
  window.speechSynthesis.speak(u);
}

function downloadAudio() {
  const t = document.getElementById('audioScript').value.trim();
  if (!t) { document.getElementById('audioMsg').textContent = '⚠️ Enter text!'; return; }
  document.getElementById('audioMsg').textContent = '⏳ Recording...';
  const u = new SpeechSynthesisUtterance(t);
  u.lang = document.getElementById('audioLang').value;
  u.rate = parseFloat(document.getElementById('audioRate').value);
  
  const gender = document.getElementById('audioGender').value;
  const age = document.getElementById('audioAge').value;
  const style = document.getElementById('audioStyle').value;
  
  let pitch = 1.0;
  if (gender === 'male') pitch = 0.85;
  else if (gender === 'female') pitch = 1.2;
  if (age === 'young') pitch *= 1.1;
  else if (age === 'old') pitch *= 0.8;
  
  if (style === 'neutral') { u.rate = 0.9; u.pitch = pitch; }
  else if (style === 'poetry') { u.rate = 0.6; u.pitch = pitch * 1.1; }
  else if (style === 'sad') { u.rate = 0.5; u.pitch = pitch * 0.8; }
  else if (style === 'excited') { u.rate = 1.4; u.pitch = pitch * 1.3; }
  else if (style === 'robot') { u.rate = 1.0; u.pitch = 0.5; }
  else if (style === 'dramatic') { u.rate = 0.7; u.pitch = pitch * 1.2; }
  else if (style === 'horror') { u.rate = 0.4; u.pitch = pitch * 0.6; }
  else if (style === 'cartoon') { u.rate = 1.3; u.pitch = pitch * 1.8; }
  else if (style === 'deep') { u.rate = 0.6; u.pitch = pitch * 0.6; }
  else if (style === 'whisper') { u.rate = 0.3; u.pitch = pitch * 0.7; }
  else if (style === 'cheerful') { u.rate = 1.2; u.pitch = pitch * 1.2; }
  else if (style === 'grumpy') { u.rate = 0.6; u.pitch = pitch * 0.7; }
  else if (style === 'formal') { u.rate = 0.8; u.pitch = pitch * 0.9; }
  else if (style === 'casual') { u.rate = 1.1; u.pitch = pitch * 1.0; }
  else if (style === 'narrator') { u.rate = 0.75; u.pitch = pitch * 0.9; }
  
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const dest = ctx.createMediaStreamDestination();
  audioRec = new MediaRecorder(dest.stream);
  audioChunks = [];
  audioRec.ondataavailable = e => { if (e.data.size) audioChunks.push(e.data); };
  audioRec.onstop = () => {
    const blob = new Blob(audioChunks, { type: 'audio/mp3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'voice.mp3';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    document.getElementById('audioMsg').textContent = '✅ Downloaded!';
    ctx.close();
  };
  audioRec.start();
  u.onend = () => audioRec.stop();
  window.speechSynthesis.speak(u);
}

// =============================================
// 9. TEXT→IMAGE
// =============================================
function genImage() {
  const p = document.getElementById('imagePrompt').value.trim();
  if (!p) { document.getElementById('imageMsg').textContent = '⚠️ Describe image!'; return; }
  const r = document.getElementById('imageResult');
  r.style.display = 'block';
  r.innerHTML = `<img src="https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=512&height=512&nologo=true" style="max-width:100%; max-height:250px; border-radius:8px; border:2px solid #d4af37;">`;
  document.getElementById('imageMsg').textContent = '✅ Image ready!';
  if (currentUser) { currentUser.stats = currentUser.stats || {}; currentUser.stats.images = (currentUser.stats.images || 0) + 1; saveUser(); updateDashboard(); }
}

// =============================================
// 10. DUBBING (50+ Languages)
// =============================================
async function dubVideo() {
  const file = document.getElementById('dubVideo').files[0];
  if (!file) { document.getElementById('dubMsg').textContent = '⚠️ Upload video!'; return; }
  document.getElementById('dubMsg').textContent = '⏳ Processing...';
  
  const script = document.getElementById('videoScript').value.trim() || 'Hello, this is a test';
  const target = document.getElementById('dubLang').value;
  
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target.split('-')[0]}&dt=t&q=${encodeURIComponent(script)}`);
    const data = await res.json();
    const translated = data[0][0][0];
    
    const utterance = new SpeechSynthesisUtterance(translated);
    utterance.lang = target;
    utterance.rate = 0.9;
    utterance.onstart = () => document.getElementById('dubMsg').textContent = '🔊 Playing dubbed voice...';
    utterance.onend = () => {
      document.getElementById('dubMsg').textContent = '✅ Dubbing complete!';
      document.getElementById('dubResult').style.display = 'block';
      document.getElementById('dubResult').innerHTML = `🌐 Translated: ${translated}`;
    };
    window.speechSynthesis.speak(utterance);
  } catch(e) {
    document.getElementById('dubMsg').textContent = '❌ Error: ' + e.message;
  }
}

// =============================================
// 11. VOICE CLONE
// =============================================
async function cloneVoice() {
  const file = document.getElementById('cloneAudio').files[0];
  if (!file) { document.getElementById('cloneMsg').textContent = '⚠️ Upload audio sample!'; return; }
  document.getElementById('cloneMsg').textContent = '⏳ Processing voice clone... (demo)';
  
  const script = document.getElementById('audioScript').value.trim() || 'Hello, this is your cloned voice!';
  const utterance = new SpeechSynthesisUtterance(script);
  utterance.rate = 0.85;
  utterance.pitch = 0.95;
  utterance.onstart = () => document.getElementById('cloneMsg').textContent = '🔊 Playing cloned voice...';
  utterance.onend = () => document.getElementById('cloneMsg').textContent = '✅ Voice clone demo complete!';
  window.speechSynthesis.speak(utterance);
}

// =============================================
// 12. AI CHAT
// =============================================
async function sendChat() {
  const inp = document.getElementById('chatInput');
  const msg = inp.value.trim();
  if (!msg) return;
  const box = document.getElementById('chatBox');
  const key = document.getElementById('chatKey').value.trim();
  if (!key) { box.innerHTML += `<div class="chat-msg chat-bot"><b>Bot:</b> Enter API key.</div>`; inp.value = ''; return; }
  box.innerHTML += `<div class="chat-msg chat-user"><b>You:</b> ${msg}</div>`;
  inp.value = '';
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: msg }] }] })
    });
    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply.';
    box.innerHTML += `<div class="chat-msg chat-bot"><b>Bot:</b> ${reply}</div>`;
  } catch(e) { box.innerHTML += `<div class="chat-msg chat-bot"><b>Bot:</b> Error</div>`; }
  box.scrollTop = box.scrollHeight;
}
document.getElementById('chatInput').addEventListener('keyup', e => { if (e.key === 'Enter') sendChat(); });

// =============================================
// 13. TRANSLATE (50+ Languages)
// =============================================
async function doTranslate() {
  const t = document.getElementById('transScript').value.trim();
  if (!t) { document.getElementById('transMsg').textContent = '⚠️ Enter text!'; return; }
  const target = document.getElementById('transTarget').value;
  const r = document.getElementById('transResult');
  r.style.display = 'block';
  document.getElementById('transMsg').textContent = '⏳ Translating...';
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target.split('-')[0]}&dt=t&q=${encodeURIComponent(t)}`);
    const data = await res.json();
    r.innerHTML = data[0][0][0];
    document.getElementById('transMsg').textContent = '✅ Done!';
  } catch(e) { r.innerHTML = '❌ Error'; document.getElementById('transMsg').textContent = '❌ Failed.'; }
}

// =============================================
// 14. CAPTIONS (50+ Languages)
// =============================================
function genCaptions() {
  const s = document.getElementById('capScript').value.trim();
  if (!s) { document.getElementById('capMsg').textContent = '⚠️ Enter script!'; return; }
  const r = document.getElementById('capResult');
  r.style.display = 'block';
  const lang = document.getElementById('capLang').value;
  const langName = LANGUAGES.find(l => l.code === lang)?.name || 'English';
  r.innerHTML = `📝 ${s}<br><span style="color:#888; font-size:12px;">Language: ${langName}</span>`;
  document.getElementById('capMsg').textContent = '✅ Captions ready!';
}

// =============================================
// 15. EFFECTS
// =============================================
document.getElementById('effectFile').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const v = document.getElementById('effectVideo');
    v.src = URL.createObjectURL(file);
    v.style.display = 'block';
  }
});

function applyEffect(filter) {
  const v = document.getElementById('effectVideo');
  if (!v.src || v.style.display === 'none') { document.getElementById('effectMsg').textContent = '⚠️ Upload video first!'; return; }
  const canvas = document.getElementById('effectCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = v.videoWidth || 640;
  canvas.height = v.videoHeight || 360;
  const draw = () => {
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    if (filter !== 'none') {
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = img.data;
      if (filter === 'grayscale') {
        for (let i = 0; i < d.length; i += 4) {
          const g = 0.34 * d[i] + 0.5 * d[i+1] + 0.16 * d[i+2];
          d[i] = d[i+1] = d[i+2] = g;
        }
      } else if (filter === 'sepia') {
        for (let i = 0; i < d.length; i += 4) {
          let r = d[i], g = d[i+1], b = d[i+2];
          d[i] = Math.min(255, r*0.393 + g*0.769 + b*0.189);
          d[i+1] = Math.min(255, r*0.349 + g*0.686 + b*0.168);
          d[i+2] = Math.min(255, r*0.272 + g*0.534 + b*0.131);
        }
      } else if (filter === 'brightness') {
        for (let i = 0; i < d.length; i++) d[i] = Math.min(255, d[i] * 1.3);
      }
      ctx.putImageData(img, 0, 0);
    }
    requestAnimationFrame(draw);
  };
  v.play();
  setTimeout(draw, 100);
  document.getElementById('effectMsg').textContent = '✅ Filter: ' + filter;
}

function downloadEffect() {
  const v = document.getElementById('effectVideo');
  if (!v.src) { document.getElementById('effectMsg').textContent = '⚠️ Upload video!'; return; }
  const a = document.createElement('a');
  a.href = v.src;
  a.download = 'video_effect.mp4';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  document.getElementById('effectMsg').textContent = '✅ Download started!';
}

// =============================================
// 16. SLIDERS
// =============================================
function setupSliders() {
  const r = document.getElementById('audioRate');
  const rv = document.getElementById('rateVal');
  if (r && rv) r.addEventListener('input', () => rv.textContent = r.value);
}

