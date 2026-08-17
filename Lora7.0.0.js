// ==UserScript==
// @name         LoraCord
// @namespace    https://loracord.local/
// @version      7.0.0
// @description  LoraCord Discord customization suite
// @author       LoraCord
// @match        https://discord.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // =========================================================
    // CONSTANTS
    // =========================================================

    const VERSION = "7.0.0";
    const STORAGE = "loracord7_";

    const IDS = {
        style: "loracord7-style",
        featureStyle: "loracord7-feature-style",
        launcher: "loracord7-launcher",
        panel: "loracord7-panel",
        toast: "loracord7-toast",
        toastHolder: "loracord7-toast-holder",
        wallpaper: "loracord7-wallpaper",
        customCSS: "loracord7-custom-css",
        counter: "loracord7-counter",
        fakeNitroStyle: "loracord7-fake-nitro-style"
    };

    let currentPage = "home";
    let pluginSearch = "";
    let pluginFilter = "all";

    // =========================================================
    // THEMES
    // =========================================================

    const THEMES = {
        LoraCord: {
            accent: "#5865f2",
            accent2: "#8b5cf6",
            bg1: "#0d1018",
            bg2: "#181d31",
            bg3: "#2a1640"
        },

        RecRoom: {
            accent: "#00c8ff",
            accent2: "#765cff",
            bg1: "#04101a",
            bg2: "#10243e",
            bg3: "#29143f"
        },

        Aurora: {
            accent: "#00e5ff",
            accent2: "#a05cff",
            bg1: "#061016",
            bg2: "#112945",
            bg3: "#321744"
        },

        Crimson: {
            accent: "#ff4f6d",
            accent2: "#ff9848",
            bg1: "#120507",
            bg2: "#301016",
            bg3: "#461c20"
        },

        Emerald: {
            accent: "#25dd88",
            accent2: "#00bca0",
            bg1: "#051009",
            bg2: "#0b2418",
            bg3: "#123c29"
        },

        Ocean: {
            accent: "#31b8ff",
            accent2: "#526fff",
            bg1: "#031019",
            bg2: "#09263e",
            bg3: "#113d53"
        },

        PurpleVoid: {
            accent: "#a76bff",
            accent2: "#ff4fd8",
            bg1: "#0f0414",
            bg2: "#241033",
            bg3: "#42154f"
        },

        Nitro: {
            accent: "#ff73fa",
            accent2: "#9b6cff",
            bg1: "#110715",
            bg2: "#22133a",
            bg3: "#371950"
        }
    };

    // =========================================================
    // PLUGINS
    // =========================================================

    const PLUGINS = [
        // Appearance
        ["glass", "Glass UI", "Appearance", "Adds translucent glass styling."],
        ["animatedBG", "Animated Background", "Appearance", "Adds an animated gradient."],
        ["glow", "Glow Effects", "Appearance", "Adds soft UI glow effects."],
        ["rounded", "Rounded UI", "Appearance", "Rounds Discord interface elements."],
        ["smooth", "Smooth Animations", "Appearance", "Adds smoother transitions."],
        ["compact", "Compact Mode", "Layout", "Reduces message spacing."],
        ["largerAvatars", "Larger Avatars", "Layout", "Makes avatars slightly larger."],
        ["hideMembers", "Hide Member List", "Layout", "Hides the right member list."],
        ["hideChannelIcons", "Hide Channel Icons", "Layout", "Reduces channel icon visibility."],

        // Messages
        ["messageHover", "Message Hover", "Messages", "Highlights messages on hover."],
        ["messageGlow", "Message Glow", "Messages", "Adds glow to hovered messages."],
        ["messageBorders", "Message Borders", "Messages", "Adds subtle message separators."],
        ["messageSpacing", "Message Spacing", "Messages", "Adds space between messages."],
        ["timestampGlow", "Timestamp Glow", "Messages", "Highlights timestamps."],
        ["linkGlow", "Link Glow", "Messages", "Adds glow to links."],
        ["codeGlow", "Code Block Glow", "Messages", "Adds glow around code."],
        ["mentionGlow", "Mention Highlight", "Messages", "Highlights mentions."],

        // Chat
        ["hideEmoji", "Hide Emoji Button", "Chat", "Hides the emoji button."],
        ["hideSticker", "Hide Sticker Button", "Chat", "Hides the sticker button."],
        ["hideGift", "Hide Gift Button", "Chat", "Hides the gift button."],
        ["largeComposer", "Larger Chat Box", "Chat", "Makes the composer taller."],
        ["composerGlow", "Chat Box Glow", "Chat", "Adds glow around the composer."],

        // Channels
        ["channelGlow", "Channel Glow", "Channels", "Highlights channels on hover."],
        ["selectedChannel", "Selected Channel Glow", "Channels", "Highlights selected channel."],
        ["channelSpacing", "Channel Spacing", "Channels", "Adds spacing between channels."],

        // Servers
        ["serverGlow", "Server Glow", "Servers", "Adds glow to server icons."],
        ["serverHover", "Server Hover", "Servers", "Adds hover animation to servers."],

        // Interface
        ["focus", "Focus Mode", "Interface", "Reduces visual distractions."],
        ["dimNitro", "Reduce Nitro UI", "Interface", "Dims some Nitro promotional UI."],
        ["dimBoost", "Reduce Boost UI", "Interface", "Dims boost-related UI."],
        ["fakeNitro", "FakeNitro", "Interface", "Cosmetic Nitro-style visuals only."],

        // Tools
        ["quickReplies", "Quick Replies", "Tools", "Stores reusable Discord messages."],
        ["characterCounter", "Character Counter", "Tools", "Shows composer character count."],
        ["timestamps", "Timestamp Generator", "Tools", "Generates Discord timestamps."],
        ["copyChannel", "Copy Channel URL", "Tools", "Copies the current channel URL."],
        ["notes", "Local Notes", "Tools", "Stores notes locally."],

        // Customization
        ["quickCSS", "Quick CSS", "Customization", "Applies custom CSS."],
        ["wallpaper", "Custom Wallpaper", "Customization", "Sets a custom background."],

        // Themes
        ["recRoom", "Rec Room Theme", "Themes", "Rec Room-inspired appearance."],
        ["aurora", "Aurora Theme", "Themes", "Aurora preset."],
        ["crimson", "Crimson Theme", "Themes", "Crimson preset."],
        ["emerald", "Emerald Theme", "Themes", "Emerald preset."],
        ["ocean", "Ocean Theme", "Themes", "Ocean preset."],
        ["purpleVoid", "Purple Void", "Themes", "Purple preset."],
        ["rainbow", "Rainbow Mode", "Themes", "Rainbow accent animation."],

        // Core
        ["shortcut", "Keyboard Shortcut", "Core", "Ctrl+Shift+L opens LoraCord."],
        ["launcher", "LoraCord Launcher", "Core", "Floating LoraCord button."]
    ].map(([id, name, category, description]) => ({
        id,
        name,
        category,
        description
    }));

    const DEFAULT_PLUGINS = {
        glass: true,
        animatedBG: false,
        glow: true,
        rounded: true,
        smooth: true,
        compact: false,
        largerAvatars: false,
        hideMembers: false,
        hideChannelIcons: false,
        messageHover: true,
        messageGlow: false,
        messageBorders: false,
        messageSpacing: false,
        timestampGlow: false,
        linkGlow: true,
        codeGlow: true,
        mentionGlow: true,
        hideEmoji: false,
        hideSticker: false,
        hideGift: false,
        largeComposer: false,
        composerGlow: true,
        channelGlow: true,
        selectedChannel: true,
        channelSpacing: false,
        serverGlow: true,
        serverHover: true,
        focus: false,
        dimNitro: false,
        dimBoost: false,
        fakeNitro: false,
        quickReplies: true,
        characterCounter: true,
        timestamps: true,
        copyChannel: true,
        notes: true,
        quickCSS: true,
        wallpaper: true,
        recRoom: false,
        aurora: false,
        crimson: false,
        emerald: false,
        ocean: false,
        purpleVoid: false,
        rainbow: false,
        shortcut: true,
        launcher: true
    };

    // =========================================================
    // STORAGE
    // =========================================================

    function getSetting(key, fallback) {
        try {
            const raw = localStorage.getItem(
                STORAGE + key
            );

            if (raw === null) {
                return fallback;
            }

            return JSON.parse(raw);
        } catch {
            return fallback;
        }
    }

    function setSetting(key, value) {
        try {
            localStorage.setItem(
                STORAGE + key,
                JSON.stringify(value)
            );
        } catch {}
    }

    function pluginEnabled(id) {
        return getSetting(
            "plugin_" + id,
            DEFAULT_PLUGINS[id] ?? false
        );
    }

    function setPlugin(id, enabled) {
        setSetting(
            "plugin_" + id,
            Boolean(enabled)
        );
    }

    // =========================================================
    // HELPERS
    // =========================================================

    function create(tag, options = {}) {
        const element =
            document.createElement(tag);

        if (options.id) {
            element.id = options.id;
        }

        if (options.className) {
            element.className =
                options.className;
        }

        if (options.text !== undefined) {
            element.textContent =
                options.text;
        }

        if (options.html !== undefined) {
            element.innerHTML =
                options.html;
        }

        return element;
    }

    function $(selector, root = document) {
        return root.querySelector(selector);
    }

    function $$(selector, root = document) {
        return Array.from(
            root.querySelectorAll(selector)
        );
    }

    function escapeHTML(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    // =========================================================
    // NOTIFICATIONS
    // =========================================================

    function notify(message) {
        let holder =
            document.getElementById(
                IDS.toastHolder
            );

        if (!holder) {
            holder = create("div", {
                id: IDS.toastHolder
            });

            Object.assign(
                holder.style,
                {
                    position: "fixed",
                    right: "18px",
                    bottom: "18px",
                    zIndex: "2147483647"
                }
            );

            document.body.appendChild(
                holder
            );
        }

        const toast =
            create("div", {
                text: message
            });

        Object.assign(
            toast.style,
            {
                padding: "10px 14px",
                marginTop: "7px",
                background: "#18191c",
                color: "#fff",
                border:
                    "1px solid rgba(88,101,242,.45)",
                borderRadius: "9px",
                fontFamily:
                    "Arial,sans-serif",
                fontSize: "12px",
                boxShadow:
                    "0 10px 30px rgba(0,0,0,.4)",
                opacity: "0",
                transform:
                    "translateY(8px)",
                transition: ".18s ease"
            }
        );

        holder.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform =
                "translateY(0)";
        });

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform =
                "translateY(8px)";

            setTimeout(
                () => toast.remove(),
                220
            );
        }, 1800);
    }

    // =========================================================
    // BASE CSS
    // =========================================================

    function injectBaseCSS() {
        if (
            document.getElementById(
                IDS.style
            )
        ) {
            return;
        }

        const style =
            create("style", {
                id: IDS.style
            });

        style.textContent = `
            :root {
                --lc-accent: #5865f2;
                --lc-accent2: #8b5cf6;
                --lc-blur: 16px;
                --lc-radius: 12px;
            }

            @keyframes lcBG {
                0% {
                    background-position: 0% 50%;
                }

                50% {
                    background-position: 100% 50%;
                }

                100% {
                    background-position: 0% 50%;
                }
            }

            @keyframes lcGlow {
                0%,100% {
                    box-shadow:
                        0 0 10px
                        rgba(88,101,242,.25);
                }

                50% {
                    box-shadow:
                        0 0 28px
                        rgba(88,101,242,.65);
                }
            }

            @keyframes lcNitro {
                0% {
                    background-position: 0% 50%;
                }

                50% {
                    background-position: 100% 50%;
                }

                100% {
                    background-position: 0% 50%;
                }
            }

            #${IDS.launcher} {
                position: fixed !important;
                right: 18px !important;
                bottom: 18px !important;
                width: 52px !important;
                height: 52px !important;
                border: 0 !important;
                border-radius: 15px !important;
                background:
                    linear-gradient(
                        135deg,
                        var(--lc-accent),
                        var(--lc-accent2)
                    ) !important;
                color: white !important;
                font-size: 21px !important;
                font-weight: 900 !important;
                cursor: pointer !important;
                z-index: 2147483647 !important;
            }

            #${IDS.launcher}.glow {
                animation:
                    lcGlow 3s ease infinite !important;
            }

            #${IDS.launcher}.nitro {
                background:
                    linear-gradient(
                        135deg,
                        #ff73fa,
                        #9b6cff,
                        #5865f2,
                        #ff73fa
                    ) !important;

                background-size: 300% 300% !important;

                animation:
                    lcNitro 4s ease infinite !important;

                box-shadow:
                    0 0 22px
                    rgba(255,115,250,.5) !important;
            }

            #${IDS.panel} {
                position: fixed !important;
                left: 50% !important;
                top: 50% !important;

                width:
                    min(
                        940px,
                        calc(100vw - 24px)
                    ) !important;

                height:
                    min(
                        680px,
                        calc(100vh - 24px)
                    ) !important;

                transform:
                    translate(-50%,-50%) !important;

                display: none !important;
                overflow: hidden !important;

                background: #111214 !important;
                color: white !important;

                border:
                    1px solid
                    rgba(255,255,255,.08) !important;

                border-radius: 16px !important;

                box-shadow:
                    0 25px 90px
                    rgba(0,0,0,.68) !important;

                z-index: 2147483646 !important;

                font-family:
                    Arial,sans-serif !important;

                pointer-events:
                    auto !important;
            }

            #${IDS.panel}.open {
                display: flex !important;
            }

            #${IDS.panel} * {
                box-sizing: border-box;
            }

            .lc-side {
                width: 205px;
                flex: 0 0 205px;
                background: #0f1012;
                border-right:
                    1px solid
                    rgba(255,255,255,.06);
                display: flex;
                flex-direction: column;
            }

            .lc-brand {
                padding: 17px;
                border-bottom:
                    1px solid
                    rgba(255,255,255,.06);
            }

            .lc-brand-row {
                display: flex;
                align-items: center;
                gap: 9px;
            }

            .lc-logo {
                width: 35px;
                height: 35px;
                display: grid;
                place-items: center;
                border-radius: 10px;

                background:
                    linear-gradient(
                        135deg,
                        var(--lc-accent),
                        var(--lc-accent2)
                    );

                font-weight: 900;
            }

            .lc-brand-name {
                font-size: 15px;
                font-weight: 900;
            }

            .lc-brand-version {
                font-size: 9px;
                color: #777d86;
                margin-top: 2px;
            }

            .lc-search {
                width: calc(100% - 20px);
                margin: 10px;
                padding: 9px;

                background: #08090b;
                border:
                    1px solid
                    rgba(255,255,255,.07);

                border-radius: 8px;
                outline: none;
                color: white;
            }

            .lc-nav {
                padding: 0 9px;
                overflow-y: auto;
            }

            .lc-nav-section {
                padding:
                    12px 8px 5px;

                color: #686e76;
                font-size: 9px;
                font-weight: 900;
                letter-spacing: 1px;
                text-transform: uppercase;
            }

            .lc-nav-btn {
                width: 100%;
                padding: 9px;
                margin-bottom: 3px;

                border: 0;
                border-radius: 8px;

                background: transparent;
                color: #a5a8ae;

                text-align: left;

                cursor: pointer;

                font-size: 11px;
                font-weight: 700;
            }

            .lc-nav-btn:hover,
            .lc-nav-btn.active {
                background:
                    rgba(88,101,242,.17);

                color: white;
            }

            .lc-side-bottom {
                margin-top: auto;
                padding: 10px;
                border-top:
                    1px solid
                    rgba(255,255,255,.06);

                color: #777d86;
                font-size: 9px;
            }

            .lc-main {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
            }

            .lc-top {
                height: 58px;
                flex: 0 0 58px;

                display: flex;
                align-items: center;
                justify-content: space-between;

                padding: 0 15px;

                border-bottom:
                    1px solid
                    rgba(255,255,255,.06);
            }

            .lc-top-title {
                font-size: 14px;
                font-weight: 900;
            }

            .lc-top-actions {
                display: flex;
                gap: 5px;
            }

            .lc-top-btn {
                width: 31px;
                height: 31px;

                border: 0;
                border-radius: 8px;

                background:
                    rgba(255,255,255,.05);

                color: white;
                cursor: pointer;
            }

            .lc-content {
                flex: 1;
                overflow-y: auto;
                padding: 18px;
            }

            .lc-title {
                font-size: 23px;
                font-weight: 900;
                margin-bottom: 4px;
            }

            .lc-sub {
                color: #9297a0;
                font-size: 11px;
                margin-bottom: 16px;
            }

            .lc-card {
                padding: 13px;
                margin-bottom: 11px;

                border:
                    1px solid
                    rgba(255,255,255,.06);

                border-radius: 11px;

                background:
                    rgba(255,255,255,.03);
            }

            .lc-card-title {
                font-size: 13px;
                font-weight: 800;
                margin-bottom: 6px;
            }

            .lc-description {
                color: #9297a0;
                font-size: 10px;
                line-height: 1.45;
                margin-bottom: 9px;
            }

            .lc-btn {
                width: 100%;
                padding: 9px;
                margin-top: 6px;

                border:
                    1px solid
                    rgba(255,255,255,.07);

                border-radius: 8px;

                background:
                    rgba(255,255,255,.045);

                color: white;

                text-align: left;

                cursor: pointer;

                font-size: 11px;
                font-weight: 700;
            }

            .lc-btn:hover {
                background:
                    rgba(88,101,242,.16);

                border-color:
                    rgba(88,101,242,.3);
            }

            .lc-input,
            .lc-plugin-search {
                width: 100%;
                padding: 10px;

                background: #090a0c;

                border:
                    1px solid
                    rgba(255,255,255,.07);

                border-radius: 8px;
                outline: none;
                color: white;

                margin-bottom: 8px;
            }

            .lc-textarea {
                width: 100%;
                min-height: 240px;
                padding: 10px;

                background: #090a0c;

                border:
                    1px solid
                    rgba(255,255,255,.07);

                border-radius: 8px;
                outline: none;

                color: white;

                resize: vertical;

                font-family: monospace;
                font-size: 12px;
            }

            .lc-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin: 2px 0 14px;
            }

            .lc-filter {
                padding: 7px 10px;
                border: 0;
                border-radius: 7px;
                background: #2b2d31;
                color: white;
                cursor: pointer;
                font-size: 10px;
                font-weight: 700;
            }

            .lc-filter.active {
                background:
                    var(--lc-accent);
            }

            .lc-category {
                margin:
                    17px 0 6px;

                color: #727780;

                font-size: 9px;
                font-weight: 900;

                letter-spacing: 1px;
                text-transform: uppercase;
            }

            .lc-plugin {
                display: flex;
                align-items: center;
                justify-content: space-between;

                gap: 12px;

                padding: 11px 0;

                border-bottom:
                    1px solid
                    rgba(255,255,255,.045);
            }

            .lc-plugin-name {
                font-size: 12px;
                font-weight: 800;
            }

            .lc-plugin-description {
                color: #9297a0;
                font-size: 10px;
                margin-top: 3px;
                line-height: 1.4;
            }

            .lc-toggle {
                position: relative;
                width: 40px;
                height: 22px;
                flex: 0 0 40px;
            }

            .lc-toggle input {
                display: none;
            }

            .lc-toggle-track {
                position: absolute;
                inset: 0;

                border-radius: 20px;

                background:
                    #3a3d44;

                cursor: pointer;
            }

            .lc-toggle-track::before {
                content: "";

                position: absolute;

                width: 16px;
                height: 16px;

                left: 3px;
                top: 3px;

                border-radius: 50%;

                background: white;

                transition: .18s ease;
            }

            .lc-toggle input:checked
            + .lc-toggle-track {
                background:
                    var(--lc-accent);
            }

            .lc-toggle input:checked
            + .lc-toggle-track::before {
                transform:
                    translateX(18px);
            }

            .lc-theme-preview {
                width: 100%;
                height: 64px;
                margin-bottom: 8px;
                border-radius: 8px;
            }

            /* =====================================================
               FAKE NITRO
            ===================================================== */

            #${IDS.panel}.nitro {
                border-color:
                    rgba(255,115,250,.3) !important;

                box-shadow:
                    0 0 45px
                    rgba(255,115,250,.12) !important;
            }

            #${IDS.launcher}.nitro {
                background:
                    linear-gradient(
                        135deg,
                        #ff73fa,
                        #9b6cff,
                        #5865f2,
                        #ff73fa
                    ) !important;

                background-size:
                    300% 300% !important;

                animation:
                    lcNitro 4s ease infinite !important;

                box-shadow:
                    0 0 25px
                    rgba(255,115,250,.5) !important;
            }

            .loracord-fake-nitro-badge {
                display:
                    inline-flex !important;

                align-items:
                    center !important;

                margin-left:
                    6px !important;

                padding:
                    2px 6px !important;

                border-radius:
                    5px !important;

                background:
                    linear-gradient(
                        135deg,
                        #ff73fa,
                        #9b6cff,
                        #5865f2
                    ) !important;

                background-size:
                    250% 250% !important;

                color:
                    white !important;

                font-size:
                    8px !important;

                font-weight:
                    900 !important;

                letter-spacing:
                    .4px !important;

                box-shadow:
                    0 0 10px
                    rgba(255,115,250,.35) !important;

                animation:
                    lcNitro
                    4s
                    ease
                    infinite !important;

                pointer-events:
                    none !important;
            }

            @media(max-width:650px) {
                .lc-side {
                    width: 60px;
                    flex-basis: 60px;
                }

                .lc-brand-name,
                .lc-brand-version,
                .lc-nav-section {
                    display: none;
                }

                .lc-nav-btn {
                    text-align: center;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // =========================================================
    // THEME
    // =========================================================

    function applyTheme(name) {
        const theme = THEMES[name];

        if (!theme) {
            return;
        }

        document.documentElement.style.setProperty(
            "--lc-accent",
            theme.accent
        );

        document.documentElement.style.setProperty(
            "--lc-accent2",
            theme.accent2
        );

        setSetting("theme", name);

        if (
            pluginEnabled("animatedBG")
        ) {
            document.body.style.background =
                `linear-gradient(
                    135deg,
                    ${theme.bg1},
                    ${theme.bg2},
                    ${theme.bg3}
                )`;

            document.body.style.backgroundSize =
                "400% 400%";

            document.body.style.animation =
                "lcBG 18s ease infinite";
        }

        refreshLauncher();

        notify(
            name + " theme applied."
        );
    }

    // =========================================================
    // FEATURE CSS
    // =========================================================

    function rebuildFeatureCSS() {
        let style =
            document.getElementById(
                IDS.featureStyle
            );

        if (!style) {
            style =
                create("style", {
                    id: IDS.featureStyle
                });

            document.head.appendChild(style);
        }

        let css = "";

        if (
            pluginEnabled("glass")
        ) {
            css += `
                [class*="sidebar"],
                [class*="guilds"],
                [class*="panels"] {
                    backdrop-filter:
                        blur(var(--lc-blur))
                        saturate(135%)
                        !important;
                }
            `;
        }

        if (
            pluginEnabled("animatedBG")
        ) {
            css += `
                body {
                    background:
                        linear-gradient(
                            135deg,
                            #080a11,
                            #111a31,
                            #2b1340,
                            #071a2b
                        ) !important;

                    background-size:
                        400% 400% !important;

                    animation:
                        lcBG
                        18s
                        ease
                        infinite !important;
                }
            `;
        }

        if (
            pluginEnabled("glow")
        ) {
            css += `
                button:hover {
                    box-shadow:
                        0 0 14px
                        rgba(88,101,242,.18)
                        !important;
                }
            `;
        }

        if (
            pluginEnabled("rounded")
        ) {
            css += `
                [role="dialog"],
                [class*="card"],
                [class*="container"] {
                    border-radius:
                        var(--lc-radius)
                        !important;
                }
            `;
        }

        if (
            pluginEnabled("smooth")
        ) {
            css += `
                button,
                [role="button"],
                [class*="channel"],
                [class*="message"] {
                    transition:
                        .16s ease !important;
                }
            `;
        }

        if (
            pluginEnabled("compact")
        ) {
            css += `
                [class*="message"] {
                    padding-top: 3px !important;
                    padding-bottom: 3px !important;
                }
            `;
        }

        if (
            pluginEnabled("largerAvatars")
        ) {
            css += `
                [class*="avatar"] {
                    transform: scale(1.06);
                }
            `;
        }

        if (
            pluginEnabled("messageHover")
        ) {
            css += `
                [class*="message"]:hover {
                    background:
                        rgba(
                            88,
                            101,
                            242,
                            .055
                        ) !important;
                }
            `;
        }

        if (
            pluginEnabled("messageGlow")
        ) {
            css += `
                [class*="message"]:hover {
                    box-shadow:
                        inset 3px 0 0
                        rgba(
                            88,
                            101,
                            242,
                            .5
                        ) !important;
                }
            `;
        }

        if (
            pluginEnabled("messageBorders")
        ) {
            css += `
                [class*="message"] {
                    border-bottom:
                        1px solid
                        rgba(
                            255,
                            255,
                            255,
                            .025
                        ) !important;
                }
            `;
        }

        if (
            pluginEnabled("messageSpacing")
        ) {
            css += `
                [class*="message"] {
                    margin:
                        2px 0 !important;
                }
            `;
        }

        if (
            pluginEnabled("timestampGlow")
        ) {
            css += `
                time {
                    text-shadow:
                        0 0 8px
                        rgba(
                            88,
                            101,
                            242,
                            .45
                        ) !important;
                }
            `;
        }

        if (
            pluginEnabled("linkGlow")
        ) {
            css += `
                a:hover {
                    text-shadow:
                        0 0 10px
                        rgba(
                            88,
                            101,
                            242,
                            .4
                        ) !important;
                }
            `;
        }

        if (
            pluginEnabled("codeGlow")
        ) {
            css += `
                pre,
                code {
                    box-shadow:
                        0 0 15px
                        rgba(
                            88,
                            101,
                            242,
                            .12
                        ) !important;
                }
            `;
        }

        if (
            pluginEnabled("mentionGlow")
        ) {
            css += `
                [class*="mention"] {
                    background:
                        rgba(
                            88,
                            101,
                            242,
                            .17
                        ) !important;

                    border-radius: 5px !important;
                }
            `;
        }

        if (
            pluginEnabled("hideEmoji")
        ) {
            css += `
                button[
                    aria-label*="emoji" i
                ] {
                    display:
                        none !important;
                }
            `;
        }

        if (
            pluginEnabled("hideSticker")
        ) {
            css += `
                button[
                    aria-label*="sticker" i
                ] {
                    display:
                        none !important;
                }
            `;
        }

        if (
            pluginEnabled("hideGift")
        ) {
            css += `
                button[
                    aria-label*="gift" i
                ] {
                    display:
                        none !important;
                }
            `;
        }

        if (
            pluginEnabled("largeComposer")
        ) {
            css += `
                [role="textbox"] {
                    min-height:
                        52px !important;
                }
            `;
        }

        if (
            pluginEnabled("composerGlow")
        ) {
            css += `
                [role="textbox"]:focus-within {
                    box-shadow:
                        0 0 0 2px
                        rgba(
                            88,
                            101,
                            242,
                            .12
                        ),
                        0 0 25px
                        rgba(
                            88,
                            101,
                            242,
                            .12
                        ) !important;
                }
            `;
        }

        if (
            pluginEnabled("channelGlow")
        ) {
            css += `
                [class*="containerDefault"]:hover {
                    box-shadow:
                        inset 2px 0 0
                        rgba(
                            88,
                            101,
                            242,
                            .5
                        ) !important;
                }
            `;
        }

        if (
            pluginEnabled("selectedChannel")
        ) {
            css += `
                [class*="modeSelected"] {
                    box-shadow:
                        inset 3px 0 0
                        var(--lc-accent)
                        !important;
                }
            `;
        }

        if (
            pluginEnabled("channelSpacing")
        ) {
            css += `
                [class*="containerDefault"] {
                    margin: 2px 0 !important;
                }
            `;
        }

        if (
            pluginEnabled("serverGlow")
        ) {
            css += `
                [class*="listItem"]:hover {
                    filter:
                        drop-shadow(
                            0 0 8px
                            rgba(
                                88,
                                101,
                                242,
                                .5
                            )
                        );
                }
            `;
        }

        if (
            pluginEnabled("serverHover")
        ) {
            css += `
                [class*="listItem"] {
                    transition:
                        .16s ease !important;
                }

                [class*="listItem"]:hover {
                    transform:
                        translateY(-1px);
                }
            `;
        }

        if (
            pluginEnabled("hideMembers")
        ) {
            css += `
                [class*="membersWrap"] {
                    display:
                        none !important;
                }
            `;
        }

        if (
            pluginEnabled("hideChannelIcons")
        ) {
            css += `
                [class*="containerDefault"] svg {
                    opacity:
                        .55 !important;
                }
            `;
        }

        if (
            pluginEnabled("focus")
        ) {
            css += `
                [class*="promo"],
                [class*="upsell"] {
                    opacity:
                        .45 !important;
                }
            `;
        }

        if (
            pluginEnabled("dimNitro")
        ) {
            css += `
                [class*="premium"] {
                    opacity:
                        .4 !important;
                }
            `;
        }

        if (
            pluginEnabled("dimBoost")
        ) {
            css += `
                [class*="boost"] {
                    opacity:
                        .45 !important;
                }
            `;
        }

        style.textContent = css;
    }

    // =========================================================
    // FAKE NITRO
    // =========================================================

    function refreshFakeNitro() {
        const panel =
            document.getElementById(
                IDS.panel
            );

        const launcher =
            document.getElementById(
                IDS.launcher
            );

        const enabled =
            pluginEnabled(
                "fakeNitro"
            );

        panel?.classList.toggle(
            "nitro",
            enabled
        );

        launcher?.classList.toggle(
            "nitro",
            enabled
        );

        let style =
            document.getElementById(
                IDS.fakeNitroStyle
            );

        if (!enabled) {
            style?.remove();
            removeFakeBadges();
            return;
        }

        if (!style) {
            style =
                create(
                    "style",
                    {
                        id:
                            IDS.fakeNitroStyle
                    }
                );

            style.textContent = `
                .loracord-fake-nitro-badge {
                    display: inline-flex !important;
                    align-items: center !important;
                    margin-left: 6px !important;
                    padding: 2px 6px !important;
                    border-radius: 5px !important;

                    background:
                        linear-gradient(
                            135deg,
                            #ff73fa,
                            #9b6cff,
                            #5865f2
                        ) !important;

                    background-size:
                        250% 250% !important;

                    color: white !important;
                    font-size: 8px !important;
                    font-weight: 900 !important;
                    letter-spacing: .4px !important;

                    box-shadow:
                        0 0 10px
                        rgba(
                            255,
                            115,
                            250,
                            .35
                        ) !important;

                    animation:
                        lcNitro
                        4s
                        ease
                        infinite !important;

                    pointer-events: none !important;
                }
            `;

            document.head.appendChild(
                style
            );
        }

        addFakeBadges();
    }

    function addFakeBadges() {
        if (
            !pluginEnabled(
                "fakeNitro"
            )
        ) {
            return;
        }

        const targets = [
            ...$$(
                '[class*="premium"]'
            ),
            ...$$(
                '[class*="nitro"]'
            ),
            ...$$(
                '[aria-label*="Nitro" i]'
            )
        ];

        targets
            .slice(0, 12)
            .forEach(element => {

                if (
                    element.querySelector(
                        ".loracord-fake-nitro-badge"
                    )
                ) {
                    return;
                }

                const badge =
                    create(
                        "span",
                        {
                            className:
                                "loracord-fake-nitro-badge",
                            text:
                                "✦ NITRO"
                        }
                    );

                element.appendChild(
                    badge
                );
            });
    }

    function removeFakeBadges() {
        $$(
            ".loracord-fake-nitro-badge"
        ).forEach(
            badge =>
                badge.remove()
        );
    }

    // =========================================================
    // LAUNCHER
    // =========================================================

    function refreshLauncher() {
        const old =
            document.getElementById(
                IDS.launcher
            );

        if (old) {
            old.remove();
        }

        if (
            !pluginEnabled(
                "launcher"
            )
        ) {
            return;
        }

        const button =
            create(
                "button",
                {
                    id:
                        IDS.launcher,
                    text:
                        "✦"
                }
            );

        button.title =
            "Open LoraCord";

        if (
            pluginEnabled(
                "glow"
            ) &&
            !pluginEnabled(
                "fakeNitro"
            )
        ) {
            button.classList.add(
                "glow"
            );
        }

        if (
            pluginEnabled(
                "fakeNitro"
            )
        ) {
            button.classList.add(
                "nitro"
            );
        }

        button.addEventListener(
            "click",
            () => {
                openPanel();
            }
        );

        document.body.appendChild(
            button
        );
    }

    // =========================================================
    // PANEL
    // =========================================================

    function createPanel() {
        if (
            document.getElementById(
                IDS.panel
            )
        ) {
            return;
        }

        const panel =
            create(
                "div",
                {
                    id:
                        IDS.panel
                }
            );

        panel.innerHTML = `
            <div class="lc-side">

                <div class="lc-brand">

                    <div class="lc-brand-row">

                        <div class="lc-logo">
                            L
                        </div>

                        <div>
                            <div class="lc-brand-name">
                                LoraCord
                            </div>

                            <div class="lc-brand-version">
                                v${VERSION}
                            </div>
                        </div>

                    </div>

                </div>

                <input
                    class="lc-search"
                    id="lcSearch"
                    placeholder="Search..."
                >

                <div class="lc-nav">

                    <div class="lc-nav-section">
                        General
                    </div>

                    <button
                        class="lc-nav-btn active"
                        data-page="home">
                        ⌂ Home
                    </button>

                    <button
                        class="lc-nav-btn"
                        data-page="plugins">
                        🧩 Plugins
                    </button>

                    <button
                        class="lc-nav-btn"
                        data-page="themes">
                        🎨 Themes
                    </button>

                    <div class="lc-nav-section">
                        Tools
                    </div>

                    <button
                        class="lc-nav-btn"
                        data-page="quick">
                        ⚡ Quick Replies
                    </button>

                    <button
                        class="lc-nav-btn"
                        data-page="tools">
                        🧰 Toolbox
                    </button>

                    <button
                        class="lc-nav-btn"
                        data-page="css">
                        ⌘ Quick CSS
                    </button>

                    <button
                        class="lc-nav-btn"
                        data-page="wallpaper">
                        🖼 Wallpaper
                    </button>

                    <button
                        class="lc-nav-btn"
                        data-page="notes">
                        📝 Notes
                    </button>

                    <div class="lc-nav-section">
                        System
                    </div>

                    <button
                        class="lc-nav-btn"
                        data-page="settings">
                        ⚙ Settings
                    </button>

                </div>

                <div class="lc-side-bottom">
                    LoraCord ${VERSION}
                </div>

            </div>

            <div class="lc-main">

                <div class="lc-top">

                    <div
                        class="lc-top-title"
                        id="lcPageTitle">
                        Home
                    </div>

                    <div class="lc-top-actions">

                        <button
                            class="lc-top-btn"
                            id="lcReload">
                            ↻
                        </button>

                        <button
                            class="lc-top-btn"
                            id="lcClose">
                            ×
                        </button>

                    </div>

                </div>

                <div
                    class="lc-content"
                    id="lcContent">
                </div>

            </div>
        `;

        document.body.appendChild(
            panel
        );

        // =====================================================
        // IMPORTANT:
        // ONE CLICK HANDLER FOR ALL NAV BUTTONS
        // =====================================================

        panel.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        ".lc-nav-btn"
                    );

                if (
                    !button ||
                    !panel.contains(
                        button
                    )
                ) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                const page =
                    button.dataset.page;

                if (!page) {
                    return;
                }

                $$(".lc-nav-btn", panel)
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );

                button.classList.add(
                    "active"
                );

                currentPage =
                    page;

                const title =
                    document.getElementById(
                        "lcPageTitle"
                    );

                if (title) {
                    title.textContent =
                        button.textContent.trim();
                }

                renderPage(
                    page
                );
            },
            true
        );

        const close =
            document.getElementById(
                "lcClose"
            );

        close.addEventListener(
            "click",
            event => {
                event.preventDefault();
                event.stopPropagation();

                panel.classList.remove(
                    "open"
                );
            },
            true
        );

        const reload =
            document.getElementById(
                "lcReload"
            );

        reload.addEventListener(
            "click",
            event => {
                event.preventDefault();
                event.stopPropagation();

                location.reload();
            },
            true
        );

        const search =
            document.getElementById(
                "lcSearch"
            );

        search.addEventListener(
            "input",
            () => {

                const value =
                    search.value
                        .trim()
                        .toLowerCase();

                if (!value) {
                    return;
                }

                openPage(
                    "plugins"
                );

                setTimeout(
                    () => {

                        const pluginSearch =
                            document.getElementById(
                                "lcPluginSearch"
                            );

                        if (
                            pluginSearch
                        ) {
                            pluginSearch.value =
                                value;

                            pluginSearch.dispatchEvent(
                                new Event(
                                    "input",
                                    {
                                        bubbles:
                                            true
                                    }
                                )
                            );
                        }
                    },
                    30
                );
            }
        );

        renderPage(
            "home"
        );
    }

    function openPanel() {
        let panel =
            document.getElementById(
                IDS.panel
            );

        if (!panel) {
            createPanel();

            panel =
                document.getElementById(
                    IDS.panel
                );
        }

        panel.classList.add(
            "open"
        );
    }

    function openPage(page) {
        const panel =
            document.getElementById(
                IDS.panel
            );

        if (!panel) {
            return;
        }

        const button =
            panel.querySelector(
                `.lc-nav-btn[data-page="${page}"]`
            );

        if (button) {
            button.dispatchEvent(
                new MouseEvent(
                    "click",
                    {
                        bubbles: true,
                        cancelable: true
                    }
                )
            );
        }
    }

    // =========================================================
    // PAGE RENDERING
    // =========================================================

    function renderPage(page) {
        const content =
            document.getElementById(
                "lcContent"
            );

        if (!content) {
            return;
        }

        content.innerHTML = "";

        if (page === "home") {
            renderHome(
                content
            );
        }

        if (page === "plugins") {
            renderPlugins(
                content
            );
        }

        if (page === "themes") {
            renderThemes(
                content
            );
        }

        if (page === "quick") {
            renderQuickReplies(
                content
            );
        }

        if (page === "tools") {
            renderTools(
                content
            );
        }

        if (page === "css") {
            renderCSS(
                content
            );
        }

        if (page === "wallpaper") {
            renderWallpaper(
                content
            );
        }

        if (page === "notes") {
            renderNotes(
                content
            );
        }

        if (page === "settings") {
            renderSettings(
                content
            );
        }

        refreshFakeNitro();
    }

    // =========================================================
    // HOME
    // =========================================================

    function renderHome(content) {
        content.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-title",
                    text:
                        "LoraCord"
                }
            )
        );

        content.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-sub",
                    text:
                        "Discord customization suite"
                }
            )
        );

        const card =
            create(
                "div",
                {
                    className:
                        "lc-card"
                }
            );

        card.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-card-title",
                    text:
                        "Welcome"
                }
            )
        );

        card.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-description",
                    text:
                        `${PLUGINS.length} LoraCord plugins are available.`
                }
            )
        );

        card.appendChild(
            makeButton(
                "🧩 Open Plugins",
                () =>
                    openPage(
                        "plugins"
                    )
            )
        );

        card.appendChild(
            makeButton(
                "🎨 Open Themes",
                () =>
                    openPage(
                        "themes"
                    )
            )
        );

        card.appendChild(
            makeButton(
                "💎 Toggle FakeNitro",
                () => {

                    const newValue =
                        !pluginEnabled(
                            "fakeNitro"
                        );

                    setPlugin(
                        "fakeNitro",
                        newValue
                    );

                    refreshLauncher();
                    refreshFakeNitro();

                    notify(
                        newValue
                            ? "FakeNitro enabled."
                            : "FakeNitro disabled."
                    );
                }
            )
        );

        content.appendChild(
            card
        );
    }

    function makeButton(
        text,
        callback
    ) {
        const button =
            create(
                "button",
                {
                    className:
                        "lc-btn",
                    text
                }
            );

        button.addEventListener(
            "click",
            event => {
                event.preventDefault();
                event.stopPropagation();
                callback();
            },
            true
        );

        return button;
    }

    // =========================================================
    // PLUGIN PAGE
    // =========================================================

    function renderPlugins(content) {
        content.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-title",
                    text:
                        "Plugins"
                }
            )
        );

        content.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-sub",
                    text:
                        `${PLUGINS.length} LoraCord plugins`
                }
            )
        );

        const search =
            create(
                "input",
                {
                    className:
                        "lc-plugin-search",
                    id:
                        "lcPluginSearch"
                }
            );

        search.placeholder =
            "Search plugins...";

        search.value =
            pluginSearch;

        search.addEventListener(
            "input",
            () => {

                pluginSearch =
                    search.value;

                renderPlugins(
                    content
                );
            }
        );

        content.appendChild(
            search
        );

        const filters =
            create(
                "div",
                {
                    className:
                        "lc-filters"
                }
            );

        [
            ["all", "All"],
            ["enabled", "Enabled"],
            ["disabled", "Disabled"]
        ].forEach(
            ([id, label]) => {

                const button =
                    create(
                        "button",
                        {
                            className:
                                "lc-filter" +
                                (
                                    pluginFilter ===
                                    id
                                        ? " active"
                                        : ""
                                ),
                            text:
                                label
                        }
                    );

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();
                        event.stopPropagation();

                        pluginFilter =
                            id;

                        renderPlugins(
                            content
                        );
                    },
                    true
                );

                filters.appendChild(
                    button
                );
            }
        );

        content.appendChild(
            filters
        );

        const filtered =
            PLUGINS.filter(
                plugin => {

                    const query =
                        pluginSearch
                            .trim()
                            .toLowerCase();

                    const matchesText =
                        !query ||
                        plugin.name
                            .toLowerCase()
                            .includes(
                                query
                            ) ||
                        plugin.description
                            .toLowerCase()
                            .includes(
                                query
                            );

                    const enabled =
                        pluginEnabled(
                            plugin.id
                        );

                    const matchesFilter =
                        pluginFilter ===
                            "all"
                            ? true
                            : pluginFilter ===
                                "enabled"
                                ? enabled
                                : !enabled;

                    return (
                        matchesText &&
                        matchesFilter
                    );
                }
            );

        const groups = {};

        filtered.forEach(
            plugin => {

                if (
                    !groups[
                        plugin.category
                    ]
                ) {
                    groups[
                        plugin.category
                    ] = [];
                }

                groups[
                    plugin.category
                ].push(
                    plugin
                );
            }
        );

        Object.entries(
            groups
        ).forEach(
            ([category, plugins]) => {

                content.appendChild(
                    create(
                        "div",
                        {
                            className:
                                "lc-category",
                            text:
                                category
                        }
                    )
                );

                plugins.forEach(
                    plugin => {

                        const row =
                            create(
                                "div",
                                {
                                    className:
                                        "lc-plugin"
                                }
                            );

                        const info =
                            create(
                                "div"
                            );

                        info.innerHTML =
                            `
                                <div class="lc-plugin-name">
                                    ${escapeHTML(
                                        plugin.name
                                    )}
                                </div>

                                <div class="lc-plugin-description">
                                    ${escapeHTML(
                                        plugin.description
                                    )}
                                </div>
                            `;

                        const toggle =
                            create(
                                "label",
                                {
                                    className:
                                        "lc-toggle"
                                }
                            );

                        const input =
                            create(
                                "input"
                            );

                        input.type =
                            "checkbox";

                        input.checked =
                            pluginEnabled(
                                plugin.id
                            );

                        const track =
                            create(
                                "span",
                                {
                                    className:
                                        "lc-toggle-track"
                                }
                            );

                        input.addEventListener(
                            "change",
                            () => {

                                setPlugin(
                                    plugin.id,
                                    input.checked
                                );

                                rebuildFeatureCSS();

                                if (
                                    plugin.id ===
                                    "fakeNitro"
                                ) {
                                    refreshFakeNitro();
                                }

                                if (
                                    plugin.id ===
                                    "launcher"
                                ) {
                                    refreshLauncher();
                                }

                                notify(
                                    `${plugin.name} ${
                                        input.checked
                                            ? "enabled"
                                            : "disabled"
                                    }`
                                );
                            }
                        );

                        toggle.appendChild(
                            input
                        );

                        toggle.appendChild(
                            track
                        );

                        row.appendChild(
                            info
                        );

                        row.appendChild(
                            toggle
                        );

                        content.appendChild(
                            row
                        );
                    }
                );
            }
        );

        if (
            filtered.length ===
            0
        ) {
            content.appendChild(
                create(
                    "div",
                    {
                        text:
                            "No plugins found.",
                        style: {
                            padding:
                                "35px",
                            textAlign:
                                "center",
                            color:
                                "#9297a0"
                        }
                    }
                )
            );
        }
    }

    // =========================================================
    // THEMES
    // =========================================================

    function renderThemes(content) {
        content.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-title",
                    text:
                        "Themes"
                }
            )
        );

        content.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-sub",
                    text:
                        "Choose a LoraCord theme."
                }
            )
        );

        Object.entries(
            THEMES
        ).forEach(
            ([name, theme]) => {

                const card =
                    create(
                        "div",
                        {
                            className:
                                "lc-card"
                        }
                    );

                const preview =
                    create(
                        "div",
                        {
                            className:
                                "lc-theme-preview"
                        }
                    );

                preview.style.background =
                    `linear-gradient(
                        135deg,
                        ${theme.accent},
                        ${theme.accent2}
                    )`;

                card.appendChild(
                    preview
                );

                card.appendChild(
                    create(
                        "div",
                        {
                            className:
                                "lc-card-title",
                            text:
                                name
                        }
                    )
                );

                card.appendChild(
                    makeButton(
                        "Apply",
                        () =>
                            applyTheme(
                                name
                            )
                    )
                );

                content.appendChild(
                    card
                );
            }
        );
    }

    // =========================================================
    // QUICK REPLIES
    // =========================================================

    function getReplies() {
        return getSetting(
            "replies",
            [
                {
                    name:
                        "Welcome",
                    text:
                        "Welcome! Glad to have you here."
                },
                {
                    name:
                        "Rules",
                    text:
                        "📜 Please review the server rules."
                },
                {
                    name:
                        "Resolved",
                    text:
                        "✅ This issue has been resolved."
                }
            ]
        );
    }

    function insertText(text) {
        const composer =
            getComposer();

        if (!composer) {
            notify(
                "Open a Discord text channel first."
            );
            return;
        }

        composer.focus();

        try {
            document.execCommand(
                "insertText",
                false,
                text
            );

            notify(
                "Message inserted."
            );
        } catch {
            notify(
                "Unable to insert message."
            );
        }
    }

    function getComposer() {
        return (
            document.querySelector(
                '[role="textbox"]'
            ) ||
            document.querySelector(
                '[contenteditable="true"]'
            )
        );
    }

    function renderQuickReplies(
        content
    ) {
        content.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-title",
                    text:
                        "Quick Replies"
                }
            )
        );

        content.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-sub",
                    text:
                        "Save reusable messages."
                }
            )
        );

        const name =
            create(
                "input",
                {
                    className:
                        "lc-input"
                }
            );

        name.placeholder =
            "Reply name";

        const message =
            create(
                "textarea",
                {
                    className:
                        "lc-textarea"
                }
            );

        message.placeholder =
            "Message";

        message.style.minHeight =
            "90px";

        const editor =
            create(
                "div",
                {
                    className:
                        "lc-card"
                }
            );

        editor.appendChild(
            name
        );

        editor.appendChild(
            message
        );

        editor.appendChild(
            makeButton(
                "Save Reply",
                () => {

                    if (
                        !name.value.trim() ||
                        !message.value.trim()
                    ) {
                        notify(
                            "Fill both fields."
                        );
                        return;
                    }

                    const replies =
                        getReplies();

                    replies.push({
                        name:
                            name.value.trim(),
                        text:
                            message.value.trim()
                    });

                    setSetting(
                        "replies",
                        replies
                    );

                    renderQuickReplies(
                        content
                    );

                    notify(
                        "Reply saved."
                    );
                }
            )
        );

        content.appendChild(
            editor
        );

        getReplies().forEach(
            (reply, index) => {

                const card =
                    create(
                        "div",
                        {
                            className:
                                "lc-card"
                        }
                    );

                card.appendChild(
                    create(
                        "div",
                        {
                            className:
                                "lc-card-title",
                            text:
                                reply.name
                        }
                    )
                );

                card.appendChild(
                    create(
                        "div",
                        {
                            className:
                                "lc-description",
                            text:
                                reply.text
                        }
                    )
                );

                card.appendChild(
                    makeButton(
                        "Insert",
                        () =>
                            insertText(
                                reply.text
                            )
                    )
                );

                card.appendChild(
                    makeButton(
                        "Copy",
                        () =>
                            navigator.clipboard?.writeText(
                                reply.text
                            )
                    )
                );

                card.appendChild(
                    makeButton(
                        "Delete",
                        () => {

                            const replies =
                                getReplies();

                            replies.splice(
                                index,
                                1
                            );

                            setSetting(
                                "replies",
                                replies
                            );

                            renderQuickReplies(
                                content
                            );
                        }
                    )
                );

                content.appendChild(
                    card
                );
            }
        );
    }

    // =========================================================
    // TOOLS
    // =========================================================

    function renderTools(content) {
        content.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-title",
                    text:
                        "Toolbox"
                }
            )
        );

        const timestamp =
            create(
                "div",
                {
                    className:
                        "lc-card"
                }
            );

        timestamp.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-card-title",
                    text:
                        "Discord Timestamp"
                }
            )
        );

        timestamp.appendChild(
            makeButton(
                "Generate & Copy",
                () => {

                    const unix =
                        Math.floor(
                            Date.now() /
                            1000
                        );

                    navigator.clipboard?.writeText(
                        `<t:${unix}:F>`
                    );

                    notify(
                        "Timestamp copied."
                    );
                }
            )
        );

        content.appendChild(
            timestamp
        );

        const url =
            create(
                "div",
                {
                    className:
                        "lc-card"
                }
            );

        url.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-card-title",
                    text:
                        "Current Channel"
                }
            )
        );

        url.appendChild(
            makeButton(
                "Copy Current URL",
                () => {

                    navigator.clipboard?.writeText(
                        location.href
                    );

                    notify(
                        "URL copied."
                    );
                }
            )
        );

        content.appendChild(
            url
        );
    }

    // =========================================================
    // QUICK CSS
    // =========================================================

    function renderCSS(content) {
        content.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-title",
                    text:
                        "Quick CSS"
                }
            )
        );

        const editor =
            create(
                "textarea",
                {
                    className:
                        "lc-textarea"
                }
            );

        editor.value =
            getSetting(
                "customCSS",
                ""
            );

        editor.style.minHeight =
            "420px";

        content.appendChild(
            editor
        );

        content.appendChild(
            makeButton(
                "Apply CSS",
                () => {

                    let style =
                        document.getElementById(
                            IDS.customCSS
                        );

                    if (!style) {
                        style =
                            create(
                                "style",
                                {
                                    id:
                                        IDS.customCSS
                                }
                            );

                        document.head.appendChild(
                            style
                        );
                    }

                    style.textContent =
                        editor.value;

                    setSetting(
                        "customCSS",
                        editor.value
                    );

                    notify(
                        "CSS applied."
                    );
                }
            )
        );

        content.appendChild(
            makeButton(
                "Clear CSS",
                () => {

                    document
                        .getElementById(
                            IDS.customCSS
                        )
                        ?.remove();

                    setSetting(
                        "customCSS",
                        ""
                    );

                    editor.value =
                        "";

                    notify(
                        "CSS cleared."
                    );
                }
            )
        );
    }

    // =========================================================
    // WALLPAPER
    // =========================================================

    function renderWallpaper(
        content
    ) {
        content.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-title",
                    text:
                        "Wallpaper"
                }
            )
        );

        const input =
            create(
                "input",
                {
                    className:
                        "lc-input"
                }
            );

        input.placeholder =
            "Direct image URL";

        input.value =
            getSetting(
                "wallpaperURL",
                ""
            );

        content.appendChild(
            input
        );

        content.appendChild(
            makeButton(
                "Apply Wallpaper",
                () => {

                    let layer =
                        document.getElementById(
                            IDS.wallpaper
                        );

                    if (!layer) {

                        layer =
                            create(
                                "div",
                                {
                                    id:
                                        IDS.wallpaper
                                }
                            );

                        Object.assign(
                            layer.style,
                            {
                                position:
                                    "fixed",
                                inset:
                                    "0",
                                pointerEvents:
                                    "none",
                                zIndex:
                                    "0",
                                backgroundSize:
                                    "cover",
                                backgroundPosition:
                                    "center",
                                backgroundRepeat:
                                    "no-repeat",
                                opacity:
                                    "0.25"
                            }
                        );

                        document.body.appendChild(
                            layer
                        );
                    }

                    layer.style.backgroundImage =
                        `url("${input.value.replaceAll(
                            '"',
                            '\\"'
                        )}")`;

                    setSetting(
                        "wallpaperURL",
                        input.value
                    );

                    notify(
                        "Wallpaper applied."
                    );
                }
            )
        );

        content.appendChild(
            makeButton(
                "Remove Wallpaper",
                () => {

                    document
                        .getElementById(
                            IDS.wallpaper
                        )
                        ?.remove();

                    setSetting(
                        "wallpaperURL",
                        ""
                    );

                    input.value =
                        "";

                    notify(
                        "Wallpaper removed."
                    );
                }
            )
        );
    }

    // =========================================================
    // NOTES
    // =========================================================

    function renderNotes(
        content
    ) {
        content.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-title",
                    text:
                        "Notes"
                }
            )
        );

        const notes =
            create(
                "textarea",
                {
                    className:
                        "lc-textarea"
                }
            );

        notes.style.minHeight =
            "420px";

        notes.value =
            getSetting(
                "notes",
                ""
            );

        notes.addEventListener(
            "input",
            () => {
                setSetting(
                    "notes",
                    notes.value
                );
            }
        );

        content.appendChild(
            notes
        );

        content.appendChild(
            makeButton(
                "Copy Notes",
                () =>
                    navigator.clipboard?.writeText(
                        notes.value
                    )
            )
        );
    }

    // =========================================================
    // SETTINGS
    // =========================================================

    function renderSettings(
        content
    ) {
        content.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-title",
                    text:
                        "Settings"
                }
            )
        );

        const card =
            create(
                "div",
                {
                    className:
                        "lc-card"
                }
            );

        card.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-card-title",
                    text:
                        "Reset LoraCord"
                }
            )
        );

        card.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-description",
                    text:
                        "Deletes LoraCord settings stored in this browser."
                }
            )
        );

        card.appendChild(
            makeButton(
                "Reset Everything",
                () => {

                    const keys = [];

                    for (
                        let i = 0;
                        i < localStorage.length;
                        i++
                    ) {
                        const key =
                            localStorage.key(
                                i
                            );

                        if (
                            key &&
                            key.startsWith(
                                STORAGE
                            )
                        ) {
                            keys.push(
                                key
                            );
                        }
                    }

                    keys.forEach(
                        key =>
                            localStorage.removeItem(
                                key
                            )
                    );

                    location.reload();
                }
            )
        );

        content.appendChild(
            card
        );
    }

    // =========================================================
    // CHARACTER COUNTER
    // =========================================================

    function startCharacterCounter() {
        if (
            !pluginEnabled(
                "characterCounter"
            )
        ) {
            return;
        }

        const observer =
            new MutationObserver(
                () => {

                    const composer =
                        getComposer();

                    if (!composer) {
                        return;
                    }

                    const existing =
                        document.getElementById(
                            IDS.counter
                        );

                    if (
                        existing
                    ) {
                        return;
                    }

                    const parent =
                        composer.parentElement;

                    if (!parent) {
                        return;
                    }

                    if (
                        getComputedStyle(
                            parent
                        ).position ===
                        "static"
                    ) {
                        parent.style.position =
                            "relative";
                    }

                    const counter =
                        create(
                            "div",
                            {
                                id:
                                    IDS.counter,
                                text:
                                    "0"
                            }
                        );

                    Object.assign(
                        counter.style,
                        {
                            position:
                                "absolute",
                            right:
                                "10px",
                            bottom:
                                "5px",
                            color:
                                "#777d86",
                            fontSize:
                                "9px",
                            pointerEvents:
                                "none",
                            zIndex:
                                "10"
                        }
                    );

                    parent.appendChild(
                        counter
                    );

                    const update =
                        () => {

                            counter.textContent =
                                String(
                                    (
                                        composer.textContent ||
                                        ""
                                    ).length
                                );
                        };

                    composer.addEventListener(
                        "input",
                        update
                    );

                    update();
                }
            );

        observer.observe(
            document.body,
            {
                childList:
                    true,
                subtree:
                    true
            }
        );
    }

    // =========================================================
    // CUSTOM CSS RESTORE
    // =========================================================

    function restoreCSS() {
        const css =
            getSetting(
                "customCSS",
                ""
            );

        if (!css) {
            return;
        }

        const style =
            create(
                "style",
                {
                    id:
                        IDS.customCSS
                }
            );

        style.textContent =
            css;

        document.head.appendChild(
            style
        );
    }

    // =========================================================
    // WALLPAPER RESTORE
    // =========================================================

    function restoreWallpaper() {
        const url =
            getSetting(
                "wallpaperURL",
                ""
            );

        if (!url) {
            return;
        }

        const layer =
            create(
                "div",
                {
                    id:
                        IDS.wallpaper
                }
            );

        Object.assign(
            layer.style,
            {
                position:
                    "fixed",
                inset:
                    "0",
                pointerEvents:
                    "none",
                zIndex:
                    "0",
                backgroundImage:
                    `url("${url.replaceAll(
                        '"',
                        '\\"'
                    )}")`,
                backgroundSize:
                    "cover",
                backgroundPosition:
                    "center",
                backgroundRepeat:
                    "no-repeat",
                opacity:
                    "0.25"
            }
        );

        document.body.appendChild(
            layer
        );
    }

    // =========================================================
    // KEYBOARD SHORTCUT
    // =========================================================

    function installShortcut() {
        document.addEventListener(
            "keydown",
            event => {

                if (
                    !pluginEnabled(
                        "shortcut"
                    )
                ) {
                    return;
                }

                if (
                    event.ctrlKey &&
                    event.shiftKey &&
                    event.key.toLowerCase() ===
                        "l"
                ) {

                    event.preventDefault();
                    openPanel();
                }

                if (
                    event.key ===
                    "Escape"
                ) {

                    document
                        .getElementById(
                            IDS.panel
                        )
                        ?.classList.remove(
                            "open"
                        );
                }
            }
        );
    }

    // =========================================================
    // WATCHDOG
    // =========================================================

    function startWatchdog() {
        setInterval(
            () => {

                if (!document.body) {
                    return;
                }

                if (
                    pluginEnabled(
                        "launcher"
                    ) &&
                    !document.getElementById(
                        IDS.launcher
                    )
                ) {
                    refreshLauncher();
                }

                if (
                    !document.getElementById(
                        IDS.panel
                    )
                ) {
                    createPanel();
                }

            },
            2000
        );
    }

    // =========================================================
    // START
    // =========================================================

    function start() {
        if (!document.body) {
            setTimeout(
                start,
                500
            );
            return;
        }

        injectBaseCSS();

        const savedTheme =
            getSetting(
                "theme",
                "LoraCord"
            );

        if (
            THEMES[savedTheme]
        ) {
            applyTheme(
                savedTheme
            );
        }

        restoreCSS();
        restoreWallpaper();

        rebuildFeatureCSS();

        createPanel();
        refreshLauncher();

        if (
            pluginEnabled(
                "fakeNitro"
            )
        ) {
            refreshFakeNitro();
        }

        if (
            pluginEnabled(
                "characterCounter"
            )
        ) {
            startCharacterCounter();
        }

        installShortcut();
        startWatchdog();
    }

    start();

})();
