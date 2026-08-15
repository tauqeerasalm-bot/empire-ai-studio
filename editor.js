// =============================================
// IMAGE EDITOR (Canvas-based — free, no API key)
// =============================================
let editorImg = null;      // original loaded image
let editorRotation = 0;    // current rotation in degrees
let editorFlipH = 1;       // 1 or -1
let editorFlipV = 1;       // 1 or -1
let editorPreset = 'none'; // none, grayscale, sepia, invert, vintage, warm, cool, noir, vivid, soft
let editorBrightness = 0;
let editorContrast = 0;
let editorSaturation = 0;
let editorBlur = 0;
let editorHue = 0;

function getEditorCanvas() {
  return document.getElementById('editorCanvas');
}

function showEditorCanvas() {
  document.getElementById('editorCanvas').style.display = 'block';
  document.getElementById('editorPlaceholder').style.display = 'none';
}

function resetEditorState() {
  editorRotation = 0; editorFlipH = 1; editorFlipV = 1;
  editorPreset = 'none';
  editorBrightness = 0; editorContrast = 0; editorSaturation = 0; editorBlur = 0; editorHue = 0;
  ['editorBrightness','editorContrast','editorSaturation','editorBlur','editorHue'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 0;
  });
}

// ---- Build a combined CSS filter string from sliders + preset ----
function buildEditorFilterString() {
  const brightnessPct = 100 + editorBrightness;
  const contrastPct = 100 + editorContrast;
  const saturatePct = 100 + editorSaturation;

  let parts = [
    `brightness(${brightnessPct}%)`,
    `contrast(${contrastPct}%)`,
    `saturate(${saturatePct}%)`
  ];
  if (editorBlur > 0) parts.push(`blur(${editorBlur}px)`);
  if (editorHue > 0) parts.push(`hue-rotate(${editorHue}deg)`);

  switch (editorPreset) {
    case 'grayscale': parts.push('grayscale(100%)'); break;
    case 'sepia': parts.push('sepia(100%)'); break;
    case 'invert': parts.push('invert(100%)'); break;
    case 'vintage': parts.push('sepia(45%) contrast(92%) brightness(97%) saturate(85%)'); break;
    case 'warm': parts.push('sepia(28%) saturate(130%) brightness(103%)'); break;
    case 'cool': parts.push('hue-rotate(180deg) saturate(115%)'); break;
    case 'noir': parts.push('grayscale(100%) contrast(130%) brightness(95%)'); break;
    case 'vivid': parts.push('saturate(180%) contrast(112%)'); break;
    case 'soft': parts.push('saturate(85%) brightness(105%) contrast(92%)'); break;
    // 'none' -> no extra preset term
  }
  return parts.join(' ');
}

// ---- Core draw routine: applies rotation, flip, and combined filter ----
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
  ctx.filter = buildEditorFilterString();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((editorRotation * Math.PI) / 180);
  ctx.scale(editorFlipH, editorFlipV);
  ctx.drawImage(editorImg, -w / 2, -h / 2, w, h);
  ctx.restore();
  ctx.filter = 'none'; // reset so text/watermark draw crisp, unfiltered
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
  resetEditorState();
  showEditorCanvas();
  drawEditor();
}

// ---- Filters ----
function applyEditorFilter(type) {
  if (!editorImg) { document.getElementById('editorMsg').textContent = '⚠️ Generate or upload an image first!'; return; }
  editorPreset = type;
  drawEditor();
  document.getElementById('editorMsg').textContent = type === 'none' ? '✅ Reset!' : `✅ Filter: ${type}`;
}

// ---- Brightness / Contrast / Saturation / Blur / Hue sliders ----
function applyEditorAdjust() {
  if (!editorImg) return;
  editorBrightness = parseInt(document.getElementById('editorBrightness').value, 10);
  editorContrast = parseInt(document.getElementById('editorContrast').value, 10);
  editorSaturation = parseInt(document.getElementById('editorSaturation').value, 10);
  editorBlur = parseInt(document.getElementById('editorBlur').value, 10);
  editorHue = parseInt(document.getElementById('editorHue').value, 10);
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

// ---- Text Overlay: draggable live preview, baked into canvas on Apply ----
let editorTextStyles = { bold: false, italic: false, outline: true, shadow: false };
let editorTextDragging = false;
let editorTextDragOffset = { x: 0, y: 0 };

function toggleEditorTextStyle(style, btn) {
  editorTextStyles[style] = !editorTextStyles[style];
  btn.style.background = editorTextStyles[style] ? '#d4af37' : '';
  btn.style.color = editorTextStyles[style] ? '#111' : '';
  updateEditorTextPreview();
}

function buildEditorFontString(size) {
  const family = document.getElementById('editorFontFamily').value;
  let prefix = '';
  if (editorTextStyles.italic) prefix += 'italic ';
  if (editorTextStyles.bold) prefix += 'bold ';
  return `${prefix}${size}px ${family}`;
}

function getOrCreateTextPreview() {
  let el = document.getElementById('editorTextPreview');
  if (!el) {
    el = document.createElement('div');
    el.id = 'editorTextPreview';
    el.style.position = 'absolute';
    el.style.cursor = 'grab';
    el.style.userSelect = 'none';
    el.style.whiteSpace = 'nowrap';
    el.style.padding = '2px 6px';
    document.getElementById('editorCanvasWrap').appendChild(el);
    el.addEventListener('pointerdown', startEditorTextDrag);
  }
  return el;
}

function updateEditorTextPreview(forceShow) {
  const text = document.getElementById('editorTextInput').value;
  const msg = document.getElementById('editorMsg');
  if (!editorImg) { if (forceShow) msg.textContent = '⚠️ Generate or upload an image first!'; return; }
  if (!text.trim()) { cancelEditorTextPreview(); return; }

  const el = getOrCreateTextPreview();
  const color = document.getElementById('editorTextColor').value;
  const size = parseInt(document.getElementById('editorTextSize').value, 10);
  const family = document.getElementById('editorFontFamily').value;

  el.textContent = text;
  el.style.display = 'block';
  el.style.color = color;
  el.style.fontFamily = family;
  el.style.fontSize = size + 'px';
  el.style.fontWeight = editorTextStyles.bold ? 'bold' : 'normal';
  el.style.fontStyle = editorTextStyles.italic ? 'italic' : 'normal';
  el.style.textShadow = editorTextStyles.outline
    ? '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
    : (editorTextStyles.shadow ? '2px 2px 6px rgba(0,0,0,0.8)' : 'none');

  // Center it the first time it appears
  if (!el.dataset.positioned) {
    const wrap = document.getElementById('editorCanvasWrap');
    el.style.left = (wrap.clientWidth / 2 - el.offsetWidth / 2) + 'px';
    el.style.top = (wrap.clientHeight / 2 - el.offsetHeight / 2) + 'px';
    el.dataset.positioned = '1';
  }
}

function startEditorTextDrag(e) {
  const el = e.currentTarget;
  editorTextDragging = true;
  el.style.cursor = 'grabbing';
  const rect = el.getBoundingClientRect();
  editorTextDragOffset.x = e.clientX - rect.left;
  editorTextDragOffset.y = e.clientY - rect.top;
  el.setPointerCapture(e.pointerId);
  el.addEventListener('pointermove', dragEditorText);
  el.addEventListener('pointerup', stopEditorTextDrag);
}

function dragEditorText(e) {
  if (!editorTextDragging) return;
  const el = e.currentTarget;
  const wrap = document.getElementById('editorCanvasWrap');
  const wrapRect = wrap.getBoundingClientRect();
  let x = e.clientX - wrapRect.left - editorTextDragOffset.x;
  let y = e.clientY - wrapRect.top - editorTextDragOffset.y;
  x = Math.max(0, Math.min(wrap.clientWidth - el.offsetWidth, x));
  y = Math.max(0, Math.min(wrap.clientHeight - el.offsetHeight, y));
  el.style.left = x + 'px';
  el.style.top = y + 'px';
}

function stopEditorTextDrag(e) {
  editorTextDragging = false;
  e.currentTarget.style.cursor = 'grab';
}

function cancelEditorTextPreview() {
  const el = document.getElementById('editorTextPreview');
  if (el) el.remove();
}

// ---- Bake the positioned preview text permanently into the canvas ----
function applyEditorText() {
  const msg = document.getElementById('editorMsg');
  if (!editorImg) { msg.textContent = '⚠️ Generate or upload an image first!'; return; }
  const text = document.getElementById('editorTextInput').value.trim();
  if (!text) { msg.textContent = '⚠️ Enter some text first!'; return; }

  const el = document.getElementById('editorTextPreview');
  const canvas = getEditorCanvas();
  const wrap = document.getElementById('editorCanvasWrap');
  const ctx = canvas.getContext('2d');

  const color = document.getElementById('editorTextColor').value;
  const size = parseInt(document.getElementById('editorTextSize').value, 10);

  // Map preview's on-screen position to actual canvas pixel coordinates
  const scaleX = canvas.width / wrap.clientWidth;
  const scaleY = canvas.height / wrap.clientHeight;
  let previewLeft = 0, previewTop = 0, previewW = 0, previewH = 0;
  if (el) {
    previewLeft = parseFloat(el.style.left) || 0;
    previewTop = parseFloat(el.style.top) || 0;
    previewW = el.offsetWidth;
    previewH = el.offsetHeight;
  } else {
    previewLeft = wrap.clientWidth / 2 - 40;
    previewTop = wrap.clientHeight / 2 - size / 2;
  }

  const x = (previewLeft + previewW / 2) * scaleX;
  const y = (previewTop + previewH * 0.75) * scaleY;
  const scaledSize = size * scaleX;

  ctx.font = buildEditorFontString(scaledSize);
  ctx.fillStyle = color;
  ctx.textAlign = 'center';

  if (editorTextStyles.shadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
  }
  if (editorTextStyles.outline) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = Math.max(2, scaledSize / 14);
    ctx.strokeText(text, x, y);
  }
  ctx.fillText(text, x, y);
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;

  document.getElementById('editorTextInput').value = '';
  cancelEditorTextPreview();
  msg.textContent = '✅ Text applied!';
}

// ---- Watermark (small, semi-transparent, bottom-right — baked into canvas) ----
function addEditorWatermark() {
  const msg = document.getElementById('editorMsg');
  if (!editorImg) { msg.textContent = '⚠️ Generate or upload an image first!'; return; }
  const text = document.getElementById('editorWatermarkInput').value.trim();
  if (!text) { msg.textContent = '⚠️ Enter watermark text first!'; return; }

  const canvas = getEditorCanvas();
  const ctx = canvas.getContext('2d');
  const size = Math.max(14, Math.round(canvas.width / 28));

  ctx.font = `${size}px Arial, sans-serif`;
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineWidth = 2;

  const x = canvas.width - 14;
  const y = canvas.height - 14;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);

  msg.textContent = '✅ Watermark added!';
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
