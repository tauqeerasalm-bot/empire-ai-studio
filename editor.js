// =============================================
// IMAGE EDITOR (Canvas-based — free, no API key)
// =============================================
let editorImg = null;      // original loaded image
let editorRotation = 0;    // current rotation in degrees
let editorFlipH = 1;       // 1 or -1
let editorFlipV = 1;       // 1 or -1
let editorFilter = 'none';
let editorBrightness = 0;
let editorContrast = 0;

function getEditorCanvas() {
  return document.getElementById('editorCanvas');
}

function showEditorCanvas() {
  document.getElementById('editorCanvas').style.display = 'block';
  document.getElementById('editorPlaceholder').style.display = 'none';
}

// ---- Load image (generate via Pollinations) ----
function genEditorImage() {
  const prompt = document.getElementById('editorPrompt').value.trim();
  const msg = document.getElementById('editorMsg');
  if (!prompt) { msg.textContent = '⚠️ Describe an image first!'; return; }
  msg.textContent = '⏳ Generating...';

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&nologo=true`;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    loadImageToEditor(img);
    msg.textContent = '✅ Image ready — edit below!';
  };
  img.onerror = () => { msg.textContent = '❌ Failed to load image.'; };
  img.src = url;
}

// ---- Load image (user upload) ----
function uploadEditorImage(event) {
  const file = event.target.files[0];
  const msg = document.getElementById('editorMsg');
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      loadImageToEditor(img);
      msg.textContent = '✅ Image loaded — edit below!';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function loadImageToEditor(img) {
  editorImg = img;
  editorRotation = 0;
  editorFlipH = 1;
  editorFlipV = 1;
  editorFilter = 'none';
  editorBrightness = 0;
  editorContrast = 0;
  document.getElementById('editorBrightness').value = 0;
  document.getElementById('editorContrast').value = 0;
  showEditorCanvas();
  drawEditor();
}

// ---- Core draw routine: applies rotation, flip, filter, brightness/contrast ----
function drawEditor() {
  if (!editorImg) return;
  const canvas = getEditorCanvas();
  const ctx = canvas.getContext('2d');
  const w = editorImg.naturalWidth || editorImg.width;
  const h = editorImg.naturalHeight || editorImg.height;

  const swap = editorRotation % 180 !== 0;
  canvas.width = swap ? h : w;
  canvas.height = swap ? w : h;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((editorRotation * Math.PI) / 180);
  ctx.scale(editorFlipH, editorFlipV);
  ctx.drawImage(editorImg, -w / 2, -h / 2, w, h);
  ctx.restore();

  // Apply filter + brightness/contrast via pixel manipulation
  if (editorFilter !== 'none' || editorBrightness !== 0 || editorContrast !== 0) {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;
    const contrastFactor = (259 * (editorContrast + 255)) / (255 * (259 - editorContrast));

    for (let i = 0; i < d.length; i += 4) {
      let r = d[i], g = d[i + 1], b = d[i + 2];

      if (editorFilter === 'grayscale') {
        const avg = (r + g + b) / 3;
        r = g = b = avg;
      } else if (editorFilter === 'sepia') {
        const tr = 0.393 * r + 0.769 * g + 0.189 * b;
        const tg = 0.349 * r + 0.686 * g + 0.168 * b;
        const tb = 0.272 * r + 0.534 * g + 0.131 * b;
        r = Math.min(255, tr); g = Math.min(255, tg); b = Math.min(255, tb);
      } else if (editorFilter === 'invert') {
        r = 255 - r; g = 255 - g; b = 255 - b;
      }

      // brightness
      r += editorBrightness; g += editorBrightness; b += editorBrightness;
      // contrast
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;

      d[i] = Math.max(0, Math.min(255, r));
      d[i + 1] = Math.max(0, Math.min(255, g));
      d[i + 2] = Math.max(0, Math.min(255, b));
    }
    ctx.putImageData(imgData, 0, 0);
  }
}

// ---- Filters ----
function applyEditorFilter(type) {
  if (!editorImg) { document.getElementById('editorMsg').textContent = '⚠️ Generate or upload an image first!'; return; }
  editorFilter = type;
  drawEditor();
  document.getElementById('editorMsg').textContent = type === 'none' ? '✅ Reset!' : `✅ Filter: ${type}`;
}

// ---- Brightness / Contrast sliders ----
function applyEditorAdjust() {
  if (!editorImg) return;
  editorBrightness = parseInt(document.getElementById('editorBrightness').value, 10);
  editorContrast = parseInt(document.getElementById('editorContrast').value, 10);
  drawEditor();
}

// ---- Rotate ----
function rotateEditor(deg) {
  if (!editorImg) { document.getElementById('editorMsg').textContent = '⚠️ Generate or upload an image first!'; return; }
  editorRotation = (editorRotation + deg) % 360;
  drawEditor();
  document.getElementById('editorMsg').textContent = '✅ Rotated!';
}

// ---- Flip ----
function flipEditor(axis) {
  if (!editorImg) { document.getElementById('editorMsg').textContent = '⚠️ Generate or upload an image first!'; return; }
  if (axis === 'h') editorFlipH *= -1;
  if (axis === 'v') editorFlipV *= -1;
  drawEditor();
  document.getElementById('editorMsg').textContent = '✅ Flipped!';
}

// ---- Download ----
function downloadEditor() {
  const canvas = getEditorCanvas();
  if (!editorImg) { document.getElementById('editorMsg').textContent = '⚠️ Nothing to download yet!'; return; }
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = 'edited-image.png';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  document.getElementById('editorMsg').textContent = '✅ Download started!';
}
