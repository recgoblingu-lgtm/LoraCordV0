 // ==UserScript==
// @name         Discord Windows 11 Fluent UI (Improved)
// @namespace    win11.fluent.discord
// @version      2.0
// @description  Better Windows 11 Fluent redesign for Discord
// @match        https://discord.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        /* ===== WIN11 FLUENT CORE ===== */

        :root {
            --bg: #f3f3f3;
            --panel: rgba(255, 255, 255, 0.65);
            --panel-solid: #ffffff;
            --sidebar: #eaeaea;
            --accent: #2563eb;
            --text: #1e1e1e;
            --muted: #6b6b6b;
            --radius: 16px;
            --shadow: 0 12px 30px rgba(0,0,0,0.12);
        }

        /* GLOBAL FONT */
        * {
            font-family: "Segoe UI Variable", "Segoe UI", sans-serif !important;
        }

        /* APP BACKGROUND (MICA STYLE) */
        body {
            background: radial-gradient(circle at top, #ffffff, var(--bg)) !important;
        }

        /* MAIN WRAPPER */
        div[class*="appMount"] {
            background: transparent !important;
        }

        /* ===== LEFT SERVER BAR ===== */
        div[class*="guilds"] {
            background: var(--sidebar) !important;
            margin: 10px !important;
            border-radius: var(--radius) !important;
            box-shadow: var(--shadow) !important;
        }

        /* ===== CHANNEL SIDEBAR ===== */
        div[class*="sidebar"] {
            background: var(--panel) !important;
            backdrop-filter: blur(18px) !important;
            border-radius: var(--radius) !important;
            margin: 10px !important;
            box-shadow: var(--shadow) !important;
        }

        /* CHANNEL HOVER (FLUENT HIGHLIGHT) */
        div[class*="containerDefault"]:hover {
            background: rgba(37, 99, 235, 0.12) !important;
            border-radius: 10px !important;
        }

        /* ===== CHAT PANEL ===== */
        div[class*="chat"] {
            background: var(--panel) !important;
            backdrop-filter: blur(18px) !important;
            margin: 10px !important;
            border-radius: var(--radius) !important;
            box-shadow: var(--shadow) !important;
        }

        /* MESSAGE TEXT */
        div[class*="messageContent"] {
            color: var(--text) !important;
        }

        /* LINKS */
        a {
            color: var(--accent) !important;
        }

        /* ===== MESSAGE INPUT ===== */
        div[class*="channelTextArea"] {
            background: var(--panel-solid) !important;
            border-radius: 14px !important;
            margin: 12px !important;
            box-shadow: var(--shadow) !important;
        }

        /* BUTTONS (FLUENT BLUE) */
        button[class*="lookFilled"] {
            background: var(--accent) !important;
            border-radius: 10px !important;
        }

        /* HOVER EFFECTS */
        button:hover {
            filter: brightness(1.05);
        }

        /* SCROLLBAR (WIN11 STYLE) */
        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-thumb {
            background: #c6c6c6;
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }

        /* TOP BAR CLEANUP */
        div[class*="title"] {
            background: transparent !important;
        }

        /* EMBEDS */
        div[class*="embed"] {
            background: rgba(255,255,255,0.7) !important;
            border-left: 4px solid var(--accent) !important;
            border-radius: 12px !important;
        }

        /* MENTION HIGHLIGHT */
        span[class*="mention"] {
            background: rgba(37, 99, 235, 0.15) !important;
            color: var(--accent) !important;
        }
    `);

})();
