/* Empire AI Studio - Premium Tool Hub */
(function(){
"use strict";
function init(){
  const dash=document.getElementById("content-dashboard");
  if(!dash || document.getElementById("empirePremiumHub")) return;

  const css=document.createElement("style");
  css.textContent=`
  #empirePremiumHub{margin-top:24px}
  .eph-title{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}
  .eph-title h3{margin:0;color:#d4af37}.eph-title span{color:#777;font-size:12px}
  .eph-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:12px}
  .eph-card{background:linear-gradient(145deg,#1b1b27,#111118);border:1px solid #2f2f40;border-radius:15px;padding:17px 13px;color:#fff;cursor:pointer;text-align:left;transition:.18s;min-height:108px}
  .eph-card:hover{transform:translateY(-3px);border-color:#d4af37;box-shadow:0 8px 25px #0008}
  .eph-icon{font-size:29px;margin-bottom:9px}.eph-name{font-weight:700}.eph-desc{font-size:11px;color:#888;margin-top:5px;line-height:1.35}
  .eph-modal{position:fixed;inset:0;background:#000b;z-index:10000;display:none;align-items:center;justify-content:center;padding:18px}
  .eph-box{width:min(720px,100%);max-height:90vh;overflow:auto;background:#15151d;border:1px solid #3a3a4a;border-radius:20px;padding:20px;box-shadow:0 25px 80px #000}
  .eph-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:15px}.eph-head h2{margin:0;color:#d4af37}
  .eph-close{border:0;background:#292936;color:#fff;border-radius:10px;padding:8px 12px;font-size:18px;cursor:pointer}
  .eph-tools{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:9px}
  .eph-action{background:#20202d;border:1px solid #38384a;color:#fff;border-radius:10px;padding:11px;cursor:pointer}
  .eph-action:hover{border-color:#d4af37}
  .eph-note{color:#999;font-size:13px;margin:0 0 15px}
  `;
  document.head.appendChild(css);

  const section=document.createElement("section");
  section.id="empirePremiumHub";
  section.innerHTML=`
    <div class="eph-title"><h3>👑 Premium Studio Tools</h3><span>Every tool has its own workspace</span></div>
    <div class="eph-grid">
      <button class="eph-card" data-open="video"><div class="eph-icon">🎬</div><div class="eph-name">Video Editor</div><div class="eph-desc">Timeline, trim, split & effects</div></button>
      <button class="eph-card" data-open="audio"><div class="eph-icon">🎵</div><div class="eph-name">Audio Studio</div><div class="eph-desc">Cut, record, voice & music</div></button>
      <button class="eph-card" data-open="image"><div class="eph-icon">🖼️</div><div class="eph-name">Image Studio</div><div class="eph-desc">Edit, filters & enhancement</div></button>
      <button class="eph-card" data-open="timeline"><div class="eph-icon">⏱️</div><div class="eph-name">Timeline</div><div class="eph-desc">Multi-track editing workspace</div></button>
      <button class="eph-card" data-open="captions"><div class="eph-icon">📝</div><div class="eph-name">Captions</div><div class="eph-desc">Subtitles & SRT tools</div></button>
      <button class="eph-card" data-open="templates"><div class="eph-icon">✨</div><div class="eph-name">Templates</div><div class="eph-desc">TikTok, Reels & YouTube</div></button>
      <button class="eph-card" data-open="ai"><div class="eph-icon">🤖</div><div class="eph-name">AI Tools</div><div class="eph-desc">Image, video, voice & text</div></button>
      <button class="eph-card" data-open="voice"><div class="eph-icon">🎙️</div><div class="eph-name">Voice Studio</div><div class="eph-desc">TTS, recording & dubbing</div></button>
      <button class="eph-card" data-open="effects"><div class="eph-icon">🎨</div><div class="eph-name">Effects</div><div class="eph-desc">Filters, blur & visual effects</div></button>
      <button class="eph-card" data-open="projects"><div class="eph-icon">📁</div><div class="eph-name">Projects</div><div class="eph-desc">Save and manage projects</div></button>
      <button class="eph-card" data-open="social"><div class="eph-icon">📱</div><div class="eph-name">Social Export</div><div class="eph-desc">Ready sizes for social media</div></button>
      <button class="eph-card" data-open="store"><div class="eph-icon">💾</div><div class="eph-name">Project Storage</div><div class="eph-desc">Save projects locally</div></button>
    </div>`;
  const recent=dash.querySelector("#recentProjects");
  (recent?.parentElement || dash).after(section);

  const modal=document.createElement("div");
  modal.className="eph-modal"; modal.id="ephModal";
  modal.innerHTML=`<div class="eph-box"><div class="eph-head"><h2 id="ephModalTitle">Tool</h2><button class="eph-close" id="ephClose">✕</button></div><p class="eph-note" id="ephNote"></p><div class="eph-tools" id="ephTools"></div></div>`;
  document.body.appendChild(modal);

  const data={
    video:["🎬 Video Editor","Open the dedicated video editing workspace.","video","Trim","Split","Merge","Add Text","Add Audio","Speed","Filters","Export"],
    audio:["🎵 Audio Studio","Audio tools are separated so they can grow independently.","audio","Upload Audio","Record Voice","Cut","Merge","Noise Reduction","Voice Enhance","Text → Speech"],
    image:["🖼️ Image Studio","Professional image editing tools.","image","Crop","Resize","Filters","Brightness","Contrast","Background Remove","Object Remove","Upscale"],
    timeline:["⏱️ Timeline","Multi-track editing foundation.","timeline","Video Track","Image Track","Audio Track","Text Track","Add Clip","Split Clip"],
    captions:["📝 Captions","Subtitle workspace.","captions","Import SRT","Export SRT","Auto Captions","Translate","Style Captions"],
    templates:["✨ Templates","Social-ready project templates.","templates","TikTok 9:16","Reels 9:16","YouTube 16:9","Square 1:1"],
    ai:["🤖 AI Tools","AI generation adapters—connect your own backend.","ai","Text → Image","Image → Image","Text → Video","Image → Video","Text → Speech","Speech → Text","Translate"],
    voice:["🎙️ Voice Studio","Voice generation and recording.","voice","Record","Text → Speech","Speech → Text","Dubbing","Voice Clone"],
    effects:["🎨 Effects","Visual effects workspace.","effects","Grayscale","Sepia","Blur","Brightness","Contrast","Saturation"],
    projects:["📁 Projects","Manage your saved projects.","projects","New Project","Open Project"],
    social:["📱 Social Export","Presets for popular platforms.","social","TikTok","Reels","YouTube","Square"],
    store:["💾 Project Storage","Local project save/load foundation.","store","Save Project","Load Projects","Delete Project"]
  };

  function open(key){
    const d=data[key]||data.video;
    document.getElementById("ephModalTitle").textContent=d[0];
    document.getElementById("ephNote").textContent=d[1];
    const box=document.getElementById("ephTools"); box.innerHTML="";
    d.slice(3).forEach(label=>{
      const b=document.createElement("button"); b.className="eph-action"; b.textContent=label;
      b.onclick=()=>route(key,label); box.appendChild(b);
    });
    modal.style.display="flex";
  }
  function route(key,label){
    const map={video:"video",audio:"audio",image:"image",captions:"captions",effects:"effects",projects:"projects"};
    if(map[key] && typeof window.switchTool==="function"){modal.style.display="none";window.switchTool(map[key]);return;}
    if(key==="voice" && typeof window.switchTool==="function"){modal.style.display="none";window.switchTool("audio");return;}
    alert(label+" is ready in the modular workspace. The next step is connecting its full processing engine.");
  }
  section.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>open(b.dataset.open)));
  document.getElementById("ephClose").onclick=()=>modal.style.display="none";
  modal.addEventListener("click",e=>{if(e.target===modal)modal.style.display="none"});
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();