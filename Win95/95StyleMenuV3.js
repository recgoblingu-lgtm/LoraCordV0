// ==UserScript==
// @name         Windows 95 Mod Menu (Functional)
// @match        https://discord.com/*
// @run-at       document-end
// ==/UserScript==

(function () {
    "use strict";

    // =========================
    // SETTINGS STORAGE
    // =========================

    const STORAGE_KEY = "win95_mod_settings";

    const defaultSettings = {
        theme: "default",
        cursor: "default",
        animations: true,
        compact: false
    };

    let settings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultSettings;

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    // =========================
    // APPLY FUNCTIONS
    // =========================

    function applyTheme() {
        let style = document.getElementById("win95-theme");

        if (!style) {
            style = document.createElement("style");
            style.id = "win95-theme";
            document.head.appendChild(style);
        }

        const themes = {
            default: `
                body { background: #0b0b0f !important; }
            `,
            pink: `
                body { background: radial-gradient(circle, #ff2ea6, #0b0b0f, #ff7a18) !important; }
            `,
            neon: `
                body { background: black !important; color: #00ffcc !important; }
            `
        };

        style.textContent = themes[settings.theme] || themes.default;
    }

    function applyCursor() {
        const styleId = "win95-cursor";
        let style = document.getElementById(styleId);

        if (!style) {
            style = document.createElement("style");
            style.id = styleId;
            document.head.appendChild(style);
        }

        const cursors = {
            default: `* { cursor: auto !important; }`,
            win95: `* { cursor: url('https://cdn.discordapp.com/attachments/1159853603138322524/1539013098139029594/a-white-mouse-cursors-free-png.png') 0 0, auto !important; }`
        };

        style.textContent = cursors[settings.cursor];
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

    function applyCompact() {
        let style = document.getElementById("win95-compact");

        if (!style) {
            style = document.createElement("style");
            style.id = "win95-compact";
            document.head.appendChild(style);
        }

        style.textContent = settings.compact
            ? `
                [class*="sidebar"] { width: 200px !important; }
                [class*="members"] { display: none !important; }
            `
            : ``;
    }

    function applyAll() {
        applyTheme();
        applyCursor();
        applyAnimations();
        applyCompact();
    }

    // =========================
    // PANEL UI
    // =========================

    const panel = document.createElement("div");
    panel.id = "win95-panel";

    panel.innerHTML = `
        <div class="title">Windows 95 Control Center</div>

        <div class="section">
            <button id="themePink">Pink Theme</button>
            <button id="themeNeon">Neon Theme</button>
            <button id="themeDefault">Default</button>
        </div>

        <div class="section">
            <button id="cursorDefault">Default Cursor</button>
            <button id="cursorWin95">Win95 Cursor</button>
        </div>

        <div class="section">
            <button id="toggleAnim">Toggle Animations</button>
            <button id="toggleCompact">Compact Mode</button>
        </div>

        <div class="section">
            <button id="reset">Reset All</button>
        </div>
    `;

    document.body.appendChild(panel);

    // =========================
    // STYLES
    // =========================

    const style = document.createElement("style");
    style.textContent = `
        #win95-panel {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 280px;
            background: #c0c0c0;
            border: 2px solid #808080;
            font-family: "MS Sans Serif", Tahoma, Arial;
            z-index: 999999999;
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
            padding: 4px;
            cursor: pointer;
        }

        #win95-panel button:active {
            border: 2px inset #808080;
        }
    `;

    document.head.appendChild(style);

    // =========================
    // BUTTON LOGIC
    // =========================

    document.getElementById("themePink").onclick = () => {
        settings.theme = "pink";
        save();
        applyTheme();
    };

    document.getElementById("themeNeon").onclick = () => {
        settings.theme = "neon";
        save();
        applyTheme();
    };

    document.getElementById("themeDefault").onclick = () => {
        settings.theme = "default";
        save();
        applyTheme();
    };

    document.getElementById("cursorDefault").onclick = () => {
        settings.cursor = "default";
        save();
        applyCursor();
    };

    document.getElementById("cursorWin95").onclick = () => {
        settings.cursor = "win95";
        save();
        applyCursor();
    };

    document.getElementById("toggleAnim").onclick = () => {
        settings.animations = !settings.animations;
        save();
        applyAnimations();
    };

    document.getElementById("toggleCompact").onclick = () => {
        settings.compact = !settings.compact;
        save();
        applyCompact();
    };

    document.getElementById("reset").onclick = () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    };

    // =========================
    // INIT
    // =========================

    applyAll();

})();
