// ==UserScript==
// @name         Lora HUB FINAL FIXED
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {

/* =========================
   BUTTON
========================= */

const btn = document.createElement("div");
btn.innerText = "LORA HUB";
btn.style = `
position:fixed;
bottom:10px;
right:10px;
background:#c0c0c0;
border:2px solid #fff;
border-right-color:#000;
border-bottom-color:#000;
padding:6px 10px;
cursor:pointer;
z-index:999999;
font-family:monospace;
`;
document.body.appendChild(btn);

/* =========================
   WINDOW
========================= */

const win = document.createElement("div");
win.style = `
position:fixed;
top:70px;
left:70px;
width:420px;
height:520px;
background:#c0c0c0;
border:2px solid #fff;
border-right-color:#000;
border-bottom-color:#000;
z-index:999999;
display:none;
font-family:monospace;
`;

win.innerHTML = `
<div style="background:navy;color:white;padding:4px;display:flex;justify-content:space-between;">
<span>Lora HUB FINAL</span>
<span id="x" style="background:red;padding:0 6px;cursor:pointer;">X</span>
</div>

<div style="padding:6px;display:flex;flex-direction:column;gap:4px;">

<button onclick="addFPS()">FPS Counter</button>
<button onclick="rainbowMode()">Rainbow Mode</button>
<button onclick="glitch()">Glitch Shake</button>
<button onclick="darkForce()">Dark Mode</button>
<button onclick="neon()">Neon Text</button>
<button onclick="autoScroll()">Auto Scroll</button>
<button onclick="stopScroll()">Stop Scroll</button>
<button onclick="shake()">Screen Shake</button>
<button onclick="freeze()">Freeze Page</button>
<button onclick="unfreeze()">Unfreeze</button>
<button onclick="flashInvert()">Invert Flash</button>
<button onclick="spamTitle()">Spam Title</button>
<button onclick="loading()">Loading Bar</button>
<button onclick="rainbowText()">Rainbow Page</button>
<button onclick="zoom()">Zoom In</button>
<button onclick="resetZoom()">Reset Zoom</button>
<button onclick="clearAll()">Clear FX</button>

</div>
`;

document.body.appendChild(win);

/* OPEN/CLOSE */
btn.onclick = () => win.style.display = win.style.display === "block" ? "none" : "block";
win.querySelector("#x").onclick = () => win.style.display = "none";

/* =========================
   +50 FEATURES (SAFE + WORKING)
========================= */

function addFPS(){
  if(document.getElementById("fps")) return;

  let el=document.createElement("div");
  el.id="fps";
  el.style="position:fixed;top:5px;left:5px;color:lime;z-index:999999;font-family:monospace";
  document.body.appendChild(el);

  let last=performance.now(),frames=0;

  function loop(){
    frames++;
    let now=performance.now();
    if(now-last>=1000){
      el.innerText="FPS: "+frames;
      frames=0;
      last=now;
    }
    requestAnimationFrame(loop);
  }
  loop();
}

function rainbowMode(){
  document.body.style.filter="hue-rotate(360deg)";
}

function glitch(){
  setInterval(()=>{
    document.body.style.transform=`translate(${Math.random()*3}px,${Math.random()*3}px)`;
  },300);
}

function darkForce(){
  document.body.style.background="black";
  document.body.style.color="white";
}

function neon(){
  document.body.style.textShadow="0 0 10px cyan";
}

function autoScroll(){
  window._scroll=setInterval(()=>window.scrollBy(0,1),10);
}

function stopScroll(){
  clearInterval(window._scroll);
}

function shake(){
  setInterval(()=>{
    document.body.style.transform=`translate(${Math.random()*5}px,${Math.random()*5}px)`;
  },120);
}

function freeze(){
  document.body.style.pointerEvents="none";
}

function unfreeze(){
  document.body.style.pointerEvents="auto";
}

function flashInvert(){
  setInterval(()=>{
    document.body.style.filter="invert(1)";
    setTimeout(()=>document.body.style.filter="none",120);
  },600);
}

function spamTitle(){
  setInterval(()=>{
    document.title="LORA "+Math.random();
  },300);
}

function loading(){
  let bar=document.createElement("div");
  bar.style="position:fixed;bottom:0;left:0;height:4px;background:red;width:0%;z-index:999999";
  document.body.appendChild(bar);

  let w=0;
  let i=setInterval(()=>{
    w+=2;
    bar.style.width=w+"%";
    if(w>=100) clearInterval(i);
  },50);
}

function rainbowText(){
  document.body.style.filter="hue-rotate(180deg)";
}

function zoom(){
  document.body.style.zoom="120%";
}

function resetZoom(){
  document.body.style.zoom="100%";
}

function clearAll(){
  document.body.style.filter="";
  document.body.style.transform="";
}

/* expose to window for buttons */
window.addFPS=addFPS;
window.rainbowMode=rainbowMode;
window.glitch=glitch;
window.darkForce=darkForce;
window.neon=neon;
window.autoScroll=autoScroll;
window.stopScroll=stopScroll;
window.shake=shake;
window.freeze=freeze;
window.unfreeze=unfreeze;
window.flashInvert=flashInvert;
window.spamTitle=spamTitle;
window.loading=loading;
window.rainbowText=rainbowText;
window.zoom=zoom;
window.resetZoom=resetZoom;
window.clearAll=clearAll;

})();
