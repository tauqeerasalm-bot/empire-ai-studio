/* Empire AI Studio - Standalone Video Editor
   No external API key required for browser-side editing features.
*/
(function () {
  'use strict';

  function init() {
    if (document.getElementById('empire-video-editor-standalone')) return;

    const style = document.createElement('style');
    style.textContent = `
      #empire-video-editor-standalone{margin:24px auto;max-width:1200px;background:#0b1220;color:#fff;border:1px solid #263244;border-radius:18px;padding:18px;font-family:system-ui,sans-serif;box-sizing:border-box}
      #empire-video-editor-standalone *{box-sizing:border-box}
      .eve2-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px}.eve2-head h2{margin:0;font-size:22px}.eve2-head p{margin:4px 0 0;opacity:.7;font-size:13px}
      .eve2-row{display:flex;gap:8px;flex-wrap:wrap}.eve2-btn{border:1px solid #374151;background:#1f2937;color:#fff;border-radius:10px;padding:9px 13px;cursor:pointer}.eve2-btn.primary{background:#2563eb;border-color:#3b82f6}.eve2-btn.danger{background:#7f1d1d}.eve2-btn:disabled{opacity:.45;cursor:not-allowed}
      .eve2-main{display:grid;grid-template-columns:minmax(280px,1.3fr) minmax(280px,.9fr);gap:14px}.eve2-preview{background:#030712;border-radius:14px;min-height:330px;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden}.eve2-preview video{width:100%;max-height:560px;display:none}.eve2-empty{opacity:.55;padding:30px;text-align:center}
      .eve2-overlay{position:absolute;left:50%;top:45%;transform:translate(-50%,-50%);font-weight:800;font-size:32px;text-shadow:0 2px 8px #000;pointer-events:none;white-space:pre-wrap;text-align:center;display:none;z-index:3}
      .eve2-panel{background:#101827;border:1px solid #263244;border-radius:14px;padding:14px}.eve2-panel label{display:block;font-size:12px;opacity:.75;margin:8px 0 5px}.eve2-panel input,.eve2-panel select{width:100%;background:#0b1220;color:#fff;border:1px solid #374151;border-radius:8px;padding:8px}.eve2-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.eve2-range{width:100%}
      .eve2-timeline{margin-top:14px;background:#080d16;border:1px solid #263244;border-radius:12px;padding:10px}.eve2-track{height:42px;background:#111827;border-radius:8px;display:flex;align-items:center;padding:0 10px;margin:7px 0;overflow:hidden}.eve2-clip{background:#1d4ed8;border-radius:7px;padding:8px 12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:100px}.eve2-time{font-size:12px;opacity:.7;margin-left:auto;padding-left:10px}.eve2-status{font-size:12px;opacity:.75;margin-top:8px}
      @media(max-width:760px){.eve2-main{grid-template-columns:1fr}.eve2-head{flex-direction:column;align-items:flex-start}.eve2-preview{min-height:230px}}
    `;
    document.head.appendChild(style);

    const box = document.createElement('section');
    box.id = 'empire-video-editor-standalone';
    box.innerHTML = `
      <div class="eve2-head">
        <div><h2>🎬 Empire Video Editor</h2><p>Standalone editor — separate from your existing script.js</p></div>
        <div class="eve2-row"><button class="eve2-btn primary" id="eve2Add">＋ Add Video</button><button class="eve2-btn danger" id="eve2Clear">Clear</button></div>
      </div>
      <div class="eve2-main">
        <div class="eve2-preview">
          <video id="eve2Video" controls playsinline></video>
          <div id="eve2Empty" class="eve2-empty">Upload a video to start</div>
          <div id="eve2Overlay" class="eve2-overlay"></div>
        </div>
        <div class="eve2-panel">
          <label>Timeline</label>
          <input id="eve2Scrub" class="eve2-range" type="range" min="0" max="0" step="0.01" value="0">
          <div class="eve2-grid">
            <div><label>Start (sec)</label><input id="eve2Start" type="number" min="0" step="0.01" value="0"></div>
            <div><label>End (sec)</label><input id="eve2End" type="number" min="0" step="0.01" value="0"></div>
          </div>
          <div class="eve2-row" style="margin-top:10px">
            <button class="eve2-btn" id="eve2SetStart">Set Start</button><button class="eve2-btn" id="eve2SetEnd">Set End</button><button class="eve2-btn" id="eve2GoStart">↺ Start</button>
          </div>
          <label>Speed</label><select id="eve2Speed"><option>0.25</option><option>0.5</option><option>0.75</option><option selected>1</option><option>1.25</option><option>1.5</option><option>2</option></select>
          <label>Volume</label><input id="eve2Volume" class="eve2-range" type="range" min="0" max="1" step="0.01" value="1">
          <label>Text overlay</label><input id="eve2Text" type="text" placeholder="Type text for your video">
          <div class="eve2-row" style="margin-top:10px"><button class="eve2-btn" id="eve2ShowText">Apply Text</button><button class="eve2-btn" id="eve2HideText">Hide Text</button></div>
          <label>Audio</label><div class="eve2-row"><button class="eve2-btn" id="eve2Audio">＋ Add Audio</button><span id="eve2AudioName" class="eve2-status">No audio</span></div>
          <div class="eve2-row" style="margin-top:12px"><button class="eve2-btn primary" id="eve2Download">Download Source</button></div>
          <div id="eve2Status" class="eve2-status">Ready.</div>
        </div>
      </div>
      <div class="eve2-timeline">
        <div style="font-size:11px;opacity:.6">VIDEO TRACK</div>
        <div class="eve2-track"><div id="eve2Clip" class="eve2-clip">No video loaded</div><div id="eve2Duration" class="eve2-time">0.00s</div></div>
        <div style="font-size:11px;opacity:.6">AUDIO TRACK</div>
        <div class="eve2-track"><div id="eve2AudioClip" class="eve2-clip" style="background:#047857">No audio loaded</div></div>
      </div>
      <input id="eve2File" type="file" accept="video/*" hidden>
      <input id="eve2AudioFile" type="file" accept="audio/*" hidden>
    `;

    // Put the standalone editor near the end of the page so it doesn't interfere with existing UI.
    document.body.appendChild(box);

    const $ = id => document.getElementById(id);
    const file = $('eve2File'), audioFile = $('eve2AudioFile'), video = $('eve2Video');
    let videoUrl = null, audioUrl = null, videoBlob = null;

    $('eve2Add').onclick = () => file.click();
    $('eve2Audio').onclick = () => audioFile.click();

    file.onchange = () => {
      const f = file.files && file.files[0]; if (!f) return;
      videoBlob = f;
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      videoUrl = URL.createObjectURL(f);
      video.src = videoUrl;
      video.style.display = 'block';
      $('eve2Empty').style.display = 'none';
      $('eve2Clip').textContent = f.name;
      $('eve2Status').textContent = 'Video loaded.';
    };

    audioFile.onchange = () => {
      const f = audioFile.files && audioFile.files[0]; if (!f) return;
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      audioUrl = URL.createObjectURL(f);
      $('eve2AudioName').textContent = f.name;
      $('eve2AudioClip').textContent = f.name;
      $('eve2Status').textContent = 'Audio selected. Audio mixing/export will be added in the rendering phase.';
    };

    video.onloadedmetadata = () => {
      const d = video.duration || 0;
      $('eve2Scrub').max = d; $('eve2End').value = d.toFixed(2); $('eve2Duration').textContent = d.toFixed(2)+'s';
    };
    video.ontimeupdate = () => { $('eve2Scrub').value = video.currentTime || 0; };
    $('eve2Scrub').oninput = e => { video.currentTime = Number(e.target.value); };
    $('eve2Speed').onchange = e => { video.playbackRate = Number(e.target.value); };
    $('eve2Volume').oninput = e => { video.volume = Number(e.target.value); };
    $('eve2SetStart').onclick = () => { $('eve2Start').value = (video.currentTime||0).toFixed(2); };
    $('eve2SetEnd').onclick = () => { $('eve2End').value = (video.currentTime||0).toFixed(2); };
    $('eve2GoStart').onclick = () => { video.currentTime = Number($('eve2Start').value)||0; };
    $('eve2ShowText').onclick = () => { const t=$('eve2Text').value.trim(); $('eve2Overlay').textContent=t; $('eve2Overlay').style.display=t?'block':'none'; };
    $('eve2HideText').onclick = () => { $('eve2Overlay').style.display='none'; };
    $('eve2Download').onclick = () => {
      if (!videoBlob) { alert('Please add a video first.'); return; }
      const a=document.createElement('a'); a.href=videoUrl; a.download=videoBlob.name || 'empire-video.mp4'; document.body.appendChild(a); a.click(); a.remove();
    };
    $('eve2Clear').onclick = () => {
      video.pause(); video.removeAttribute('src'); video.load(); video.style.display='none'; $('eve2Empty').style.display='block';
      $('eve2Clip').textContent='No video loaded'; $('eve2Duration').textContent='0.00s'; $('eve2AudioClip').textContent='No audio loaded'; $('eve2AudioName').textContent='No audio'; $('eve2Overlay').style.display='none'; $('eve2Status').textContent='Ready.'; videoBlob=null;
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
