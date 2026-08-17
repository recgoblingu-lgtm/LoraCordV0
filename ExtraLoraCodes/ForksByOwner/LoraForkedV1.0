// ==UserScript==
// @name         Lora Hub v2 (Improved)
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {

/* =========================
   STATE SYSTEM
========================= */

const state = {
  fx: null,
  theme: null,
  activeTab: "home"
};

/* =========================
   ROOT UI
========================= */

const root = document.createElement("div");
root.id = "lora-root";
root.style = `
position:fixed;
top:80px;
left:80px;
width:420px;
height:520px;
background:#1a1a1a;
color:white;
font-family:monospace;
z-index:999999;
border:1px solid #444;
display:none;
overflow:hidden;
`;

root.innerHTML = `
<div id="header" style="background:#2b2b2b;padding:6px;cursor:move;display:flex;justify-content:space-between;">
  <span>Lora Hub v2</span>
  <span id="close" style="cursor:pointer;color:red;">X</span>
</div>

<div style="display:flex;background:#222;">
  <button data-tab="home">Home</button>
  <button data-tab="themes">Themes</button>
  <button data-tab="fx">FX</button>
  <button data-tab="tools">Tools</button>
</div>

<div id="content" style="padding:10px;height:430px;overflow:auto;"></div>
`;

document.body.appendChild(root);

/* =========================
   OPEN BUTTON
========================= */

const btn = document.createElement("div");
btn.innerText = "LORA HUB";
btn.style = `
position:fixed;
bottom:10px;
right:10px;
padding:6px 10px;
background:#333;
color:white;
z-index:999999;
cursor:pointer;
font-family:monospace;
border:1px solid #666;
`;
document.body.appendChild(btn);

btn.onclick = () => {
  root.style.display = root.style.display === "block" ? "none" : "block";
};

root.querySelector("#close").onclick = () => root.style.display = "none";

/* =========================
   DRAG SYSTEM (NEW)
========================= */

let drag = false;
let offsetX = 0;
let offsetY = 0;

const header = root.querySelector("#header");

header.onmousedown = (e) => {
  drag = true;
  offsetX = e.clientX - root.offsetLeft;
  offsetY = e.clientY - root.offsetTop;
};

document.onmousemove = (e) => {
  if (!drag) return;
  root.style.left = (e.clientX - offsetX) + "px";
  root.style.top = (e.clientY - offsetY) + "px";
};

document.onmouseup = () => drag = false;

/* =========================
   UI RENDERER
========================= */

const content = root.querySelector("#content");

function render(tab) {
  state.activeTab = tab;

  if (tab === "home") {
    content.innerHTML = `
      <h3>Welcome to Lora Hub v2</h3>
      <p>Improved UI system + modular features</p>
    `;
  }

  if (tab === "themes") {
    content.innerHTML = `
      <button onclick="applyTheme('invert(1)')">Invert</button>
      <button onclick="applyTheme('hue-rotate(180deg)')">Neon</button>
      <button onclick="applyTheme('contrast(1.5)')">Contrast</button>
      <button onclick="applyTheme('none')">Reset</button>
    `;
  }

  if (tab === "fx") {
    content.innerHTML = `
      <button onclick="shake()">Shake</button>
      <button onclick="glitch()">Glitch</button>
      <button onclick="rainbow()">Rainbow</button>
      <button onclick="clearFX()">Clear</button>
    `;
  }

  if (tab === "tools") {
    content.innerHTML = `
      <button onclick="copyURL()">Copy URL</button>
      <button onclick="titleSpam()">Spam Title</button>
      <button onclick="fps()">FPS Counter</button>
    `;
  }
}

/* =========================
   TAB SWITCHING
========================= */

root.querySelectorAll("button[data-tab]").forEach(b=>{
  b.onclick = () => render(b.dataset.tab);
});

render("home");

/* =========================
   FEATURE ENGINE
========================= */

function applyTheme(v){
  document.body.style.filter = v;
}

function shake(){
  setInterval(()=>{
    document.body.style.transform = `translate(${Math.random()*4}px,${Math.random()*4}px)`;
  },100);
}

function glitch(){
  setInterval(()=>{
    document.body.style.filter = "contrast(2)";
    setTimeout(()=>document.body.style.filter="",100);
  },300);
}

function rainbow(){
  document.body.style.animation = "rain 3s infinite";
  const s = document.createElement("style");
  s.textContent = `
    @keyframes rain {
      0%{filter:hue-rotate(0deg);}
      100%{filter:hue-rotate(360deg);}
    }
  `;
  document.head.appendChild(s);
}

function clearFX(){
  document.body.style.filter = "";
  document.body.style.transform = "";
}

/* =========================
   TOOLS
========================= */

function copyURL(){
  navigator.clipboard.writeText(location.href);
}

function titleSpam(){
  setInterval(()=>document.title="Lora "+Math.random(),300);
}

function fps(){
  if(document.getElementById("fps")) return;

  const el = document.createElement("div");
  el.id="fps";
  el.style="position:fixed;top:5px;left:5px;color:lime;z-index:999999;font-family:monospace";
  document.body.appendChild(el);

  let last=performance.now(),frames=0;

  function loop(){
    frames++;
    let now=performance.now();
    if(now-last>1000){
      el.innerText="FPS: "+frames;
      frames=0;
      last=now;
    }
    requestAnimationFrame(loop);
  }
  loop();
}

/* expose */
window.applyTheme = applyTheme;
window.shake = shake;
window.glitch = glitch;
window.rainbow = rainbow;
window.clearFX = clearFX;
window.copyURL = copyURL;
window.titleSpam = titleSpam;
window.fps = fps;

})();
