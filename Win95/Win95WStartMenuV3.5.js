// ==UserScript==
// @name         Windows 95 Mod Menu Ultra
// @match        https://discord.com/*
// @run-at       document-end
// ==/UserScript==

(function () {
    "use strict";

    const STORAGE_KEY = "win95_ultra_menu";

    const defaultSettings = {
        theme: "default",
        cursor: "default",
        compact: false,
        animations: true,
        timestamps: false,
        fps: false
    };

    let settings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultSettings;

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    // =========================
    // CLOCK
    // =========================

    function createClock() {
        let clock = document.getElementById("win95-clock");

        if (!clock) {
            clock = document.createElement("div");
            clock.id = "win95-clock";
            document.body.appendChild(clock);
        }

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

        setInterval(() => {
            const now = new Date();
            clock.innerText = now.toLocaleTimeString();
        }, 1000);
    }

    // =========================
    // FPS COUNTER (approx)
    // =========================

    function createFPS() {
        let fps = document.getElementById("win95-fps");

        if (!fps) {
            fps = document.createElement("div");
            fps.id = "win95-fps";
            document.body.appendChild(fps);
        }

        fps.style.cssText = `
            position: fixed;
            top: 40px;
            right: 10px;
            background: #000;
            color: #00ff00;
            padding: 4px 6px;
            font-family: monospace;
            font-size: 11px;
            z-index: 999999999;
        `;

        let last = performance.now();
        let frames = 0;

        function loop(now) {
            frames++;

            if (now - last >= 1000) {
                fps.innerText = "FPS: " + frames;
                frames = 0;
                last = now;
            }

            requestAnimationFrame(loop);
        }

        requestAnimationFrame(loop);
    }

    // =========================
    // APPLY SYSTEMS
    // =========================

    function applyTheme() {
        let style = document.getElementById("win95-theme");
        if (!style) {
            style = document.createElement("style");
            style.id = "win95-theme";
            document.head.appendChild(style);
        }

        const themes = {
            default: `body { background: #0b0b0f !important; }`,
            pink: `body { background: radial-gradient(circle,#ff2ea6,#0b0b0f,#ff7a18) !important; }`,
            neon: `body { background: black !important; color: #00ffcc !important; }`
        };

        style.textContent = themes[settings.theme];
    }

    function applyCursor() {
        let style = document.getElementById("win95-cursor");
        if (!style) {
            style = document.createElement("style");
            style.id = "win95-cursor";
            document.head.appendChild(style);
        }

        const cursors = {
            default: `* { cursor: auto !important; }`,
            win95: `* { cursor: url('https://cdn.discordapp.com/attachments/1159853603138322524/1539013098139029594/a-white-mouse-cursors-free-png.png') 0 0, auto !important; }`
        };

        style.textContent = cursors[settings.cursor];
    }

    function applyCompact() {
        let style = document.getElementById("win95-compact");
        if (!style) {
            style = document.createElement("style");
            style.id = "win95-compact";
            document.head.appendChild(style);
        }

        style.textContent = settings.compact
            ? `[class*="members"]{display:none!important;}`
            : ``;
    }

    function applyAnimations() {
        let style = document.getElementById("win95-anim");
        if (!style) {
            style = document.createElement("style");
            style.id = "win95-anim";
            document.head.appendChild(style);
        }

        style.textContent = settings.animations
            ? ``
            : `* { transition: none !important; animation: none !important; }`;
    }

    // =========================
    // TIMESTAMPS OVERLAY (visual)
    // =========================

    function applyTimestamps() {
        let style = document.getElementById("win95-time");

        if (!style) {
            style = document.createElement("style");
            style.id = "win95-time";
            document.head.appendChild(style);
        }

        style.textContent = settings.timestamps
            ? `
                time {
                    display: inline-block !important;
                    color: #ff7a18 !important;
                    font-size: 10px !important;
                }
            `
            : ``;
    }

    // =========================
    // PANEL
    // =========================

    const panel = document.createElement("div");
    panel.id = "win95-panel";

    panel.innerHTML = `
        <div class="title">Windows 95 Control Center Ultra</div>

        <div class="section">
            <button id="pink">Pink Theme</button>
            <button id="neon">Neon Theme</button>
            <button id="def">Default Theme</button>
        </div>

        <div class="section">
            <button id="curDef">Default Cursor</button>
            <button id="curWin">Win95 Cursor</button>
        </div>

        <div class="section">
            <button id="toggleAnim">Toggle Animations</button>
            <button id="toggleCompact">Compact Mode</button>
            <button id="toggleTime">Timestamps</button>
        </div>

        <div class="section">
            <button id="toggleFPS">FPS Overlay</button>
            <button id="reset">Reset All</button>
        </div>
    `;

    document.body.appendChild(panel);

    // =========================
    // TOGGLE BUTTON
    // =========================

    const toggle = document.createElement("div");
    toggle.innerText = "🪟 START MENU";
    toggle.id = "win95-toggle";

    document.body.appendChild(toggle);

    // =========================
    // STYLES
    // =========================

    const style = document.createElement("style");
    style.textContent = `
        #win95-panel {
            position: fixed;
            right: 20px;
            bottom: 60px;
            width: 300px;
            background: #c0c0c0;
            border: 2px solid #808080;
            font-family: Tahoma;
            z-index: 999999999;
            display: none;
        }

        #win95-panel .title {
            background: #000080;
            color: white;
            padding: 5px;
            font-weight: bold;
        }

        #win95-panel .section {
            padding: 6px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            border-top: 1px solid #808080;
        }

        #win95-panel button {
            background: #c0c0c0;
            border: 2px outset white;
            cursor: pointer;
        }

        #win95-panel button:active {
            border: 2px inset #808080;
        }

        #win95-toggle {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: #c0c0c0;
            border: 2px outset white;
            padding: 6px 10px;
            font-family: Tahoma;
            cursor: pointer;
            z-index: 999999999;
        }
    `;

    document.head.appendChild(style);

    let open = false;

    toggle.onclick = () => {
        open = !open;
        panel.style.display = open ? "block" : "none";
    };

    // =========================
    // ACTIONS
    // =========================

    document.getElementById("pink").onclick = () => {
        settings.theme = "pink"; save(); applyTheme();
    };

    document.getElementById("neon").onclick = () => {
        settings.theme = "neon"; save(); applyTheme();
    };

    document.getElementById("def").onclick = () => {
        settings.theme = "default"; save(); applyTheme();
    };

    document.getElementById("curDef").onclick = () => {
        settings.cursor = "default"; save(); applyCursor();
    };

    document.getElementById("curWin").onclick = () => {
        settings.cursor = "win95"; save(); applyCursor();
    };

    document.getElementById("toggleAnim").onclick = () => {
        settings.animations = !settings.animations; save(); applyAnimations();
    };

    document.getElementById("toggleCompact").onclick = () => {
        settings.compact = !settings.compact; save(); applyCompact();
    };

    document.getElementById("toggleTime").onclick = () => {
        settings.timestamps = !settings.timestamps; save(); applyTimestamps();
    };

    document.getElementById("toggleFPS").onclick = () => {
        settings.fps = !settings.fps; save();
        if (settings.fps) createFPS();
        else document.getElementById("win95-fps")?.remove();
    };

    document.getElementById("reset").onclick = () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    };

    // =========================
    // INIT
    // =========================

    applyTheme();
    applyCursor();
    applyCompact();
    applyAnimations();
    applyTimestamps();
    createClock();

})();
