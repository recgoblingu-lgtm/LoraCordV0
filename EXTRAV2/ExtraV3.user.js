// ==UserScript==
// @name         Mini Discord Client (Hamburger UI)
// @namespace    mini.discord.client.hamburger
// @version      5.0
// @match        https://discord.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    /* =========================
        CLIENT ENGINE
    ========================= */

    const Client = {
        styleTag: null,

        state: {
            page: "theme",
            settings: {
                accent: "cyan",
                glow: false,
                blur: false,
                pulse: false,
                scanlines: false,
                compact: false,
                rounded: true,
                darkBoost: false,
                messageGlow: false,
                hideEmbeds: false,
                smoothScroll: true,
                hideAvatars: false,
                rainbowMode: false,
                uiScale: 100
            }
        },

        init() {
            this.styleTag = document.createElement("style");
            document.head.appendChild(this.styleTag);
        },

        set(key, value) {
            this.state.settings[key] = value;
            this.render();
        },

        toggle(key) {
            this.state.settings[key] = !this.state.settings[key];
            this.render();
        },

        setPage(page) {
            this.state.page = page;
            document.querySelectorAll(".page").forEach(p => p.style.display = "none");
            const el = document.getElementById("page_" + page);
            if (el) el.style.display = "block";
        },

        render() {
            const s = this.state.settings;

            let accent = "#00f5ff";
            if (s.accent === "magenta") accent = "#ff3df2";
            if (s.accent === "green") accent = "#00ff88";
            if (s.accent === "blue") accent = "#4da3ff";

            let css = "";

            /* ===== GLOBAL ===== */
            if (s.darkBoost) {
                css += `body { filter: brightness(0.85) contrast(1.1); }`;
            }

            if (!s.rounded) {
                css += `* { border-radius: 0 !important; }`;
            }

            if (s.blur) {
                css += `
                    div[class*="chat"],
                    div[class*="sidebar"] {
                        backdrop-filter: blur(18px) !important;
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

            if (s.smoothScroll) {
                css += `* { scroll-behavior: smooth; }`;
            }

            if (s.hideAvatars) {
                css += `
                    img[class*="avatar"] {
                        display: none !important;
                    }
                `;
            }

            if (s.rainbowMode) {
                css += `
                    a {
                        animation: rainbow 3s infinite linear;
                    }

                    @keyframes rainbow {
                        0% { color: red; }
                        25% { color: yellow; }
                        50% { color: lime; }
                        75% { color: cyan; }
                        100% { color: red; }
                    }
                `;
            }

            /* ===== ACCENT ===== */
            css += `
                a { color: ${accent} !important; }
                button[class*="lookFilled"] { background: ${accent} !important; }
            `;

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
                        text-shadow: 0 0 12px ${accent}aa;
                    }
                `;
            }

            if (s.pulse) {
                css += `
                    a {
                        animation: pulse 2s infinite;
                    }

                    @keyframes pulse {
                        0% { text-shadow: 0 0 5px ${accent}; }
                        50% { text-shadow: 0 0 15px ${accent}; }
                        100% { text-shadow: 0 0 5px ${accent}; }
                    }
                `;
            }

            if (s.scanlines) {
                css += `
                    body::before {
                        content: "";
                        position: fixed;
                        inset: 0;
                        pointer-events: none;
                        background: repeating-linear-gradient(
                            to bottom,
                            rgba(255,255,255,0.02),
                            transparent 2px
                        );
                        opacity: 0.15;
                    }
                `;
            }

            this.styleTag.textContent = css;
        }
    };

    window.MiniClient = Client;
    Client.init();

    /* =========================
        UI STYLES
    ========================= */

    GM_addStyle(`
        #mc {
            position: fixed;
            top: 15px;
            right: 15px;
            width: 380px;
            height: 520px;
            background: rgba(10,10,15,0.92);
            backdrop-filter: blur(18px);
            border: 1px solid rgba(0,245,255,0.25);
            border-radius: 14px;
            color: white;
            font-family: Segoe UI;
            z-index: 999999;
            display: flex;
            overflow: hidden;
        }

        /* HAMBURGER SIDE BAR */
        #nav {
            width: 110px;
            background: rgba(0,0,0,0.4);
            display: flex;
            flex-direction: column;
            padding: 8px;
            gap: 6px;
        }

        .tab {
            padding: 6px;
            font-size: 11px;
            cursor: pointer;
            border-radius: 6px;
            background: rgba(255,255,255,0.05);
            text-align: center;
        }

        .tab:hover {
            background: rgba(0,245,255,0.15);
        }

        .tab.active {
            background: rgba(0,245,255,0.3);
            box-shadow: 0 0 10px rgba(0,245,255,0.3);
        }

        /* CONTENT */
        #content {
            flex: 1;
            padding: 10px;
            overflow-y: auto;
        }

        .page { display: none; }

        .row {
            display: flex;
            justify-content: space-between;
            margin: 6px 0;
            font-size: 12px;
        }

        .toggle {
            width: 34px;
            height: 16px;
            background: #333;
            border-radius: 20px;
            position: relative;
            cursor: pointer;
        }

        .dot {
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: 2px;
            transition: 0.2s;
        }

        .toggle.on {
            background: #00f5ff;
        }

        .toggle.on .dot {
            transform: translateX(18px);
        }

        select {
            background: #111;
            color: white;
            border: 1px solid #333;
        }
    `);

    /* =========================
        UI BUILD
    ========================= */

    const ui = document.createElement("div");
    ui.id = "mc";

    ui.innerHTML = `
        <div id="nav">
            <div class="tab active" data-page="theme">Theme</div>
            <div class="tab" data-page="ui">UI</div>
            <div class="tab" data-page="effects">Effects</div>
            <div class="tab" data-page="chat">Chat</div>
            <div class="tab" data-page="misc">Misc</div>
        </div>

        <div id="content">

            <!-- THEME -->
            <div class="page" id="page_theme">
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

            <!-- UI -->
            <div class="page" id="page_ui">
                <div class="row">Blur <div class="toggle" id="blur"><div class="dot"></div></div></div>
                <div class="row">Rounded <div class="toggle" id="rounded"><div class="dot"></div></div></div>
                <div class="row">Compact <div class="toggle" id="compact"><div class="dot"></div></div></div>
                <div class="row">Smooth Scroll <div class="toggle" id="scroll"><div class="dot"></div></div></div>
            </div>

            <!-- EFFECTS -->
            <div class="page" id="page_effects">
                <div class="row">Scanlines <div class="toggle" id="scan"><div class="dot"></div></div></div>
                <div class="row">Dark Boost <div class="toggle" id="dark"><div class="dot"></div></div></div>
                <div class="row">Rainbow Mode <div class="toggle" id="rainbow"><div class="dot"></div></div></div>
            </div>

            <!-- CHAT -->
            <div class="page" id="page_chat">
                <div class="row">Message Glow <div class="toggle" id="mglow"><div class="dot"></div></div></div>
                <div class="row">Hide Embeds <div class="toggle" id="embeds"><div class="dot"></div></div></div>
                <div class="row">Hide Avatars <div class="toggle" id="avatars"><div class="dot"></div></div></div>
            </div>

            <!-- MISC -->
            <div class="page" id="page_misc">
                <div class="row">UI Scale
                    <select id="scale">
                        <option value="90">90%</option>
                        <option value="100" selected>100%</option>
                        <option value="110">110%</option>
                    </select>
                </div>
            </div>

        </div>
    `;

    document.body.appendChild(ui);

    /* =========================
        TAB SYSTEM
    ========================= */

    document.querySelectorAll(".tab").forEach(t => {
        t.onclick = () => {
            document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
            t.classList.add("active");
            Client.setPage(t.dataset.page);
        };
    });

    /* =========================
        TOGGLES
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
    bind("avatars", "hideAvatars");
    bind("scroll", "smoothScroll");
    bind("rainbow", "rainbowMode");

    document.getElementById("accent").onchange = (e) => {
        Client.set("accent", e.target.value);
    };

    document.getElementById("scale").onchange = (e) => {
        document.body.style.zoom = e.target.value + "%";
    };

    Client.setPage("theme");
    Client.render();

})();
