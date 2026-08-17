// ==UserScript==
// @name         Windows 95 Mod Menu ULTRA v3.7
// @match        https://discord.com/*
// @run-at       document-end
// ==/UserScript==

(function () {
    "use strict";

    const KEY = "win95_v37";

    const defaults = {
        theme: "default",
        cursor: "default",
        focus: false,
        clean: false,
        lowLag: false,
        dim: false,
        vibe: false,
        seconds: true
    };

    let s = JSON.parse(localStorage.getItem(KEY)) || defaults;

    let saveTimer;
    const save = () => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            localStorage.setItem(KEY, JSON.stringify(s));
        }, 150);
    };

    // =========================
    // CLICK SOUND (optional vibe)
    // =========================

    const clickSound = new Audio("https://www.myinstants.com/media/sounds/mouse-click.mp3");
    clickSound.volume = 0.2;

    function click() {
        try { clickSound.currentTime = 0; clickSound.play(); } catch {}
    }

    // =========================
    // CLOCK
    // =========================

    const clock = document.createElement("div");
    clock.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #c0c0c0;
        border: 2px inset #808080;
        padding: 4px 8px;
        font-family: Tahoma;
        font-size: 12px;
        z-index: 999999999;
    `;
    document.body.appendChild(clock);

    setInterval(() => {
        const d = new Date();
        clock.innerText = s.seconds ? d.toLocaleTimeString() : d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    }, 1000);

    // =========================
    // DRAG SYSTEM v2 (smoother)
    // =========================

    function makeDraggable(el, handle) {
        let dragging = false;
        let ox = 0, oy = 0;

        handle.onmousedown = (e) => {
            dragging = true;
            ox = e.clientX - el.offsetLeft;
            oy = e.clientY - el.offsetTop;
        };

        document.addEventListener("mousemove", (e) => {
            if (!dragging) return;

            let x = e.clientX - ox;
            let y = e.clientY - oy;

            // bounds (prevents losing window)
            x = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, x));
            y = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, y));

            el.style.left = x + "px";
            el.style.top = y + "px";
        });

        document.addEventListener("mouseup", () => dragging = false);
    }

    // =========================
    // APPLY SYSTEMS
    // =========================

    function applyTheme() {
        let st = document.getElementById("wm_theme");
        if (!st) {
            st = document.createElement("style");
            st.id = "wm_theme";
            document.head.appendChild(st);
        }

        st.textContent = {
            default: `body{background:#0b0b0f!important;}`,
            pink: `body{background:radial-gradient(circle,#ff2ea6,#0b0b0f,#ff7a18)!important;}`,
            neon: `body{background:black!important;color:#00ffcc!important;}`,
            xp: `body{background:#3a6ea5!important;}`
        }[s.theme];
    }

    function applyCursor() {
        let st = document.getElementById("wm_cursor");
        if (!st) {
            st = document.createElement("style");
            st.id = "wm_cursor";
            document.head.appendChild(st);
        }

        st.textContent = {
            default: `*{cursor:auto!important;}`,
            win95: `*{cursor:url('https://cdn.discordapp.com/attachments/1159853603138322524/1539013098139029594/a-white-mouse-cursors-free-png.png') 0 0, auto!important;}`
        }[s.cursor];
    }

    function applyModes() {
        let st = document.getElementById("wm_modes");
        if (!st) {
            st = document.createElement("style");
            st.id = "wm_modes";
            document.head.appendChild(st);
        }

        st.textContent = `
            ${s.clean ? `[class*="sidebar"],[class*="members"],[class*="panels"]{display:none!important;}` : ""}
            ${s.focus ? `body *{opacity:.35;} [class*="chat"] *{opacity:1!important;}` : ""}
            ${s.lowLag ? `*{animation:none!important;transition:none!important;box-shadow:none!important;}` : ""}
            ${s.dim ? `body::before{content:"";position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999999;pointer-events:none;}` : ""}
        `;
    }

    // vibe mode
    setInterval(() => {
        if (!s.vibe) return;
        document.body.style.filter = `hue-rotate(${Math.random()*360}deg)`;
    }, 3000);

    // =========================
    // PANEL UI (now tab-based)
    // =========================

    const panel = document.createElement("div");
    panel.id = "wm_panel";

    panel.innerHTML = `
        <div id="wm_title">Windows 95 ULTRA v3.7</div>

        <div id="tabs">
            <button data-tab="theme">Themes</button>
            <button data-tab="ui">UI</button>
            <button data-tab="tools">Tools</button>
            <button data-tab="system">System</button>
        </div>

        <div class="tab" id="theme">
            <button data="pink">Pink</button>
            <button data="neon">Neon</button>
            <button data="xp">XP</button>
        </div>

        <div class="tab" id="ui">
            <button data="cur_def">Default Cursor</button>
            <button data="cur_win">Win95 Cursor</button>
            <button data="focus">Focus Mode</button>
            <button data="clean">Clean UI</button>
        </div>

        <div class="tab" id="tools">
            <button data="lag">Low Lag</button>
            <button data="dim">Dim Screen</button>
            <button data="vibe">Vibe Mode</button>
        </div>

        <div class="tab" id="system">
            <button data="seconds">Clock Toggle</button>
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
            width: 340px;
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

        #tabs {
            display: flex;
            gap: 4px;
            padding: 4px;
            border-bottom: 1px solid #808080;
        }

        #tabs button {
            flex: 1;
            background: #c0c0c0;
            border: 2px outset white;
            font-size: 11px;
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

    const toggle = document.createElement("div");
    toggle.id = "wm_toggle";
    toggle.innerText = "🪟 START";
    document.body.appendChild(toggle);

    let open = false;

    toggle.onclick = () => {
        click();
        open = !open;
        panel.style.display = open ? "block" : "none";
    };

    // drag
    makeDraggable(panel, document.getElementById("wm_title"));

    // tabs
    const tabs = panel.querySelectorAll(".tab");
    function showTab(id) {
        tabs.forEach(t => t.style.display = "none");
        panel.querySelector("#" + id).style.display = "flex";
    }
    showTab("theme");

    panel.querySelectorAll("[data-tab]").forEach(btn => {
        btn.onclick = () => {
            click();
            showTab(btn.dataset.tab);
        };
    });

    // actions
    panel.onclick = (e) => {
        const id = e.target.getAttribute("data");
        if (!id) return;

        click();

        switch (id) {
            case "pink": s.theme="pink"; break;
            case "neon": s.theme="neon"; break;
            case "xp": s.theme="xp"; break;

            case "cur_def": s.cursor="default"; break;
            case "cur_win": s.cursor="win95"; break;

            case "focus": s.focus=!s.focus; break;
            case "clean": s.clean=!s.clean; break;
            case "lag": s.lowLag=!s.lowLag; break;
            case "dim": s.dim=!s.dim; break;
            case "vibe": s.vibe=!s.vibe; break;

            case "seconds": s.seconds=!s.seconds; break;

            case "reset":
                localStorage.removeItem(KEY);
                location.reload();
                return;
        }

        save();
        applyTheme();
        applyCursor();
        applyModes();
    };

    applyTheme();
    applyCursor();
    applyModes();

})();
