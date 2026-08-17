// ==UserScript==
// @name         Windows 95 Mod Menu (Discord)
// @match        https://discord.com/*
// @run-at       document-end
// ==/UserScript==

(function () {
    "use strict";

    // Create main panel
    const panel = document.createElement("div");
    panel.id = "win95-panel";

    panel.innerHTML = `
        <div class="title">Windows 95 Control Panel</div>

        <div class="section">
            <button id="themeBtn">Theme Settings</button>
            <button id="cursorBtn">Cursor Settings</button>
            <button id="uiBtn">UI Settings</button>
        </div>

        <div class="section">
            <button id="infoBtn">System Info</button>
            <button id="resetBtn">Reset UI</button>
        </div>
    `;

    document.body.appendChild(panel);

    // Styles
    const style = document.createElement("style");
    style.textContent = `
        #win95-panel {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 260px;
            background: #c0c0c0;
            border: 2px solid #808080;
            font-family: "MS Sans Serif", Tahoma, Arial;
            z-index: 999999999;
        }

        #win95-panel .title {
            background: #000080;
            color: white;
            padding: 4px;
            font-size: 12px;
        }

        #win95-panel .section {
            padding: 6px;
            display: flex;
            flex-direction: column;
            gap: 4px;
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

    // BUTTON ACTIONS (visual only)

    document.getElementById("themeBtn").onclick = () => {
        alert("Theme settings clicked (visual menu only)");
    };

    document.getElementById("cursorBtn").onclick = () => {
        alert("Cursor settings clicked (use CSS/Tampermonkey for cursor)");
    };

    document.getElementById("uiBtn").onclick = () => {
        alert("UI settings clicked");
    };

    document.getElementById("infoBtn").onclick = () => {
        alert("Windows 95 Discord Mod Menu v1");
    };

    document.getElementById("resetBtn").onclick = () => {
        location.reload();
    };

})();
