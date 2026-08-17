// ==UserScript==
// @name         Windows 95 Mod Menu ULTRA v3.6
// @match        https://discord.com/*
// @run-at       document-end
// ==/UserScript==

(function () {
    "use strict";

    const KEY = "win95_v36";

    const defaults = {
        theme: "default",
        cursor: "default",
        focus: false,
        clean: false,
        lowLag: false,
        vibe: false,
        seconds: true,
        pinned: true
    };

    let s = JSON.parse(localStorage.getItem(KEY)) || defaults;

    const save = () => localStorage.setItem(KEY, JSON.stringify(s));

    // =========================
    // CLOCK (with seconds toggle)
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
        clock.innerText = s.seconds
            ? d.toLocaleTimeString()
            : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);

    // =========================
    // FPS LIGHT
    // =========================

    const fps = document.createElement("div");
    fps.style.cssText = `
        position: fixed;
        top: 40px;
        right: 10px;
        background: black;
        color: lime;
        font-family: monospace;
        padding: 3px 6px;
        font-size: 11px;
        z-index: 999999999;
    `;
    document.body.appendChild(fps);

    let last = performance.now(), frames = 0;

    function loop(t) {
        frames++;
        if (t - last >= 1000) {
            fps.innerText = "FPS: " + frames;
            frames = 0;
            last = t;
        }
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // =========================
    // DRAG SYSTEM (NEW v3.6)
    // =========================

    function makeDraggable(el) {
        let dragging = false, ox = 0, oy = 0;

        el.addEventListener("mousedown", (e) => {
            dragging = true;
            ox = e.clientX - el.offsetLeft;
            oy = e.clientY - el.offsetTop;
        });

        document.addEventListener("mousemove", (e) => {
            if (!dragging) return;
            el.style.left = (e.clientX - ox) + "px";
            el.style.top = (e.clientY - oy) + "px";
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

        const themes = {
            default: `body{background:#0b0b0f!important;}`,
            pink: `body{background:radial-gradient(circle,#ff2ea6,#0b0b0f,#ff7a18)!important;}`,
            neon: `body{background:black!important;color:#00ffcc!important;}`,
            xp: `body{background:#3a6ea5!important;}`
        };

        st.textContent = themes[s.theme];
    }

    function applyCursor() {
        let st = document.getElementById("wm_cursor");
        if (!st) {
            st = document.createElement("style");
            st.id = "wm_cursor";
            document.head.appendChild(st);
        }

        const cursors = {
            default: `*{cursor:auto!important;}`,
            win95: `*{cursor:url('https://cdn.discordapp.com/attachments/1159853603138322524/1539013098139029594/a-white-mouse-cursors-free-png.png') 0 0, auto!important;}`
        };

        st.textContent = cursors[s.cursor];
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
            ${s.focus ? `body *{opacity:0.35;} [class*="chat"] *{opacity:1!important;}` : ""}
            ${s.lowLag ? `*{transition:none!important;animation:none!important;box-shadow:none!important;}` : ""}
        `;
    }

    // vibe mode
    setInterval(() => {
        if (!s.vibe) return;
        document.body.style.filter = `hue-rotate(${Math.random()*360}deg)`;
    }, 2500);

    // =========================
    // PANEL
    // =========================

    const panel = document.createElement("div");
    panel.id = "wm_panel";

    panel.innerHTML = `
        <div class="title">Windows 95 ULTRA v3.6</div>

        <div class="sec">
            <button data="pink">Pink</button>
            <button data="neon">Neon</button>
            <button data="xp">XP</button>
        </div>

        <div class="sec">
            <button data="cur_def">Cursor Default</button>
            <button data="cur_win">Win95 Cursor</button>
        </div>

        <div class="sec">
            <button data="focus">Focus Mode</button>
            <button data="clean">Clean UI</button>
            <button data="lag">Low Lag</button>
            <button data="vibe">Vibe Mode</button>
        </div>

        <div class="sec">
            <button data="seconds">Clock Seconds</button>
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
            width: 320px;
            background: #c0c0c0;
            border: 2px solid #808080;
            font-family: Tahoma;
            z-index: 999999999;
            display: none;
        }

        #wm_panel .title {
            background: #000080;
            color: white;
            padding: 5px;
            cursor: move;
        }

        #wm_panel .sec {
            padding: 6px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            border-top: 1px solid #808080;
        }

        #wm_panel button {
            background: #c0c0c0;
            border: 2px outset white;
            cursor: pointer;
        }

        #wm_panel button:active {
            border: 2px inset #808080;
        }

        #wm_toggle {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: #c0c0c0;
            border: 2px outset white;
            padding: 6px 10px;
            cursor: pointer;
            z-index: 999999999;
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

    // draggable window (NEW v3.6)
    makeDraggable(panel);

    // =========================
    // ACTIONS
    // =========================

    panel.onclick = (e) => {
        const id = e.target.getAttribute("data");
        if (!id) return;

        switch (id) {
            case "pink": s.theme = "pink"; break;
            case "neon": s.theme = "neon"; break;
            case "xp": s.theme = "xp"; break;

            case "cur_def": s.cursor = "default"; break;
            case "cur_win": s.cursor = "win95"; break;

            case "focus": s.focus = !s.focus; break;
            case "clean": s.clean = !s.clean; break;
            case "lag": s.lowLag = !s.lowLag; break;
            case "vibe": s.vibe = !s.vibe; break;

            case "seconds": s.seconds = !s.seconds; break;

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
