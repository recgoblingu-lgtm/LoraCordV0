// ==UserScript==
// @name         Lora Hub FULL (Stable Build)
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {

/* =========================
   STATE
========================= */

let drag = false;
let offsetX = 0;
let offsetY = 0;
let rainbowInterval = null;

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
  <span>Lora Hub FULL</span>
  <span id="close" style="cursor:pointer;color:red;">X</span>
</div>

<div style="display:flex;background:#222;">
  <button data-tab="home">Home</button>
  <button data-tab="themes">Themes</button>
  <button data-tab="fx">FX</button>
  <button data-tab="tools">Tools</button>
  <button data-tab="rainbow">Rainbow</button>
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
   DRAG SYSTEM
========================= */

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
   UI
========================= */

const content = root.querySelector("#content");

function render(tab) {

  if (tab === "home") {
    content.innerHTML = `
      <h3>Lora Hub FULL</h3>
      <p>Stable modular UI system</p>
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
      <button onclick="clearFX()">Clear</button>
    `;
  }

  if (tab === "tools") {
    content.innerHTML = `
      <button onclick="copyURL()">Copy URL</button>
      <button onclick="fps()">FPS</button>
    `;
  }

  if (tab === "rainbow") {
    content.innerHTML = `
      <button onclick="rainbowFull()">Start Rainbow</button>
      <button onclick="stopRainbow()">Stop Rainbow</button>
    `;
  }
}

root.querySelectorAll("button[data-tab]").forEach(b=>{
  b.onclick = () => render(b.dataset.tab);
});

render("home");

/* =========================
   CORE FUNCTIONS
========================= */

function applyTheme(v){
  document.body.style.filter = v;
}

function shake(){
  setInterval(()=>{
    document.body.style.transform =
      `translate(${Math.random()*3}px,${Math.random()*3}px)`;
  },100);
}

function glitch(){
  setInterval(()=>{
    document.body.style.filter = "contrast(2)";
    setTimeout(()=>document.body.style.filter="",100);
  },300);
}

function clearFX(){
  document.body.style.filter = "";
  document.body.style.transform = "";
}

function copyURL(){
  navigator.clipboard.writeText(location.href);
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

/* =========================
   🌈 FIXED RAINBOW ENGINE
========================= */

function rainbowFull() {

  if (rainbowInterval) clearInterval(rainbowInterval);

  let layer = document.getElementById("lora-rainbow");

  if (!layer) {
    layer = document.createElement("div");
    layer.id = "lora-rainbow";
    layer.style = `
      position:fixed;
      top:0;
      left:0;
      width:100vw;
      height:100vh;
      z-index:999998;
      pointer-events:none;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(layer);
  }

  let hue = 0;

  rainbowInterval = setInterval(() => {

    hue += 2;

    layer.style.background = `
      linear-gradient(
        120deg,
        hsl(${hue},100%,55%),
        hsl(${hue+60},100%,55%),
        hsl(${hue+120},100%,55%)
      )
    `;

    document.body.style.filter =
      `hue-rotate(${hue}deg) saturate(2) contrast(1.3)`;

  }, 16);
}

function stopRainbow() {
  clearInterval(rainbowInterval);
  rainbowInterval = null;

  const layer = document.getElementById("lora-rainbow");
  if (layer) layer.remove();

  document.body.style.filter = "";
}

/* =========================
   EXPORT
========================= */

window.applyTheme = applyTheme;
window.shake = shake;
window.glitch = glitch;
window.clearFX = clearFX;
window.copyURL = copyURL;
window.fps = fps;
window.rainbowFull = rainbowFull;
window.stopRainbow = stopRainbow;

})();
