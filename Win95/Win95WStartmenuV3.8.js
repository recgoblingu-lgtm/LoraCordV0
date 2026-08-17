// ==UserScript==
// @name         Windows 95 Mod Menu ULTRA v3.8
// @match        https://discord.com/*
// @run-at       document-end
// ==/UserScript==

(function () {
    "use strict";

    const KEY = "win95_v38";

    const defaults = {
        theme: "default",
        cursor: "default",
        focus: false,
        clean: false,
        lowLag: false,
        dim: false,
        vibe: false,
        seconds: true,
        enabled: true
    };

    let s = JSON.parse(localStorage.getItem(KEY)) || defaults;

    const save = () => localStorage.setItem(KEY, JSON.stringify(s));

    // =========================
    // PERFORMANCE PROFILER
    // =========================

    let last = performance.now();
    let frames = 0;

    const profiler = document.createElement("div");
    profiler.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: black;
        color: lime;
        font-family: monospace;
        font-size: 11px;
        padding: 4px 6px;
        z-index: 999999999;
    `;
    document.body.appendChild(profiler);

    function loop(t) {
        frames++;
        if (t - last >= 1000) {
            profiler.innerText = `FPS: ${frames} | UI: ${s.lowLag ? "LOW" : "NORMAL"}`;
            frames = 0;
            last = t;
        }
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // =========================
    // APPLY SYSTEM
    // =========================

    function applyAll() {
        applyTheme();
        applyCursor();
        applyModes();
    }

    function applyTheme() {
        let st = document.getElementById("wm_theme");
        if (!st) {
            st = document.createElement("style");
            st.id = "wm_theme";
            document.head.appendChild(st);
        }

        const t = {
            default: `body{background:#0b0b0f!important;}`,
            pink: `body{background:radial-gradient(circle,#ff2ea6,#0b0b0f,#ff7a18)!important;}`,
            neon: `body{background:black!important;color:#00ffcc!important;}`,
            xp: `body{background:#3a6ea5!important;}`,
            goth: `body{background:#050505!important;color:#d0d0d0!important;}`
        };

        st.textContent = t[s.theme] || t.default;
    }

    function applyCursor() {
        let st = document.getElementById("wm_cursor");
        if (!st) {
            st = document.createElement("style");
            st.id = "wm_cursor";
            document.head.appendChild(st);
        }

        const c = {
            default: `*{cursor:auto!important;}`,
            win95: `*{cursor:url('https://cdn.discordapp.com/attachments/1159853603138322524/1539013098139029594/a-white-mouse-cursors-free-png.png') 0 0, auto!important;}`
        };

        st.textContent = c[s.cursor];
    }

    function applyModes() {
        let st = document.getElementById("wm_modes");
        if (!st) {
            st = document.createElement("style");
            st.id = "wm_modes";
            document.head.appendChild(st);
        }

        st.textContent = `
            ${!s.enabled ? `body *{display:none!important;}` : ""}
            ${s.clean ? `[class*="sidebar"],[class*="members"],[class*="panels"],[class*="channel"]{opacity:0!important;}` : ""}
            ${s.focus ? `body *{opacity:.3;} [class*="chat"] *{opacity:1!important;}` : ""}
            ${s.lowLag ? `*{transition:none!important;animation:none!important;box-shadow:none!important;}` : ""}
            ${s.dim ? `body::before{content:"";position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:999999;pointer-events:none;}` : ""}
        `;
    }

    // vibe mode
    setInterval(() => {
        if (!s.vibe) return;
        document.body.style.filter = `hue-rotate(${Math.random()*360}deg)`;
    }, 3500);

    // =========================
    // PANEL
    // =========================

    const panel = document.createElement("div");
    panel.id = "wm_panel";

    panel.innerHTML = `
        <div id="wm_title">Windows 95 ULTRA v3.8</div>

        <input id="search" placeholder="Search menu..." />

        <div class="tabs">
            <button data-tab="theme">Themes</button>
            <button data-tab="ui">UI</button>
            <button data-tab="tools">Tools</button>
            <button data-tab="sys">System</button>
        </div>

        <div class="tab" id="theme">
            <button data="pink">Pink</button>
            <button data="neon">Neon</button>
            <button data="xp">XP</button>
            <button data="goth">Goth</button>
        </div>

        <div class="tab" id="ui">
            <button data="cur_def">Default Cursor</button>
            <button data="cur_win">Win95 Cursor</button>
            <button data="focus">Focus Mode</button>
            <button data="clean">Clean Mode</button>
        </div>

        <div class="tab" id="tools">
            <button data="low">Low Lag</button>
            <button data="dim">Dim Screen</button>
            <button data="vibe">Vibe Mode</button>
        </div>

        <div class="tab" id="sys">
            <button data="toggle">Toggle All</button>
            <button data="reset">Reset</button>
        </div>
    `;

    document.body.appendChild(panel);

    // =========================
    // STYLES
    // =========================

    const style = document.createElement("style");
    style.textContent = `
        #wm_panel {
            position: fixed;
            right: 20px;
            bottom: 60px;
            width: 360px;
            background: #c0c0c0;
            border: 2px solid #808080;
            font-family: Tahoma;
            z-index: 999999999;
            display: none;
        }

        #wm_title {
            background: #000080;
            color: white;
            padding: 6px;
            cursor: move;
            font-weight: bold;
        }

        #search {
            width: 95%;
            margin: 5px;
            padding: 4px;
        }

        .tabs {
            display: flex;
            gap: 3px;
            padding: 4px;
        }

        .tabs button {
            flex: 1;
            background: #c0c0c0;
            border: 2px outset white;
        }

        .tab {
            display: none;
            padding: 6px;
            flex-direction: column;
            gap: 4px;
        }

        .tab button {
            background: #c0c0c0;
            border: 2px outset white;
        }

        #wm_toggle {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background:#c0c0c0;
            border:2px outset white;
            padding:6px 10px;
            cursor:pointer;
            z-index:999999999;
        }
    `;

    document.head.appendChild(style);

    // =========================
    // TOGGLE BUTTON
    // =========================

    const btn = document.createElement("div");
    btn.id = "wm_toggle";
    btn.innerText = "🪟 START";
    document.body.appendChild(btn);

    let open = false;

    btn.onclick = () => {
        open = !open;
        panel.style.display = open ? "block" : "none";
    };

    // =========================
    // DRAG
    // =========================

    let drag = false, ox = 0, oy = 0;

    document.getElementById("wm_title").onmousedown = (e) => {
        drag = true;
        ox = e.clientX - panel.offsetLeft;
        oy = e.clientY - panel.offsetTop;
    };

    document.addEventListener("mousemove", (e) => {
        if (!drag) return;
        panel.style.left = (e.clientX - ox) + "px";
        panel.style.top = (e.clientY - oy) + "px";
    });

    document.addEventListener("mouseup", () => drag = false);

    // =========================
    // TABS
    // =========================

    function showTab(id) {
        panel.querySelectorAll(".tab").forEach(t => t.style.display = "none");
        panel.querySelector("#" + id).style.display = "flex";
    }

    showTab("theme");

    panel.querySelectorAll("[data-tab]").forEach(b => {
        b.onclick = () => showTab(b.dataset.tab);
    });

    // =========================
    // SEARCH FILTER
    // =========================

    const search = panel.querySelector("#search");
    search.oninput = () => {
        const q = search.value.toLowerCase();
        panel.querySelectorAll("button[data]").forEach(btn => {
            btn.style.display = btn.innerText.toLowerCase().includes(q) ? "block" : "none";
        });
    };

    // =========================
    // ACTIONS
    // =========================

    panel.onclick = (e) => {
        const id = e.target.getAttribute("data");
        if (!id) return;

        switch (id) {
            case "pink": s.theme="pink"; break;
            case "neon": s.theme="neon"; break;
            case "xp": s.theme="xp"; break;
            case "goth": s.theme="goth"; break;

            case "cur_def": s.cursor="default"; break;
            case "cur_win": s.cursor="win95"; break;

            case "focus": s.focus=!s.focus; break;
            case "clean": s.clean=!s.clean; break;
            case "low": s.lowLag=!s.lowLag; break;
            case "dim": s.dim=!s.dim; break;
            case "vibe": s.vibe=!s.vibe; break;

            case "toggle": s.enabled=!s.enabled; break;

            case "reset":
                localStorage.removeItem(KEY);
                location.reload();
                return;
        }

        save();
        applyAll();
    };

    applyAll();

})();
