// =============================================
// 1. NAVIGATION & PAGE SWITCHING
// =============================================
let currentUser = null;

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

function showPage(page) {
  // Hide all pages
  document.getElementById('homePage').style.display = 'none';
  document.getElementById('studioPage').style.display = 'none';
  document.getElementById('dashboardPage').style.display = 'none';

  // Show selected page
  if (page === 'home') document.getElementById('homePage').style.display = 'block';
  else if (page === 'studio') {
    document.getElementById('studioPage').style.display = 'block';
    document.getElementById('studioPage').scrollIntoView({ behavior: 'smooth' });
  } else if (page === 'dashboard') {
    if (!currentUser) {
      alert('Please login first!');
      openModal('login');
      return;
    }
    document.getElementById('dashboardPage').style.display = 'block';
    document.getElementById('dashboardUsername').textContent = currentUser.name;
    document.getElementById('dashboardEmail').textContent = currentUser.email;
    document.getElementById('dashboardSince').textContent = new Date().toLocaleDateString();
  }

  // Update active nav link
  document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.textContent.includes(page.charAt(0).toUpperCase() + page.slice(1))) {
      link.classList.add('active');
    }
  });

  // Close mobile menu
  document.getElementById('navLinks').classList.remove('open');
}

// =============================================
// 2. AUTHENTICATION (Login/Signup)
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

function closeModal() {
  document.getElementById('authModal').style.display = 'none';
}

function switchAuthMode() {
  isLoginMode = !isLoginMode;
  openModal(isLoginMode ? 'login' : 'signup');
}

function handleAuth() {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();
  const name = document.getElementById('authName').value.trim();

  if (!email || !password) {
    alert('Email and password required!');
    return;
  }
  if (!isLoginMode && !name) {
    alert('Full name required for signup!');
    return;
  }

  // Simple local storage authentication (demo)
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  if (isLoginMode) {
    // LOGIN
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      currentUser = user;
      updateUI();
      closeModal();
      showPage('dashboard');
      document.getElementById('message').textContent = '✅ Welcome back, ' + user.name + '!';
    } else {
      alert('❌ Invalid email or password!');
    }
  } else {
    // SIGNUP
    if (users.find(u => u.email === email)) {
      alert('❌ Email already registered!');
      return;
    }
    const newUser = { email, password, name, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = newUser;
    updateUI();
    closeModal();
    showPage('dashboard');
    document.getElementById('message').textContent = '✅ Account created! Welcome, ' + name + '!';
  }
}

function logoutUser() {
  currentUser = null;
  updateUI();
  showPage('home');
  document.getElementById('message').textContent = '👋 Logged out successfully!';
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

// Check if user already logged in (session)
window.onload = function() {
  // Check local storage for logged in user
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateUI();
  }
  // Load voices
  loadVoices();
};

// Save user on login
const origHandleAuth = handleAuth;
handleAuth = function() {
  origHandleAuth();
  if (currentUser) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }
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
// 5. FREE AI VIDEO
// =============================================
async function generateFreeVideo() {
  const script = document.getElementById('script').value.trim();
  if (!script) {
    document.getElementById('message').textContent = '⚠️ Pehle script likho!';
    return;
  }
  document.getElementById('message').textContent = '⏳ Video generate ho rahi hai...';
  
  try {
    const prompt = encodeURIComponent(script);
    const videoUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1280&height=720&nologo=true`;
    document.getElementById('message').textContent = '✅ Video ready! (Check console for URL)';
    console.log('Video URL:', videoUrl);
    // Open video in new tab
    window.open(videoUrl, '_blank');
  } catch(error) {
    document.getElementById('message').textContent = '❌ Error: ' + error.message;
  }
}

// =============================================
// 6. SLIDER UI UPDATES
// =============================================
document.addEventListener('DOMContentLoaded', function() {
  ['rate','pitch'].forEach(id => {
    const slider = document.getElementById(id + 'Slider');
    const display = document.getElementById(id + 'Value');
    if (slider && display) {
      slider.addEventListener('input', () => display.textContent = slider.value);
    }
  });
});
