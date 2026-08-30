// ==UserScript==
// @name         Mini Discord Client (Fixed Toggle System)
// @namespace    mini.discord.client.fixed
// @version      2.1
// @match        https://discord.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    const Client = {
        styleTag: null,

        init() {
            this.styleTag = document.createElement("style");
            document.head.appendChild(this.styleTag);
        },

        setCSS(css) {
            this.styleTag.textContent = css;
        },

        addCSS(css) {
            this.styleTag.textContent += "\n" + css;
        }
    };

    Client.init();

    window.MiniClient = Client;

    /* ================= UI PANEL ================= */

    GM_addStyle(`
        #mc-panel {
            position: fixed;
            top: 18px;
            right: 18px;
            width: 300px;
            background: rgba(15,15,20,0.85);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(0,245,255,0.25);
            border-radius: 14px;
            padding: 12px;
            z-index: 999999;
            color: white;
            font-family: Segoe UI;
        }

        #mc-panel h3 {
            margin: 0 0 10px 0;
            color: #00f5ff;
        }

        .mc-item {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 13px;
        }

        .switch {
            width: 38px;
            height: 18px;
            background: #333;
            border-radius: 20px;
            position: relative;
            cursor: pointer;
        }

        .dot {
            width: 14px;
            height: 14px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: 2px;
            transition: 0.2s;
        }

        .switch.active {
            background: #00f5ff;
            box-shadow: 0 0 10px #00f5ff;
        }

        .switch.active .dot {
            transform: translateX(20px);
        }
    `);

    const panel = document.createElement("div");
    panel.id = "mc-panel";

    panel.innerHTML = `
        <h3>Mini Client FIXED</h3>

        <div class="mc-item">
            Glow UI
            <div class="switch" id="glow"><div class="dot"></div></div>
        </div>

        <div class="mc-item">
            Blur UI
            <div class="switch" id="blur"><div class="dot"></div></div>
        </div>

        <div class="mc-item">
            Cyber Links
            <div class="switch" id="links"><div class="dot"></div></div>
        </div>
    `;

    document.body.appendChild(panel);

    /* ================= FEATURES ================= */

    let glowOn = false;
    let blurOn = false;
    let linksOn = false;

    const update = () => {

        let css = "";

        if (glowOn) {
            css += `
                a {
                    color: #00f5ff !important;
                    text-shadow: 0 0 8px #00f5ff !important;
                }
            `;
        }

        if (blurOn) {
            css += `
                div[class*="chat"],
                div[class*="sidebar"] {
                    backdrop-filter: blur(18px) !important;
                }
            `;
        }

        if (linksOn) {
            css += `
                a {
                    color: #ff3df2 !important;
                    text-shadow: 0 0 10px #ff3df2 !important;
                }
            `;
        }

        Client.setCSS(css);
    };

    function toggle(id, ref, setter) {
        const el = document.getElementById(id);

        el.onclick = () => {
            ref.value = !ref.value;
            el.classList.toggle("active");
            setter(ref.value);
            update();
        };
    }

    const glow = { value: false };
    const blur = { value: false };
    const links = { value: false };

    toggle("glow", glow, v => glowOn = v);
    toggle("blur", blur, v => blurOn = v);
    toggle("links", links, v => linksOn = v);

})();
