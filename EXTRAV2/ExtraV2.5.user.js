// ==UserScript==
// @name         Mini Discord Client (Sections UI)
// @namespace    mini.discord.client.sections
// @version      4.0
// @match        https://discord.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    /* =========================
        CORE CLIENT ENGINE
    ========================= */

    const Client = {
        styleTag: null,

        settings: {
            // UI
            blur: false,
            rounded: true,
            compact: false,

            // Theme
            glow: false,
            accent: "cyan",

            // Effects
            pulse: false,
            darkBoost: false,
            scanlines: false,

            // Chat
            messageGlow: false,
            hideEmbeds: false
        },

        init() {
            this.styleTag = document.createElement("style");
            document.head.appendChild(this.styleTag);
        },

        apply() {
            const s = this.settings;

            let accent = "#00f5ff";
            if (s.accent === "magenta") accent = "#ff3df2";
            if (s.accent === "green") accent = "#00ff88";
            if (s.accent === "blue") accent = "#4da3ff";

            let css = "";

            /* ===== GLOBAL EFFECTS ===== */

            if (s.darkBoost) {
                css += `
                    body {
                        filter: brightness(0.85) contrast(1.1);
                    }
                `;
            }

            if (s.blur) {
                css += `
                    div[class*="chat"],
                    div[class*="sidebar"] {
                        backdrop-filter: blur(18px) !important;
                    }
                `;
            }

            if (!s.rounded) {
                css += `
                    * {
                        border-radius: 0 !important;
                    }
                `;
            }

            if (s.compact) {
                css += `
                    div[class*="messageListItem"] {
                        margin: 2px 0 !important;
                    }
                `;
            }

            /* ===== THEME ===== */

            css += `
                a {
                    color: ${accent} !important;
                }

                button[class*="lookFilled"] {
                    background: ${accent} !important;
                    color: black !important;
                }
            `;

            /* ===== GLOW ===== */

            if (s.glow) {
                css += `
                    div[class*="messageContent"] {
                        text-shadow: 0 0 6px ${accent}55;
                    }
                `;
            }

            if (s.messageGlow) {
                css += `
                    div[class*="messageContent"] {
                        text-shadow: 0 0 10px ${accent}aa;
                    }
                `;
            }

            /* ===== PULSE ===== */

            if (s.pulse) {
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

            /* ===== SCANLINES ===== */

            if (s.scanlines) {
                css += `
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
                            transparent 2px
                        );
                        opacity: 0.2;
                        z-index: 9999;
                    }
                `;
            }

            /* ===== EMBEDS ===== */

            if (s.hideEmbeds) {
                css += `
                    div[class*="embed"] {
                        display: none !important;
                    }
                `;
            }

            this.styleTag.textContent = css;
        },

        toggle(key) {
            this.settings[key] = !this.settings[key];
            this.apply();
        },

        set(key, value) {
            this.settings[key] = value;
            this.apply();
        }
    };

    window.MiniClient = Client;
    Client.init();

    /* =========================
        UI SYSTEM (SECTIONS)
    ========================= */

    GM_addStyle(`
        #mc {
            position: fixed;
            top: 18px;
            right: 18px;
            width: 340px;
            background: rgba(10,10,15,0.88);
            border: 1px solid rgba(0,245,255,0.25);
            backdrop-filter: blur(18px);
            border-radius: 14px;
            padding: 12px;
            z-index: 999999;
            color: white;
            font-family: Segoe UI;
        }

        #mc h2 {
            margin: 0 0 10px;
            color: #00f5ff;
            font-size: 14px;
        }

        .section {
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }

        .section-title {
            font-size: 12px;
            color: #7a86a1;
            margin-bottom: 6px;
            letter-spacing: 1px;
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

        select {
            background: #111;
            color: white;
            border: 1px solid #333;
            border-radius: 6px;
            padding: 2px;
        }
    `);

    const panel = document.createElement("div");
    panel.id = "mc";

    panel.innerHTML = `
        <h2>Mini Client v4</h2>

        <!-- THEME SECTION -->
        <div class="section">
            <div class="section-title">THEME</div>

            <div class="row">Accent
                <select id="accent">
                    <option value="cyan">Cyan</option>
                    <option value="magenta">Magenta</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                </select>
            </div>

            <div class="row">Glow <div class="toggle" id="glow"><div class="dot"></div></div></div>
            <div class="row">Pulse <div class="toggle" id="pulse"><div class="dot"></div></div></div>
        </div>

        <!-- UI SECTION -->
        <div class="section">
            <div class="section-title">UI</div>

            <div class="row">Blur <div class="toggle" id="blur"><div class="dot"></div></div></div>
            <div class="row">Rounded <div class="toggle on" id="rounded"><div class="dot"></div></div></div>
            <div class="row">Compact <div class="toggle" id="compact"><div class="dot"></div></div></div>
        </div>

        <!-- EFFECTS SECTION -->
        <div class="section">
            <div class="section-title">EFFECTS</div>

            <div class="row">Dark Boost <div class="toggle" id="dark"><div class="dot"></div></div></div>
            <div class="row">Scanlines <div class="toggle" id="scan"><div class="dot"></div></div></div>
        </div>

        <!-- CHAT SECTION -->
        <div class="section">
            <div class="section-title">CHAT</div>

            <div class="row">Message Glow <div class="toggle" id="mglow"><div class="dot"></div></div></div>
            <div class="row">Hide Embeds <div class="toggle" id="embeds"><div class="dot"></div></div></div>
        </div>
    `;

    document.body.appendChild(panel);

    /* =========================
        BIND SYSTEM
    ========================= */

    function bind(id, key) {
        const el = document.getElementById(id);

        el.onclick = () => {
            Client.toggle(key);
            el.classList.toggle("on");
        };
    }

    bind("glow", "glow");
    bind("pulse", "pulse");
    bind("blur", "blur");
    bind("rounded", "rounded");
    bind("compact", "compact");
    bind("dark", "darkBoost");
    bind("scan", "scanlines");
    bind("mglow", "messageGlow");
    bind("embeds", "hideEmbeds");

    document.getElementById("accent").onchange = (e) => {
        Client.set("accent", e.target.value);
    };

    Client.apply();
})();
