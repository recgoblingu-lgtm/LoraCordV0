// ==UserScript==
// @name         Mini Discord Client (Expanded Settings)
// @namespace    mini.discord.client.expanded
// @version      3.0
// @match        https://discord.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    const Client = {
        styleTag: null,

        settings: {
            glow: false,
            blur: false,
            cyan: true,
            magenta: false,
            green: false,
            compact: false,
            darkBoost: false,
            rounded: true,
            pulse: false
        },

        init() {
            this.styleTag = document.createElement("style");
            document.head.appendChild(this.styleTag);
        },

        apply() {
            let css = "";

            /* ===== BASE ===== */
            if (this.settings.darkBoost) {
                css += `
                    body {
                        filter: brightness(0.85) contrast(1.1);
                    }
                `;
            }

            /* ===== COLORS ===== */
            let accent = "#00f5ff";

            if (this.settings.magenta) accent = "#ff3df2";
            if (this.settings.green) accent = "#00ff88";

            if (this.settings.cyan || this.settings.magenta || this.settings.green) {
                css += `
                    a {
                        color: ${accent} !important;
                        text-shadow: 0 0 8px ${accent};
                    }

                    button[class*="lookFilled"] {
                        background: ${accent} !important;
                        color: black !important;
                    }
                `;
            }

            /* ===== GLOW ===== */
            if (this.settings.glow) {
                css += `
                    div[class*="messageContent"] {
                        text-shadow: 0 0 6px rgba(0,245,255,0.25);
                    }
                `;
            }

            /* ===== BLUR ===== */
            if (this.settings.blur) {
                css += `
                    div[class*="chat"],
                    div[class*="sidebar"] {
                        backdrop-filter: blur(18px) !important;
                    }
                `;
            }

            /* ===== COMPACT MODE ===== */
            if (this.settings.compact) {
                css += `
                    div[class*="messageListItem"] {
                        margin: 2px 0 !important;
                    }
                `;
            }

            /* ===== ROUNDED ===== */
            if (!this.settings.rounded) {
                css += `
                    * {
                        border-radius: 0 !important;
                    }
                `;
            }

            /* ===== PULSE MODE ===== */
            if (this.settings.pulse) {
                css += `
                    a {
                        animation: pulseGlow 2s infinite;
                    }

                    @keyframes pulseGlow {
                        0% { text-shadow: 0 0 5px ${accent}; }
                        50% { text-shadow: 0 0 15px ${accent}; }
                        100% { text-shadow: 0 0 5px ${accent}; }
                    }
                `;
            }

            this.styleTag.textContent = css;
        }
    };

    Client.init();
    window.MiniClient = Client;

    /* ================= UI ================= */

    GM_addStyle(`
        #mc {
            position: fixed;
            top: 18px;
            right: 18px;
            width: 320px;
            background: rgba(10,10,15,0.85);
            border: 1px solid rgba(0,245,255,0.25);
            backdrop-filter: blur(16px);
            border-radius: 14px;
            padding: 12px;
            z-index: 999999;
            color: white;
            font-family: Segoe UI;
        }

        #mc h2 {
            margin: 0 0 10px;
            color: #00f5ff;
        }

        .row {
            display: flex;
            justify-content: space-between;
            margin: 6px 0;
            font-size: 13px;
        }

        .toggle {
            width: 38px;
            height: 18px;
            background: #333;
            border-radius: 20px;
            cursor: pointer;
            position: relative;
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

        .toggle.on {
            background: #00f5ff;
            box-shadow: 0 0 10px #00f5ff;
        }

        .toggle.on .dot {
            transform: translateX(20px);
        }
    `);

    const panel = document.createElement("div");
    panel.id = "mc";

    panel.innerHTML = `
        <h2>Mini Client v3</h2>

        <div class="row">Glow <div class="toggle" id="glow"><div class="dot"></div></div></div>
        <div class="row">Blur <div class="toggle" id="blur"><div class="dot"></div></div></div>

        <div class="row">Cyan <div class="toggle on" id="cyan"><div class="dot"></div></div></div>
        <div class="row">Magenta <div class="toggle" id="magenta"><div class="dot"></div></div></div>
        <div class="row">Green <div class="toggle" id="green"><div class="dot"></div></div></div>

        <div class="row">Compact <div class="toggle" id="compact"><div class="dot"></div></div></div>
        <div class="row">Dark Boost <div class="toggle" id="dark"><div class="dot"></div></div></div>
        <div class="row">Rounded <div class="toggle on" id="rounded"><div class="dot"></div></div></div>
        <div class="row">Pulse <div class="toggle" id="pulse"><div class="dot"></div></div></div>
    `;

    document.body.appendChild(panel);

    function bind(id, key) {
        const el = document.getElementById(id);

        el.onclick = () => {
            Client.settings[key] = !Client.settings[key];
            el.classList.toggle("on");
            Client.apply();
        };
    }

    bind("glow", "glow");
    bind("blur", "blur");
    bind("cyan", "cyan");
    bind("magenta", "magenta");
    bind("green", "green");
    bind("compact", "compact");
    bind("dark", "darkBoost");
    bind("rounded", "rounded");
    bind("pulse", "pulse");

    Client.apply();
})();
