// ==UserScript==
// @name         Discord Windows 95 Theme
// @namespace    win95.discord
// @version      1.0
// @description  Makes Discord look like Windows 95
// @match        https://discord.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        /* ===== WINDOWS 95 CORE ===== */

        :root {
            --win95-bg: #c0c0c0;
            --win95-dark: #808080;
            --win95-light: #ffffff;
            --win95-text: #000000;
            --win95-blue: #000080;
        }

        /* FONT (classic system vibe) */
        * {
            font-family: "MS Sans Serif", "Tahoma", sans-serif !important;
            font-size: 12px !important;
        }

        body {
            background: var(--win95-bg) !important;
        }

        /* REMOVE MODERN ROUNDING */
        * {
            border-radius: 0 !important;
        }

        /* ===== MAIN APP BACKGROUND ===== */
        div[class*="appMount"],
        div[class*="app"] {
            background: var(--win95-bg) !important;
        }

        /* ===== LEFT SERVER BAR ===== */
        div[class*="guilds"] {
            background: var(--win95-bg) !important;
            border: 2px solid var(--win95-dark);
            border-top-color: var(--win95-light);
            border-left-color: var(--win95-light);
        }

        /* ===== SIDEBAR ===== */
        div[class*="sidebar"] {
            background: var(--win95-bg) !important;
            border: 2px solid var(--win95-dark);
            border-top-color: var(--win95-light);
            border-left-color: var(--win95-light);
        }

        /* ===== CHAT AREA ===== */
        div[class*="chat"] {
            background: var(--win95-bg) !important;
            border: 2px solid var(--win95-dark);
            border-top-color: var(--win95-light);
            border-left-color: var(--win95-light);
        }

        /* MESSAGE TEXT */
        div[class*="messageContent"] {
            color: var(--win95-text) !important;
        }

        /* LINKS */
        a {
            color: var(--win95-blue) !important;
            text-decoration: underline !important;
        }

        /* INPUT BOX (classic inset look) */
        div[class*="channelTextArea"] {
            background: var(--win95-light) !important;
            border: 2px inset var(--win95-bg) !important;
        }

        /* BUTTONS (3D WINDOWS 95 STYLE) */
        button {
            background: var(--win95-bg) !important;
            border: 2px solid var(--win95-dark) !important;
            border-top-color: var(--win95-light) !important;
            border-left-color: var(--win95-light) !important;
            color: var(--win95-text) !important;
        }

        button:active {
            border-top-color: var(--win95-dark) !important;
            border-left-color: var(--win95-dark) !important;
            border-bottom-color: var(--win95-light) !important;
            border-right-color: var(--win95-light) !important;
        }

        /* HOVER CHANNELS */
        div[class*="containerDefault"]:hover {
            background: var(--win95-light) !important;
        }

        /* SCROLLBAR (OLD STYLE) */
        ::-webkit-scrollbar {
            width: 14px;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--win95-bg);
            border: 2px solid var(--win95-dark);
            border-top-color: var(--win95-light);
            border-left-color: var(--win95-light);
        }

        /* TOP BAR */
        div[class*="title"] {
            background: var(--win95-blue) !important;
            color: white !important;
        }

        /* EMBEDS */
        div[class*="embed"] {
            background: var(--win95-light) !important;
            border: 2px inset var(--win95-bg) !important;
        }

        /* REMOVE MODERN GLASS EFFECTS */
        * {
            backdrop-filter: none !important;
            box-shadow: none !important;
        }
    `);
})();
