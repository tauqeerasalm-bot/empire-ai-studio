/* Empire Video Editor module */
(function(){const s={file:null,url:null,video:null,start:0,end:0,speed:1,volume:1,tracks:[],text:[]};
window.EmpireVideoEditor={state:s,attach(v){s.video=v;v.onloadedmetadata=()=>s.end=v.duration||0;return this},
load(f){if(!f)return;if(s.url)URL.revokeObjectURL(s.url);s.file=f;s.url=URL.createObjectURL(f);if(s.video){s.video.src=s.url;s.video.load()}return s.url},
trim(a,b){s.start=Math.max(0,+a||0);s.end=Math.max(s.start,+b||0);return{s:s.start,e:s.end}},
speed(v){s.speed=+v||1;if(s.video)s.video.playbackRate=s.speed},volume(v){s.volume=Math.max(0,Math.min(1,+v||0));if(s.video)s.video.volume=s.volume},
split(t){return{type:"split",time:+t||0}},addTrack(x){s.tracks.push(x);return x},addText(x,o={}){let v={text:x,...o};s.text.push(v);return v},clear(){s.tracks=[];s.text=[];s.file=null}}})();