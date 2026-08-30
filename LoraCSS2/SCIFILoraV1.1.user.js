// ==UserScript==
// @name         Discord Sci-Fi HUD Theme
// @namespace    scifi.discord.hud
// @version      1.0
// @description  Turns Discord into a futuristic space HUD interface
// @match        https://discord.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        /* ===== SCI-FI HUD CORE ===== */

        :root {
            --bg: #05070f;
            --panel: rgba(10, 14, 25, 0.75);
            --glass: rgba(255,255,255,0.05);
            --cyan: #00f5ff;
            --magenta: #ff3df2;
            --purple: #7c4dff;
            --text: #d7e8ff;
            --muted: #7a86a1;
            --radius: 14px;
        }

        /* GLOBAL */
        * {
            font-family: "Segoe UI", "Arial", sans-serif !important;
        }

        body {
            background: radial-gradient(circle at top, #0b1020, var(--bg)) !important;
            color: var(--text) !important;
        }

        /* ===== MAIN PANELS ===== */

        div[class*="appMount"],
        div[class*="app"] {
            background: transparent !important;
        }

        /* SERVER BAR */
        div[class*="guilds"] {
            background: rgba(0,0,0,0.6) !important;
            border-right: 1px solid rgba(0,245,255,0.15);
            box-shadow: 0 0 20px rgba(0,245,255,0.05);
        }

        /* SIDEBAR */
        div[class*="sidebar"] {
            background: var(--panel) !important;
            backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(0,245,255,0.15);
            border-radius: var(--radius) !important;
            margin: 10px !important;
            box-shadow: 0 0 25px rgba(0,245,255,0.08);
        }

        /* CHAT AREA */
        div[class*="chat"] {
            background: var(--panel) !important;
            backdrop-filter: blur(16px) !important;
            border-radius: var(--radius) !important;
            margin: 10px !important;
            border: 1px solid rgba(255,61,242,0.12);
            box-shadow: 0 0 30px rgba(255,61,242,0.08);
        }

        /* MESSAGE TEXT */
        div[class*="messageContent"] {
            color: var(--text) !important;
        }

        /* LINKS */
        a {
            color: var(--cyan) !important;
            text-shadow: 0 0 8px var(--cyan);
        }

        /* ===== INPUT BOX ===== */
        div[class*="channelTextArea"] {
            background: rgba(10,14,25,0.85) !important;
            border: 1px solid rgba(0,245,255,0.25);
            border-radius: 14px !important;
            box-shadow: 0 0 20px rgba(0,245,255,0.08);
        }

        /* BUTTONS */
        button[class*="lookFilled"] {
            background: linear-gradient(90deg, var(--cyan), var(--magenta)) !important;
            border-radius: 10px !important;
            color: #000 !important;
            font-weight: bold;
        }

        /* HOVER EFFECT */
        div[class*="containerDefault"]:hover {
            background: rgba(0,245,255,0.08) !important;
            border-left: 2px solid var(--cyan) !important;
        }

        /* SCROLLBAR */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-thumb {
            background: linear-gradient(var(--cyan), var(--magenta));
            border-radius: 10px;
            box-shadow: 0 0 10px var(--cyan);
        }

        /* TOP BAR */
        div[class*="title"] {
            background: transparent !important;
            text-shadow: 0 0 10px var(--cyan);
        }

        /* EMBEDS */
        div[class*="embed"] {
            background: rgba(10,14,25,0.8) !important;
            border-left: 3px solid var(--magenta) !important;
            box-shadow: 0 0 20px rgba(255,61,242,0.1);
            border-radius: 12px !important;
        }

        /* MENTIONS */
        span[class*="mention"] {
            background: rgba(0,245,255,0.12) !important;
            color: var(--cyan) !important;
        }

        /* SUBTLE SCANLINE EFFECT */
        body::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: repeating-linear-gradient(
                to bottom,
                rgba(255,255,255,0.02),
                rgba(255,255,255,0.02) 1px,
                transparent 1px,
                transparent 3px
            );
            opacity: 0.25;
            z-index: 9999;
        }
    `);

})();
