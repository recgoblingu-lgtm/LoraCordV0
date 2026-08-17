// ==UserScript==
// @name         LoraCord
// @namespace    https://loracord.local/
// @version      11.0.0
// @description  LoraCord 11 - Discord customization dashboard
// @author       LoraCord
// @match        https://discord.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // =========================================================
    // LORACORD 11
    // =========================================================

    const VERSION = "11.0.0";
    const STORE = "loracord11_";

    // Remove only our previous 11.x root.
    document.getElementById("loracord11-root")?.remove();

    // =========================================================
    // STORAGE
    // =========================================================

    function get(key, fallback) {
        try {
            const value = localStorage.getItem(STORE + key);
            return value === null ? fallback : JSON.parse(value);
        } catch {
            return fallback;
        }
    }

    function set(key, value) {
        try {
            localStorage.setItem(STORE + key, JSON.stringify(value));
        } catch {}
    }

    function remove(key) {
        try {
            localStorage.removeItem(STORE + key);
        } catch {}
    }

    // =========================================================
    // THEMES
    // =========================================================

    const THEMES = {
        LoraCord: {
            primary: "#5865f2",
            secondary: "#8b5cf6",
            background: "#10131c"
        },

        RecRoom: {
            primary: "#00c8ff",
            secondary: "#765cff",
            background: "#07121c"
        },

        Aurora: {
            primary: "#00e5ff",
            secondary: "#a05cff",
            background: "#071217"
        },

        Crimson: {
            primary: "#ff4f6d",
            secondary: "#ff9848",
            background: "#17080b"
        },

        Emerald: {
            primary: "#25dd88",
            secondary: "#00bca0",
            background: "#06120d"
        },

        Ocean: {
            primary: "#31b8ff",
            secondary: "#526fff",
            background: "#06121c"
        },

        PurpleVoid: {
            primary: "#a76bff",
            secondary: "#ff4fd8",
            background: "#130719"
        },

        Nitro: {
            primary: "#ff73fa",
            secondary: "#9b6cff",
            background: "#16091b"
        },

        Monochrome: {
            primary: "#f2f3f5",
            secondary: "#72767d",
            background: "#111214"
        }
    };

    // =========================================================
    // PLUGINS
    // =========================================================

    const PLUGINS = [
        ["quickReplies", "Quick Replies", "Tools", "Reusable Discord messages.", true],
        ["timestamps", "Timestamp Generator", "Tools", "Create Discord timestamps.", true],
        ["counter", "Character Counter", "Tools", "Count characters in the composer.", true],
        ["textCounter", "Text Counter", "Tools", "Count words, lines and characters.", true],
        ["notes", "Local Notes", "Tools", "Browser-local notes.", true],
        ["json", "JSON Formatter", "Tools", "Format JSON locally.", true],
        ["colorPicker", "Color Picker", "Tools", "Pick and copy colors.", true],
        ["markdown", "Markdown Helper", "Tools", "Discord Markdown shortcuts.", true],
        ["copyURL", "Copy Channel URL", "Tools", "Copy the current URL.", true],
        ["backup", "Settings Backup", "Tools", "Export LoraCord settings.", true],
        ["restore", "Settings Restore", "Tools", "Restore LoraCord settings.", true],
        ["palette", "Command Palette", "Tools", "Search LoraCord commands.", true],

        ["glass", "Glass UI", "Appearance", "Glass effect.", true],
        ["glow", "Glow Effects", "Appearance", "LoraCord glow effects.", true],
        ["rounded", "Rounded UI", "Appearance", "Rounded interface.", true],
        ["smooth", "Smooth Animations", "Appearance", "Smooth transitions.", true],
        ["compact", "Compact Mode", "Appearance", "Compact dashboard mode.", true],
        ["highContrast", "High Contrast", "Appearance", "Higher contrast.", true],
        ["reducedMotion", "Reduced Motion", "Appearance", "Reduce animations.", true],
        ["rainbow", "Rainbow Accent", "Appearance", "Animated rainbow accents.", true],

        ["quickCSS", "Quick CSS", "Customization", "Apply browser-local CSS.", true],
        ["wallpaper", "Wallpaper", "Customization", "Custom Discord background.", true],
        ["themeEditor", "Theme Editor", "Customization", "Create custom themes.", true],
        ["launcherIcon", "Launcher Icon", "Customization", "Change the LoraCord icon.", true],

        ["messageHover", "Message Hover", "Discord UI", "Highlight hovered messages.", false],
        ["messageGlow", "Message Glow", "Discord UI", "Glow hovered messages.", false],
        ["messageBorders", "Message Borders", "Discord UI", "Add message separators.", false],
        ["messageSpacing", "Message Spacing", "Discord UI", "Add spacing between messages.", false],
        ["linkGlow", "Link Glow", "Discord UI", "Highlight links.", false],
        ["codeGlow", "Code Glow", "Discord UI", "Glow code blocks.", false],
        ["mentionGlow", "Mention Glow", "Discord UI", "Highlight mentions.", false],
        ["channelGlow", "Channel Glow", "Discord UI", "Highlight channels.", false],
        ["selectedChannel", "Selected Channel", "Discord UI", "Highlight selected channels.", false],
        ["channelSpacing", "Channel Spacing", "Discord UI", "Add channel spacing.", false],
        ["serverGlow", "Server Glow", "Discord UI", "Glow server icons.", false],
        ["serverHover", "Server Hover", "Discord UI", "Animate server hover.", false],
        ["hideMembers", "Hide Member List", "Discord UI", "Hide the member list.", false],
        ["hideEmoji", "Hide Emoji Button", "Discord UI", "Hide emoji controls.", false],
        ["hideSticker", "Hide Sticker Button", "Discord UI", "Hide sticker controls.", false],
        ["hideGift", "Hide Gift Button", "Discord UI", "Hide gift controls.", false],
        ["largeComposer", "Larger Composer", "Discord UI", "Increase composer height.", false],
        ["composerGlow", "Composer Glow", "Discord UI", "Glow the composer.", false],

        ["recRoom", "Rec Room Theme", "Themes", "Rec Room preset.", true],
        ["aurora", "Aurora Theme", "Themes", "Aurora preset.", true],
        ["crimson", "Crimson Theme", "Themes", "Crimson preset.", true],
        ["emerald", "Emerald Theme", "Themes", "Emerald preset.", true],
        ["ocean", "Ocean Theme", "Themes", "Ocean preset.", true],
        ["purpleVoid", "Purple Void", "Themes", "Purple preset.", true],
        ["nitroTheme", "Nitro Theme", "Themes", "Nitro-inspired preset.", true],

        ["fakeNitro", "FakeNitro", "Cosmetic", "Cosmetic Nitro visuals only.", true],
        ["fakeBoost", "FakeBoost", "Cosmetic", "Cosmetic boost visuals only.", true],
        ["customBadge", "Custom Badge", "Cosmetic", "Local badge.", true],

        ["favorites", "Favorites", "Advanced", "Favorite plugins.", true],
        ["history", "Plugin History", "Advanced", "Remember changes.", true],
        ["themeHistory", "Theme History", "Advanced", "Remember themes.", true],
        ["performance", "Performance Mode", "Advanced", "Reduce visual effects.", true],
        ["dashboardClock", "Dashboard Clock", "Advanced", "Show current time.", true],
        ["dashboardDate", "Dashboard Date", "Advanced", "Show current date.", true],
        ["diagnostics", "Diagnostics", "Advanced", "Runtime checks.", true],
        ["stats", "Plugin Stats", "Advanced", "Plugin statistics.", true]
    ].map(x => ({
        id: x[0],
        name: x[1],
        category: x[2],
        description: x[3],
        reliable: x[4]
    }));

    const DEFAULTS = {};

    PLUGINS.forEach(plugin => {
        DEFAULTS[plugin.id] = false;
    });

    Object.assign(DEFAULTS, {
        quickReplies: true,
        timestamps: true,
        counter: true,
        textCounter: true,
        notes: true,
        json: true,
        colorPicker: true,
        markdown: true,
        copyURL: true,
        backup: true,
        restore: true,
        palette: true,

        glass: true,
        glow: true,
        rounded: true,
        smooth: true,

        quickCSS: true,
        wallpaper: true,
        themeEditor: true,
        launcherIcon: true,

        launcher: true,
        favorites: true,
        history: true,
        themeHistory: true,
        dashboardClock: true,
        dashboardDate: true,
        diagnostics: true,
        stats: true,

        fakeNitro: false
    });

    function pluginEnabled(id) {
        return get("plugin_" + id, DEFAULTS[id] ?? false);
    }

    function setPlugin(id, value) {
        set("plugin_" + id, Boolean(value));
    }

    // =========================================================
    // ROOT
    // =========================================================

    const root = document.createElement("div");

    root.id = "loracord11-root";

    Object.assign(root.style, {
        position: "fixed",
        left: "0",
        top: "0",
        width: "100vw",
        height: "100vh",
        zIndex: "2147483647",
        pointerEvents: "none"
    });

    document.body.appendChild(root);

    // =========================================================
    // SHADOW DOM
    // =========================================================

    const shadow = root.attachShadow
        ? root.attachShadow({ mode: "open" })
        : root;

    // =========================================================
    // HELPERS
    // =========================================================

    function el(tag, options = {}) {
        const node = document.createElement(tag);

        if (options.id) {
            node.id = options.id;
        }

        if (options.className) {
            node.className = options.className;
        }

        if (options.text !== undefined) {
            node.textContent = options.text;
        }

        return node;
    }

    function qs(selector) {
        return shadow.querySelector(selector);
    }

    function qsa(selector) {
        return Array.from(
            shadow.querySelectorAll(selector)
        );
    }

    function button(text, callback, className = "lcButton") {
        const node = el("button", {
            className,
            text
        });

        node.type = "button";

        node.addEventListener(
            "click",
            event => {
                event.preventDefault();
                event.stopPropagation();

                try {
                    callback();
                } catch (error) {
                    console.error("[LoraCord]", error);
                    notify("LoraCord error: " + error.message);
                }
            },
            true
        );

        return node;
    }

    // =========================================================
    // CSS
    // =========================================================

    const style = el("style");

    style.textContent = `
        :host {
            --primary: #5865f2;
            --secondary: #8b5cf6;
            font-family: Arial, sans-serif;
        }

        * {
            box-sizing: border-box;
        }

        button,
        input,
        textarea {
            font-family: Arial, sans-serif;
        }

        #launcher {
            position: fixed;
            right: 18px;
            bottom: 18px;

            width: 54px;
            height: 54px;

            display: grid;
            place-items: center;

            border: 0;
            border-radius: 16px;

            background:
                linear-gradient(
                    135deg,
                    var(--primary),
                    var(--secondary)
                );

            color: white;

            font-size: 22px;
            font-weight: 900;

            cursor: pointer;
            pointer-events: auto;

            box-shadow:
                0 12px 35px
                rgba(0,0,0,.45);

            transition:
                .18s ease;
        }

        #launcher:hover {
            transform:
                translateY(-2px)
                scale(1.04);

            box-shadow:
                0 16px 45px
                rgba(0,0,0,.55);
        }

        #launcher.nitro {
            background:
                linear-gradient(
                    135deg,
                    #ff73fa,
                    #9b6cff,
                    #5865f2,
                    #ff73fa
                );

            background-size:
                300% 300%;

            animation:
                nitro 4s ease infinite;
        }

        @keyframes nitro {
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

        @keyframes rainbow {
            0% {
                filter:
                    hue-rotate(0deg);
            }

            100% {
                filter:
                    hue-rotate(360deg);
            }
        }

        #launcher.rainbow,
        #panel.rainbow {
            animation:
                rainbow 6s linear infinite;
        }

        #panel {
            position: fixed;

            left: 50%;
            top: 50%;

            width:
                min(
                    1080px,
                    calc(100vw - 24px)
                );

            height:
                min(
                    720px,
                    calc(100vh - 24px)
                );

            transform:
                translate(
                    -50%,
                    -50%
                );

            display: none;

            overflow: hidden;

            background:
                #111214;

            color:
                #ffffff;

            border:
                1px solid
                rgba(255,255,255,.08);

            border-radius:
                18px;

            box-shadow:
                0 30px 100px
                rgba(0,0,0,.75);

            pointer-events:
                auto;
        }

        #panel.open {
            display: flex;
        }

        #panel.nitro {
            border-color:
                rgba(255,115,250,.35);

            box-shadow:
                0 0 70px
                rgba(255,115,250,.12),
                0 30px 100px
                rgba(0,0,0,.75);
        }

        #sidebar {
            width: 225px;
            min-width: 225px;

            display: flex;
            flex-direction: column;

            background:
                #0d0e10;

            border-right:
                1px solid
                rgba(255,255,255,.06);
        }

        #brand {
            padding: 17px;

            border-bottom:
                1px solid
                rgba(255,255,255,.06);
        }

        .brandRow {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logo {
            width: 38px;
            height: 38px;

            display: grid;
            place-items: center;

            border-radius: 11px;

            background:
                linear-gradient(
                    135deg,
                    var(--primary),
                    var(--secondary)
                );

            color: white;
            font-weight: 900;
            font-size: 17px;
        }

        .brandName {
            font-size: 15px;
            font-weight: 900;
        }

        .brandVersion {
            margin-top: 2px;
            color: #777d86;
            font-size: 9px;
        }

        #search {
            margin: 10px;
            width: calc(100% - 20px);

            padding: 10px;

            border:
                1px solid
                rgba(255,255,255,.08);

            border-radius: 8px;

            background:
                #08090b;

            color: white;

            outline: none;
        }

        #navigation {
            flex: 1;
            overflow-y: auto;
            padding: 0 9px 10px;
        }

        .section {
            padding:
                12px 8px 5px;

            color:
                #6c727b;

            font-size: 9px;
            font-weight: 900;

            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .nav {
            width: 100%;

            padding: 9px;

            margin-bottom: 3px;

            border: 0;
            border-radius: 8px;

            background:
                transparent;

            color:
                #a5a8ae;

            cursor: pointer;

            text-align: left;

            font-size: 11px;
            font-weight: 700;
        }

        .nav:hover,
        .nav.active {
            background:
                rgba(88,101,242,.17);

            color: white;
        }

        #footer {
            padding:
                10px;

            border-top:
                1px solid
                rgba(255,255,255,.06);

            color:
                #777d86;

            font-size:
                9px;
        }

        #main {
            flex: 1;
            min-width: 0;

            display: flex;
            flex-direction: column;
        }

        #top {
            height: 58px;
            min-height: 58px;

            padding: 0 15px;

            display: flex;
            align-items: center;
            justify-content: space-between;

            border-bottom:
                1px solid
                rgba(255,255,255,.06);
        }

        #title {
            font-size: 14px;
            font-weight: 900;
        }

        .topActions {
            display: flex;
            gap: 5px;
        }

        .topButton {
            width: 32px;
            height: 32px;

            border: 0;
            border-radius: 8px;

            background:
                rgba(255,255,255,.05);

            color: white;

            cursor: pointer;
        }

        #content {
            flex: 1;
            overflow-y: auto;
            padding: 18px;
        }

        .pageTitle {
            font-size: 24px;
            font-weight: 900;
            margin-bottom: 4px;
        }

        .subtitle {
            color: #9297a0;
            font-size: 11px;
            margin-bottom: 17px;
        }

        .card {
            padding: 14px;
            margin-bottom: 11px;

            border:
                1px solid
                rgba(255,255,255,.06);

            border-radius:
                12px;

            background:
                rgba(255,255,255,.03);
        }

        .cardTitle {
            font-size: 13px;
            font-weight: 800;
            margin-bottom: 6px;
        }

        .desc {
            color: #9297a0;
            font-size: 10px;
            line-height: 1.5;
            margin-bottom: 9px;
        }

        .lcButton {
            width: 100%;

            padding: 10px;
            margin-top: 6px;

            border:
                1px solid
                rgba(255,255,255,.07);

            border-radius:
                8px;

            background:
                rgba(255,255,255,.045);

            color:
                white;

            cursor:
                pointer;

            text-align:
                left;

            font-size:
                11px;

            font-weight:
                700;
        }

        .lcButton:hover {
            background:
                rgba(88,101,242,.16);
        }

        .input,
        .pluginSearch {
            width: 100%;

            padding: 10px;

            border:
                1px solid
                rgba(255,255,255,.08);

            border-radius: 8px;

            background:
                #08090b;

            color: white;

            outline: none;
        }

        .textarea {
            width: 100%;
            min-height: 230px;

            padding: 10px;

            border:
                1px solid
                rgba(255,255,255,.08);

            border-radius: 8px;

            background:
                #08090b;

            color: white;

            outline: none;

            resize:
                vertical;

            font:
                12px monospace;
        }

        .filters {
            display: flex;
            flex-wrap: wrap;

            gap: 6px;

            margin:
                10px 0 14px;
        }

        .filter {
            padding:
                7px 10px;

            border: 0;
            border-radius: 7px;

            background:
                #2b2d31;

            color:
                white;

            cursor:
                pointer;

            font-size:
                10px;

            font-weight:
                700;
        }

        .filter.active {
            background:
                var(--primary);
        }

        .pluginCategory {
            margin:
                17px 0 6px;

            color:
                #727780;

            font-size:
                9px;

            font-weight:
                900;

            text-transform:
                uppercase;

            letter-spacing:
                1px;
        }

        .plugin {
            display: flex;
            align-items: center;
            justify-content: space-between;

            gap: 10px;

            padding:
                11px 0;

            border-bottom:
                1px solid
                rgba(255,255,255,.045);
        }

        .pluginName {
            font-size: 12px;
            font-weight: 800;
        }

        .pluginDesc {
            color:
                #9297a0;

            font-size:
                10px;

            line-height:
                1.4;

            margin-top:
                3px;
        }

        .metaGood {
            margin-top: 4px;
            color: #23a55a;
            font-size: 9px;
        }

        .metaDOM {
            margin-top: 4px;
            color: #f0b232;
            font-size: 9px;
        }

        .pluginControls {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .mini {
            padding:
                6px 8px;

            border: 0;
            border-radius: 7px;

            background:
                #2b2d31;

            color:
                white;

            cursor:
                pointer;

            font-size:
                10px;
        }

        .toggle {
            position: relative;
            width: 40px;
            height: 22px;
            flex: 0 0 40px;
        }

        .toggle input {
            display: none;
        }

        .track {
            position:
                absolute;

            inset:
                0;

            background:
                #3a3d44;

            border-radius:
                20px;

            cursor:
                pointer;
        }

        .track::before {
            content: "";

            position:
                absolute;

            width:
                16px;

            height:
                16px;

            left:
                3px;

            top:
                3px;

            border-radius:
                50%;

            background:
                white;

            transition:
                transform .16s ease;
        }

        .toggle input:checked + .track {
            background:
                var(--primary);
        }

        .toggle input:checked + .track::before {
            transform:
                translateX(18px);
        }

        .stats {
            display: grid;

            grid-template-columns:
                repeat(4,minmax(0,1fr));

            gap:
                10px;
        }

        .stat {
            padding:
                13px;

            border:
                1px solid
                rgba(255,255,255,.06);

            border-radius:
                10px;

            background:
                rgba(255,255,255,.025);
        }

        .number {
            font-size:
                22px;

            font-weight:
                900;
        }

        .label {
            margin-top:
                2px;

            color:
                #777d86;

            font-size:
                9px;
        }

        .chip {
            display:
                inline-block;

            margin:
                3px;

            padding:
                4px 7px;

            border-radius:
                20px;

            background:
                rgba(88,101,242,.12);

            color:
                #bec3ff;

            font-size:
                9px;
        }

        .themePreview {
            height:
                65px;

            margin-bottom:
                9px;

            border-radius:
                9px;
        }

        .command {
            display:
                flex;

            align-items:
                center;

            justify-content:
                space-between;

            gap:
                10px;

            padding:
                10px 0;

            border-bottom:
                1px solid
                rgba(255,255,255,.04);
        }

        .commandName {
            font-size:
                11px;

            font-weight:
                800;
        }

        .commandDesc {
            color:
                #858b94;

            font-size:
                9px;

            margin-top:
                2px;
        }

        .modalBackdrop {
            position:
                fixed;

            inset:
                0;

            display:
                grid;

            place-items:
                center;

            background:
                rgba(0,0,0,.62);

            z-index:
                99999;
        }

        .modal {
            width:
                min(
                    560px,
                    calc(100vw - 30px)
                );

            padding:
                20px;

            background:
                #18191c;

            border:
                1px solid
                rgba(255,255,255,.08);

            border-radius:
                14px;

            box-shadow:
                0 25px 80px
                rgba(0,0,0,.7);
        }

        @media(max-width:720px) {
            #sidebar {
                width: 62px;
                min-width: 62px;
            }

            .brandName,
            .brandVersion,
            .section {
                display: none;
            }

            .nav {
                text-align: center;
            }

            .stats {
                grid-template-columns:
                    repeat(2,minmax(0,1fr));
            }
        }
    `;

    shadow.appendChild(style);

    // =========================================================
    // PANEL
    // =========================================================

    const panel = el("div", {
        id: "panel"
    });

    // Build panel with DOM instead of giant innerHTML.
    // This avoids rendering failures from malformed markup.

    const sidebar = el("div", {
        id: "sidebar"
    });

    const brand = el("div", {
        id: "brand"
    });

    const brandRow = el("div", {
        className: "brandRow"
    });

    const logo = el("div", {
        className: "logo",
        text: "L"
    });

    const brandText = el("div");

    brandText.appendChild(
        el("div", {
            className: "brandName",
            text: "LoraCord"
        })
    );

    brandText.appendChild(
        el("div", {
            className: "brandVersion",
            text: "v" + VERSION
        })
    );

    brandRow.appendChild(logo);
    brandRow.appendChild(brandText);
    brand.appendChild(brandRow);

    sidebar.appendChild(brand);

    const search = el("input", {
        id: "search"
    });

    search.placeholder =
        "Search plugins...";

    sidebar.appendChild(search);

    const navigation = el("div", {
        id: "navigation"
    });

    function addSection(title) {
        navigation.appendChild(
            el("div", {
                className: "section",
                text: title
            })
        );
    }

    function addNav(page, text) {
        const node = el("button", {
            className: "nav",
            text
        });

        node.type = "button";
        node.dataset.page = page;

        navigation.appendChild(node);

        return node;
    }

    addSection("General");

    addNav("home", "⌂ Home");
    addNav("plugins", "🧩 Plugins");
    addNav("themes", "🎨 Themes");

    addSection("Tools");

    addNav("quick", "⚡ Quick Replies");
    addNav("toolbox", "🧰 Toolbox");
    addNav("palette", "⌘ Command Palette");
    addNav("css", "⌘ Quick CSS");
    addNav("wallpaper", "🖼 Wallpaper");
    addNav("notes", "📝 Notes");

    addSection("Advanced");

    addNav("editor", "🎛 Theme Editor");
    addNav("stats", "📊 Plugin Stats");
    addNav("diagnostics", "🩺 Diagnostics");
    addNav("backup", "⇄ Backup / Restore");

    addSection("System");

    addNav("settings", "⚙ Settings");

    sidebar.appendChild(navigation);

    sidebar.appendChild(
        el("div", {
            id: "footer",
            text: "LoraCord " + VERSION
        })
    );

    panel.appendChild(sidebar);

    // =========================================================
    // MAIN
    // =========================================================

    const main = el("div", {
        id: "main"
    });

    const top = el("div", {
        id: "top"
    });

    const title = el("div", {
        id: "title",
        text: "Home"
    });

    const topActions = el("div", {
        className: "topActions"
    });

    const refresh = el("button", {
        className: "topButton",
        text: "↻"
    });

    refresh.type = "button";

    const close = el("button", {
        className: "topButton",
        text: "×"
    });

    close.type = "button";

    topActions.appendChild(refresh);
    topActions.appendChild(close);

    top.appendChild(title);
    top.appendChild(topActions);

    main.appendChild(top);

    const content = el("div", {
        id: "content"
    });

    main.appendChild(content);

    panel.appendChild(main);

    shadow.appendChild(panel);

    // =========================================================
    // LAUNCHER
    // =========================================================

    const launcher = el("button", {
        id: "launcher",
        text: get(
            "launcherIcon",
            "✦"
        )
    });

    launcher.type = "button";

    shadow.appendChild(launcher);

    launcher.addEventListener(
        "click",
        openPanel
    );

    // =========================================================
    // VARIABLES
    // =========================================================

    function updateThemeVariables() {
        const themeName = get(
            "theme",
            "LoraCord"
        );

        const theme =
            THEMES[themeName];

        let primary =
            theme?.primary ||
            get(
                "customPrimary",
                "#5865f2"
            );

        let secondary =
            theme?.secondary ||
            get(
                "customSecondary",
                "#8b5cf6"
            );

        root.style.setProperty(
            "--primary",
            primary
        );

        root.style.setProperty(
            "--secondary",
            secondary
        );

        logo.style.background =
            `linear-gradient(
                135deg,
                ${primary},
                ${secondary}
            )`;
    }

    // =========================================================
    // OPEN/CLOSE
    // =========================================================

    function openPanel() {
        panel.classList.add("open");
    }

    function closePanel() {
        panel.classList.remove("open");
    }

    function openPage(page) {
        const nav =
            navigation.querySelector(
                `[data-page="${page}"]`
            );

        if (!nav) {
            return;
        }

        nav.click();
    }

    // =========================================================
    // NAVIGATION
    // =========================================================

    navigation.addEventListener(
        "click",
        event => {
            const nav =
                event.target.closest(
                    ".nav"
                );

            if (!nav) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            qsa(".nav").forEach(
                node =>
                    node.classList.remove(
                        "active"
                    )
            );

            nav.classList.add(
                "active"
            );

            const page =
                nav.dataset.page;

            title.textContent =
                nav.textContent.trim();

            renderPage(
                page
            );
        },
        true
    );

    close.onclick =
        closePanel;

    refresh.onclick =
        () => location.reload();

    // =========================================================
    // GLOBAL SEARCH
    // =========================================================

    search.addEventListener(
        "input",
        () => {
            const value =
                search.value
                    .trim();

            if (!value) {
                return;
            }

            openPage(
                "plugins"
            );

            setTimeout(
                () => {
                    const input =
                        shadow.querySelector(
                            "#pluginSearch"
                        );

                    if (!input) {
                        return;
                    }

                    input.value =
                        value;

                    input.dispatchEvent(
                        new Event(
                            "input"
                        )
                    );
                },
                20
            );
        }
    );

    // =========================================================
    // PAGE HELPERS
    // =========================================================

    function pageHeader(
        titleText,
        subtitleText
    ) {
        content.appendChild(
            el("div", {
                className: "pageTitle",
                text: titleText
            })
        );

        content.appendChild(
            el("div", {
                className: "subtitle",
                text: subtitleText
            })
        );
    }

    function clearContent() {
        content.replaceChildren();
    }

    // =========================================================
    // HOME
    // =========================================================

    function renderHome() {
        clearContent();

        pageHeader(
            "LoraCord",
            "A reliable Discord customization dashboard."
        );

        const enabled =
            PLUGINS.filter(
                plugin =>
                    pluginEnabled(
                        plugin.id
                    )
            ).length;

        const stats =
            el("div", {
                className: "stats"
            });

        const statValues = [
            [
                PLUGINS.length,
                "Plugins"
            ],
            [
                enabled,
                "Enabled"
            ],
            [
                Object.keys(THEMES).length,
                "Themes"
            ],
            [
                VERSION,
                "Version"
            ]
        ];

        statValues.forEach(
            ([value, label]) => {
                const node =
                    el("div", {
                        className:
                            "stat"
                    });

                node.appendChild(
                    el("div", {
                        className:
                            "number",
                        text:
                            String(value)
                    })
                );

                node.appendChild(
                    el("div", {
                        className:
                            "label",
                        text:
                            label
                    })
                );

                stats.appendChild(
                    node
                );
            }
        );

        content.appendChild(
            stats
        );

        const actions =
            el("div", {
                className: "card"
            });

        actions.appendChild(
            el("div", {
                className: "cardTitle",
                text: "Quick Actions"
            })
        );

        actions.appendChild(
            button(
                "🧩 Open Plugins",
                () => openPage("plugins")
            )
        );

        actions.appendChild(
            button(
                "🎨 Rec Room Theme",
                () => applyTheme("RecRoom")
            )
        );

        actions.appendChild(
            button(
                "💎 Toggle FakeNitro",
                () => {
                    setPlugin(
                        "fakeNitro",
                        !pluginEnabled(
                            "fakeNitro"
                        )
                    );

                    applyPlugins();
                }
            )
        );

        actions.appendChild(
            button(
                "⌘ Command Palette",
                () => openPage("palette")
            )
        );

        actions.appendChild(
            button(
                "🩺 Diagnostics",
                () => openPage("diagnostics")
            )
        );

        content.appendChild(
            actions
        );

        if (
            pluginEnabled("dashboardClock") ||
            pluginEnabled("dashboardDate")
        ) {
            const card =
                el("div", {
                    className:
                        "card"
                });

            card.appendChild(
                el("div", {
                    className:
                        "cardTitle",
                    text:
                        "Dashboard Status"
                })
            );

            const status =
                el("div", {
                    className:
                        "desc"
                });

            card.appendChild(
                status
            );

            function updateClock() {
                const now =
                    new Date();

                const values = [];

                if (
                    pluginEnabled(
                        "dashboardClock"
                    )
                ) {
                    values.push(
                        now.toLocaleTimeString()
                    );
                }

                if (
                    pluginEnabled(
                        "dashboardDate"
                    )
                ) {
                    values.push(
                        now.toLocaleDateString()
                    );
                }

                status.textContent =
                    values.join(
                        " • "
                    );
            }

            updateClock();

            setInterval(
                updateClock,
                1000
            );

            content.appendChild(
                card
            );
        }
    }

    // =========================================================
    // PLUGINS
    // =========================================================

    let pluginQuery = "";
    let pluginFilter = "all";
    let pluginCategory = "All";
    let favoritesOnly = false;

    function renderPlugins() {
        clearContent();

        pageHeader(
            "Plugins",
            `${PLUGINS.length} available plugins.`
        );

        const input =
            el("input", {
                id:
                    "pluginSearch",
                className:
                    "pluginSearch"
            });

        input.placeholder =
            "Search plugins...";

        input.value =
            pluginQuery;

        input.addEventListener(
            "input",
            () => {
                pluginQuery =
                    input.value;

                renderPlugins();
            }
        );

        content.appendChild(
            input
        );

        const filters =
            el("div", {
                className:
                    "filters"
            });

        [
            ["all","All"],
            ["enabled","Enabled"],
            ["disabled","Disabled"]
        ].forEach(
            ([id,label]) => {
                const b =
                    el("button", {
                        className:
                            "filter" +
                            (
                                pluginFilter === id
                                    ? " active"
                                    : ""
                            ),
                        text:
                            label
                    });

                b.type =
                    "button";

                b.onclick =
                    () => {
                        pluginFilter =
                            id;

                        renderPlugins();
                    };

                filters.appendChild(
                    b
                );
            }
        );

        const categories = [
            "All",
            ...new Set(
                PLUGINS.map(
                    p => p.category
                )
            )
        ];

        categories.forEach(
            category => {
                const b =
                    el("button", {
                        className:
                            "filter" +
                            (
                                pluginCategory ===
                                category
                                    ? " active"
                                    : ""
                            ),
                        text:
                            category
                    });

                b.type =
                    "button";

                b.onclick =
                    () => {
                        pluginCategory =
                            category;

                        renderPlugins();
                    };

                filters.appendChild(
                    b
                );
            }
        );

        const favorite =
            el("button", {
                className:
                    "filter" +
                    (
                        favoritesOnly
                            ? " active"
                            : ""
                    ),
                text:
                    "★ Favorites"
            });

        favorite.onclick =
            () => {
                favoritesOnly =
                    !favoritesOnly;

                renderPlugins();
            };

        filters.appendChild(
            favorite
        );

        content.appendChild(
            filters
        );

        const query =
            pluginQuery
                .toLowerCase()
                .trim();

        const filtered =
            PLUGINS.filter(
                plugin => {
                    const textMatch =
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

                    const categoryMatch =
                        pluginCategory ===
                        "All" ||
                        plugin.category ===
                        pluginCategory;

                    const enabled =
                        pluginEnabled(
                            plugin.id
                        );

                    const stateMatch =
                        pluginFilter ===
                            "all" ||
                        (
                            pluginFilter ===
                            "enabled" &&
                            enabled
                        ) ||
                        (
                            pluginFilter ===
                            "disabled" &&
                            !enabled
                        );

                    const favorite =
                        get(
                            "favorite_" +
                            plugin.id,
                            false
                        );

                    const favoriteMatch =
                        !favoritesOnly ||
                        favorite;

                    return (
                        textMatch &&
                        categoryMatch &&
                        stateMatch &&
                        favoriteMatch
                    );
                }
            );

        const grouped = {};

        for (
            const plugin
            of filtered
        ) {
            if (
                !grouped[
                    plugin.category
                ]
            ) {
                grouped[
                    plugin.category
                ] = [];
            }

            grouped[
                plugin.category
            ].push(
                plugin
            );
        }

        for (
            const [
                category,
                plugins
            ]
            of Object.entries(
                grouped
            )
        ) {
            content.appendChild(
                el("div", {
                    className:
                        "pluginCategory",
                    text:
                        category
                })
            );

            for (
                const plugin
                of plugins
            ) {
                const row =
                    el("div", {
                        className:
                            "plugin"
                    });

                const info =
                    el("div");

                info.appendChild(
                    el("div", {
                        className:
                            "pluginName",
                        text:
                            plugin.name
                    })
                );

                info.appendChild(
                    el("div", {
                        className:
                            "pluginDesc",
                        text:
                            plugin.description
                    })
                );

                info.appendChild(
                    el("div", {
                        className:
                            plugin.reliable
                                ? "metaGood"
                                : "metaDOM",
                        text:
                            plugin.reliable
                                ? "Reliable browser feature"
                                : "Discord DOM dependent"
                    })
                );

                const controls =
                    el("div", {
                        className:
                            "pluginControls"
                    });

                const star =
                    el("button", {
                        className:
                            "mini",
                        text:
                            get(
                                "favorite_" +
                                plugin.id,
                                false
                            )
                                ? "★"
                                : "☆"
                    });

                star.onclick =
                    () => {
                        set(
                            "favorite_" +
                            plugin.id,
                            !get(
                                "favorite_" +
                                plugin.id,
                                false
                            )
                        );

                        renderPlugins();
                    };

                const infoButton =
                    el("button", {
                        className:
                            "mini",
                        text:
                            "Info"
                    });

                infoButton.onclick =
                    () =>
                        showPluginInfo(
                            plugin
                        );

                const toggle =
                    el("label", {
                        className:
                            "toggle"
                    });

                const checkbox =
                    document.createElement(
                        "input"
                    );

                checkbox.type =
                    "checkbox";

                checkbox.checked =
                    pluginEnabled(
                        plugin.id
                    );

                const track =
                    el("span", {
                        className:
                            "track"
                    });

                checkbox.onchange =
                    () => {
                        setPlugin(
                            plugin.id,
                            checkbox.checked
                        );

                        recordPluginHistory(
                            plugin,
                            checkbox.checked
                        );

                        applyPlugins();

                        notify(
                            plugin.name +
                            (
                                checkbox.checked
                                    ? " enabled."
                                    : " disabled."
                            )
                        );
                    };

                toggle.appendChild(
                    checkbox
                );

                toggle.appendChild(
                    track
                );

                controls.appendChild(
                    star
                );

                controls.appendChild(
                    infoButton
                );

                controls.appendChild(
                    toggle
                );

                row.appendChild(
                    info
                );

                row.appendChild(
                    controls
                );

                content.appendChild(
                    row
                );
            }
        }

        if (
            filtered.length === 0
        ) {
            content.appendChild(
                el("div", {
                    className:
                        "card",
                    text:
                        "No plugins found."
                })
            );
        }
    }

    function showPluginInfo(plugin) {
        const overlay =
            el("div", {
                className:
                    "modalBackdrop"
            });

        const modal =
            el("div", {
                className:
                    "modal"
            });

        modal.appendChild(
            el("div", {
                className:
                    "cardTitle",
                text:
                    plugin.name
            })
        );

        modal.appendChild(
            el("div", {
                className:
                    "desc",
                text:
                    plugin.description
            })
        );

        modal.appendChild(
            el("div", {
                className:
                    plugin.reliable
                        ? "metaGood"
                        : "metaDOM",
                text:
                    plugin.reliable
                        ? "Reliable browser-side plugin"
                        : "Discord DOM-dependent plugin"
            })
        );

        modal.appendChild(
            button(
                "Toggle",
                () => {
                    setPlugin(
                        plugin.id,
                        !pluginEnabled(
                            plugin.id
                        )
                    );

                    applyPlugins();

                    overlay.remove();

                    renderPlugins();
                }
            )
        );

        modal.appendChild(
            button(
                "Close",
                () =>
                    overlay.remove()
            )
        );

        overlay.addEventListener(
            "click",
            event => {
                if (
                    event.target ===
                    overlay
                ) {
                    overlay.remove();
                }
            }
        );

        shadow.appendChild(
            overlay
        );
    }

    // =========================================================
    // THEMES
    // =========================================================

    function applyTheme(name) {
        const theme =
            THEMES[name];

        if (!theme) {
            return;
        }

        set(
            "theme",
            name
        );

        set(
            "customPrimary",
            theme.primary
        );

        set(
            "customSecondary",
            theme.secondary
        );

        updateThemeVariables();
        updateLauncher();

        if (
            pluginEnabled(
                "themeHistory"
            )
        ) {
            const history =
                get(
                    "themeHistory",
                    []
                );

            history.unshift(
                name
            );

            set(
                "themeHistory",
                [
                    ...new Set(
                        history
                    )
                ].slice(
                    0,
                    10
                )
            );
        }

        notify(
            name +
            " applied."
        );
    }

    function renderThemes() {
        clearContent();

        pageHeader(
            "Themes",
            "Built-in LoraCord themes."
        );

        for (
            const [
                name,
                theme
            ]
            of Object.entries(
                THEMES
            )
        ) {
            const card =
                el("div", {
                    className:
                        "card"
                });

            const preview =
                el("div", {
                    className:
                        "themePreview"
                });

            preview.style.background =
                `linear-gradient(
                    135deg,
                    ${theme.primary},
                    ${theme.secondary}
                )`;

            card.appendChild(
                preview
            );

            card.appendChild(
                el("div", {
                    className:
                        "cardTitle",
                    text:
                        name
                })
            );

            card.appendChild(
                button(
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

        const custom =
            el("div", {
                className:
                    "card"
            });

        custom.appendChild(
            el("div", {
                className:
                    "cardTitle",
                text:
                    "Custom Theme"
            })
        );

        const primary =
            document.createElement(
                "input"
            );

        primary.type =
            "color";

        primary.value =
            get(
                "customPrimary",
                "#5865f2"
            );

        primary.style.width =
            "100%";

        primary.style.height =
            "40px";

        const secondary =
            document.createElement(
                "input"
            );

        secondary.type =
            "color";

        secondary.value =
            get(
                "customSecondary",
                "#8b5cf6"
            );

        secondary.style.width =
            "100%";

        secondary.style.height =
            "40px";

        secondary.style.marginTop =
            "8px";

        custom.appendChild(
            primary
        );

        custom.appendChild(
            secondary
        );

        custom.appendChild(
            button(
                "Save Custom",
                () => {
                    set(
                        "theme",
                        "Custom"
                    );

                    set(
                        "customPrimary",
                        primary.value
                    );

                    set(
                        "customSecondary",
                        secondary.value
                    );

                    updateThemeVariables();
                    updateLauncher();

                    notify(
                        "Custom theme saved."
                    );
                }
            )
        );

        content.appendChild(
            custom
        );
    }

    // =========================================================
    // QUICK REPLIES
    // =========================================================

    function renderQuickReplies() {
        clearContent();

        pageHeader(
            "Quick Replies",
            "Reusable Discord messages."
        );

        const card =
            el("div", {
                className:
                    "card"
            });

        const name =
            el("input", {
                className:
                    "input"
            });

        name.placeholder =
            "Reply name";

        const message =
            el("textarea", {
                className:
                    "textarea"
            });

        message.placeholder =
            "Message";

        message.style.minHeight =
            "100px";

        card.appendChild(
            name
        );

        card.appendChild(
            message
        );

        card.appendChild(
            button(
                "Save Reply",
                () => {
                    if (
                        !name.value.trim() ||
                        !message.value.trim()
                    ) {
                        notify(
                            "Fill in both fields."
                        );

                        return;
                    }

                    const replies =
                        get(
                            "replies",
                            []
                        );

                    replies.push({
                        name:
                            name.value.trim(),
                        text:
                            message.value.trim()
                    });

                    set(
                        "replies",
                        replies
                    );

                    renderQuickReplies();

                    notify(
                        "Reply saved."
                    );
                }
            )
        );

        content.appendChild(
            card
        );

        const replies =
            get(
                "replies",
                []
            );

        replies.forEach(
            (reply,index) => {
                const item =
                    el("div", {
                        className:
                            "card"
                    });

                item.appendChild(
                    el("div", {
                        className:
                            "cardTitle",
                        text:
                            reply.name
                    })
                );

                item.appendChild(
                    el("div", {
                        className:
                            "desc",
                        text:
                            reply.text
                    })
                );

                item.appendChild(
                    button(
                        "Insert",
                        () =>
                            insertMessage(
                                reply.text
                            )
                    )
                );

                item.appendChild(
                    button(
                        "Copy",
                        () => {
                            navigator
                                .clipboard
                                ?.writeText(
                                    reply.text
                                );

                            notify(
                                "Copied."
                            );
                        }
                    )
                );

                item.appendChild(
                    button(
                        "Delete",
                        () => {
                            replies.splice(
                                index,
                                1
                            );

                            set(
                                "replies",
                                replies
                            );

                            renderQuickReplies();
                        }
                    )
                );

                content.appendChild(
                    item
                );
            }
        );
    }

    function insertMessage(text) {
        const composer =
            document.querySelector(
                '[role="textbox"]'
            ) ||
            document.querySelector(
                '[contenteditable="true"]'
            );

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
                "Inserted."
            );
        } catch {
            notify(
                "Could not insert."
            );
        }
    }

    // =========================================================
    // TOOLBOX
    // =========================================================

    function renderToolbox() {
        clearContent();

        pageHeader(
            "Toolbox",
            "Browser-side utilities."
        );

        const timestamp =
            el("div", {
                className:
                    "card"
            });

        timestamp.appendChild(
            el("div", {
                className:
                    "cardTitle",
                text:
                    "Discord Timestamp"
            })
        );

        const timestampOutput =
            el("input", {
                className:
                    "input"
            });

        timestampOutput.readOnly =
            true;

        timestamp.appendChild(
            timestampOutput
        );

        timestamp.appendChild(
            button(
                "Generate",
                () => {
                    timestampOutput.value =
                        `<t:${Math.floor(
                            Date.now()/1000
                        )}:F>`;
                }
            )
        );

        timestamp.appendChild(
            button(
                "Copy",
                () => {
                    navigator
                        .clipboard
                        ?.writeText(
                            timestampOutput.value
                        );

                    notify(
                        "Copied."
                    );
                }
            )
        );

        content.appendChild(
            timestamp
        );

        const textCard =
            el("div", {
                className:
                    "card"
            });

        textCard.appendChild(
            el("div", {
                className:
                    "cardTitle",
                text:
                    "Text Counter"
            })
        );

        const area =
            el("textarea", {
                className:
                    "textarea"
            });

        area.style.minHeight =
            "140px";

        const result =
            el("div", {
                className:
                    "desc",
                text:
                    "0 characters • 0 words • 0 lines"
            });

        area.addEventListener(
            "input",
            () => {
                const value =
                    area.value;

                const words =
                    value.trim()
                        ? value.trim()
                            .split(/\s+/)
                            .length
                        : 0;

                const lines =
                    value
                        ? value.split(
                            "\n"
                        ).length
                        : 0;

                result.textContent =
                    `${value.length} characters • ${words} words • ${lines} lines`;
            }
        );

        textCard.appendChild(
            area
        );

        textCard.appendChild(
            result
        );

        content.appendChild(
            textCard
        );

        const jsonCard =
            el("div", {
                className:
                    "card"
            });

        jsonCard.appendChild(
            el("div", {
                className:
                    "cardTitle",
                text:
                    "JSON Formatter"
            })
        );

        const json =
            el("textarea", {
                className:
                    "textarea"
            });

        json.style.minHeight =
            "160px";

        json.placeholder =
            '{"example":true}';

        jsonCard.appendChild(
            json
        );

        jsonCard.appendChild(
            button(
                "Format JSON",
                () => {
                    try {
                        json.value =
                            JSON.stringify(
                                JSON.parse(
                                    json.value
                                ),
                                null,
                                2
                            );

                        notify(
                            "JSON formatted."
                        );
                    } catch {
                        notify(
                            "Invalid JSON."
                        );
                    }
                }
            )
        );

        content.appendChild(
            jsonCard
        );

        const colorCard =
            el("div", {
                className:
                    "card"
            });

        colorCard.appendChild(
            el("div", {
                className:
                    "cardTitle",
                text:
                    "Color Picker"
            })
        );

        const color =
            document.createElement(
                "input"
            );

        color.type =
            "color";

        color.value =
            "#5865f2";

        color.style.width =
            "100%";

        color.style.height =
            "42px";

        colorCard.appendChild(
            color
        );

        colorCard.appendChild(
            button(
                "Copy Hex",
                () => {
                    navigator
                        .clipboard
                        ?.writeText(
                            color.value
                        );

                    notify(
                        color.value +
                        " copied."
                    );
                }
            )
        );

        content.appendChild(
            colorCard
        );
    }

    // =========================================================
    // PALETTE
    // =========================================================

    function renderPalette() {
        clearContent();

        pageHeader(
            "Command Palette",
            "Search LoraCord commands."
        );

        const search =
            el("input", {
                className:
                    "input"
            });

        search.placeholder =
            "Search commands...";

        content.appendChild(
            search
        );

        const list =
            el("div");

        content.appendChild(
            list
        );

        const commands = [
            [
                "Open Plugins",
                "Plugin manager",
                () => openPage("plugins")
            ],
            [
                "Open Themes",
                "Theme manager",
                () => openPage("themes")
            ],
            [
                "Open Quick Replies",
                "Reusable messages",
                () => openPage("quick")
            ],
            [
                "Open Toolbox",
                "Utilities",
                () => openPage("toolbox")
            ],
            [
                "Open CSS",
                "CSS editor",
                () => openPage("css")
            ],
            [
                "Open Wallpaper",
                "Wallpaper",
                () => openPage("wallpaper")
            ],
            [
                "Open Notes",
                "Notes",
                () => openPage("notes")
            ],
            [
                "Open Diagnostics",
                "Diagnostics",
                () => openPage("diagnostics")
            ],
            [
                "Toggle FakeNitro",
                "Cosmetic only",
                () => {
                    setPlugin(
                        "fakeNitro",
                        !pluginEnabled(
                            "fakeNitro"
                        )
                    );

                    applyPlugins();
                }
            ],
            [
                "Rec Room Theme",
                "Apply Rec Room",
                () => applyTheme("RecRoom")
            ],
            [
                "Random Theme",
                "Random theme",
                () => {
                    const names =
                        Object.keys(
                            THEMES
                        );

                    applyTheme(
                        names[
                            Math.floor(
                                Math.random() *
                                names.length
                            )
                        ]
                    );
                }
            ]
        ];

        function draw() {
            list.replaceChildren();

            const query =
                search.value
                    .toLowerCase()
                    .trim();

            commands
                .filter(
                    command =>
                        !query ||
                        command[0]
                            .toLowerCase()
                            .includes(
                                query
                            ) ||
                        command[1]
                            .toLowerCase()
                            .includes(
                                query
                            )
                )
                .forEach(
                    command => {
                        const row =
                            el("div", {
                                className:
                                    "command"
                            });

                        const left =
                            el("div");

                        left.appendChild(
                            el("div", {
                                className:
                                    "commandName",
                                text:
                                    command[0]
                            })
                        );

                        left.appendChild(
                            el("div", {
                                className:
                                    "commandDesc",
                                text:
                                    command[1]
                            })
                        );

                        row.appendChild(
                            left
                        );

                        row.appendChild(
                            button(
                                "Run",
                                command[2]
                            )
                        );

                        list.appendChild(
                            row
                        );
                    }
                );
        }

        search.addEventListener(
            "input",
            draw
        );

        draw();
    }

    // =========================================================
    // CSS
    // =========================================================

    function renderCSS() {
        clearContent();

        pageHeader(
            "Quick CSS",
            "Apply custom browser-local CSS."
        );

        const editor =
            el("textarea", {
                className:
                    "textarea"
            });

        editor.style.minHeight =
            "480px";

        editor.value =
            get(
                "customCSS",
                ""
            );

        content.appendChild(
            editor
        );

        content.appendChild(
            button(
                "Apply CSS",
                () => {
                    set(
                        "customCSS",
                        editor.value
                    );

                    applyGlobalCSS();

                    notify(
                        "CSS applied."
                    );
                }
            )
        );

        content.appendChild(
            button(
                "Clear CSS",
                () => {
                    remove(
                        "customCSS"
                    );

                    applyGlobalCSS();

                    editor.value =
                        "";

                    notify(
                        "CSS cleared."
                    );
                }
            )
        );
    }

    function applyGlobalCSS() {
        const custom =
            get(
                "customCSS",
                ""
            );

        rebuildDiscordCSS(
            custom
        );
    }

    // =========================================================
    // WALLPAPER
    // =========================================================

    function renderWallpaper() {
        clearContent();

        pageHeader(
            "Wallpaper",
            "Set a browser-local Discord background."
        );

        const input =
            el("input", {
                className:
                    "input"
            });

        input.placeholder =
            "Direct image URL";

        input.value =
            get(
                "wallpaper",
                ""
            );

        content.appendChild(
            input
        );

        content.appendChild(
            button(
                "Apply Wallpaper",
                () => {
                    set(
                        "wallpaper",
                        input.value.trim()
                    );

                    applyWallpaper();

                    notify(
                        "Wallpaper applied."
                    );
                }
            )
        );

        content.appendChild(
            button(
                "Remove Wallpaper",
                () => {
                    remove(
                        "wallpaper"
                    );

                    removeWallpaper();

                    input.value =
                        "";

                    notify(
                        "Wallpaper removed."
                    );
                }
            )
        );
    }

    function applyWallpaper() {
        const url =
            get(
                "wallpaper",
                ""
            );

        if (!url) {
            removeWallpaper();
            return;
        }

        let layer =
            document.getElementById(
                "loracord11-wallpaper"
            );

        if (!layer) {
            layer =
                document.createElement(
                    "div"
                );

            layer.id =
                "loracord11-wallpaper";

            Object.assign(
                layer.style,
                {
                    position:"fixed",
                    inset:"0",
                    pointerEvents:"none",
                    zIndex:"0",
                    backgroundSize:"cover",
                    backgroundPosition:"center",
                    backgroundRepeat:"no-repeat",
                    opacity:".23"
                }
            );

            document.documentElement.appendChild(
                layer
            );
        }

        layer.style.backgroundImage =
            `url("${url.replaceAll('"','\\"')}")`;
    }

    function removeWallpaper() {
        document
            .getElementById(
                "loracord11-wallpaper"
            )
            ?.remove();
    }

    // =========================================================
    // NOTES
    // =========================================================

    function renderNotes() {
        clearContent();

        pageHeader(
            "Notes",
            "Private browser-local notes."
        );

        const notes =
            el("textarea", {
                className:
                    "textarea"
            });

        notes.style.minHeight =
            "500px";

        notes.value =
            get(
                "notes",
                ""
            );

        notes.addEventListener(
            "input",
            () => {
                set(
                    "notes",
                    notes.value
                );
            }
        );

        content.appendChild(
            notes
        );

        content.appendChild(
            button(
                "Copy Notes",
                () => {
                    navigator
                        .clipboard
                        ?.writeText(
                            notes.value
                        );

                    notify(
                        "Copied."
                    );
                }
            )
        );
    }

    // =========================================================
    // THEME EDITOR
    // =========================================================

    function renderThemeEditor() {
        clearContent();

        pageHeader(
            "Theme Editor",
            "Create your own accent colors."
        );

        const card =
            el("div", {
                className:
                    "card"
            });

        const primary =
            document.createElement(
                "input"
            );

        primary.type =
            "color";

        primary.value =
            get(
                "customPrimary",
                "#5865f2"
            );

        primary.style.width =
            "100%";

        primary.style.height =
            "42px";

        const secondary =
            document.createElement(
                "input"
            );

        secondary.type =
            "color";

        secondary.value =
            get(
                "customSecondary",
                "#8b5cf6"
            );

        secondary.style.width =
            "100%";

        secondary.style.height =
            "42px";

        secondary.style.marginTop =
            "8px";

        card.appendChild(
            el("div", {
                className:
                    "desc",
                text:
                    "Primary"
            })
        );

        card.appendChild(
            primary
        );

        card.appendChild(
            el("div", {
                className:
                    "desc",
                text:
                    "Secondary"
            })
        );

        card.appendChild(
            secondary
        );

        card.appendChild(
            button(
                "Save Theme",
                () => {
                    set(
                        "theme",
                        "Custom"
                    );

                    set(
                        "customPrimary",
                        primary.value
                    );

                    set(
                        "customSecondary",
                        secondary.value
                    );

                    updateThemeVariables();

                    updateLauncher();

                    notify(
                        "Custom theme saved."
                    );
                }
            )
        );

        content.appendChild(
            card
        );
    }

    // =========================================================
    // STATS
    // =========================================================

    function renderStats() {
        clearContent();

        pageHeader(
            "Plugin Stats",
            "LoraCord plugin information."
        );

        const enabled =
            PLUGINS.filter(
                p =>
                    pluginEnabled(
                        p.id
                    )
            ).length;

        const reliable =
            PLUGINS.filter(
                p =>
                    p.reliable
            ).length;

        const domBased =
            PLUGINS.length -
            reliable;

        const stats =
            el("div", {
                className:
                    "stats"
            });

        [
            [PLUGINS.length,"Total"],
            [enabled,"Enabled"],
            [reliable,"Reliable"],
            [domBased,"DOM Based"]
        ].forEach(
            ([number,label]) => {
                const card =
                    el("div", {
                        className:
                            "stat"
                    });

                card.appendChild(
                    el("div", {
                        className:
                            "number",
                        text:
                            String(number)
                    })
                );

                card.appendChild(
                    el("div", {
                        className:
                            "label",
                        text:
                            label
                    })
                );

                stats.appendChild(
                    card
                );
            }
        );

        content.appendChild(
            stats
        );

        const counts = {};

        PLUGINS.forEach(
            p => {
                counts[p.category] =
                    (counts[p.category] || 0) +
                    1;
            }
        );

        const card =
            el("div", {
                className:
                    "card"
            });

        card.appendChild(
            el("div", {
                className:
                    "cardTitle",
                text:
                    "Categories"
            })
        );

        Object.entries(
            counts
        ).forEach(
            ([category,count]) => {
                card.appendChild(
                    el("span", {
                        className:
                            "chip",
                        text:
                            `${category}: ${count}`
                    })
                );
            }
        );

        content.appendChild(
            card
        );
    }

    // =========================================================
    // DIAGNOSTICS
    // =========================================================

    function renderDiagnostics() {
        clearContent();

        pageHeader(
            "Diagnostics",
            "Check LoraCord 11."
        );

        const checks = [
            [
                "Root",
                !!document.getElementById(
                    "loracord11-root"
                )
            ],
            [
                "Panel",
                !!panel
            ],
            [
                "Shadow DOM",
                !!shadow
            ],
            [
                "Launcher",
                !!launcher
            ],
            [
                "Content Area",
                !!content
            ],
            [
                "Plugin Count",
                PLUGINS.length
            ],
            [
                "Discord",
                location.hostname ===
                "discord.com"
            ]
        ];

        checks.forEach(
            ([name,value]) => {
                const card =
                    el("div", {
                        className:
                            "card"
                    });

                card.appendChild(
                    el("div", {
                        className:
                            "cardTitle",
                        text:
                            name
                    })
                );

                card.appendChild(
                    el("div", {
                        className:
                            "desc",
                        text:
                            String(value)
                    })
                );

                content.appendChild(
                    card
                );
            }
        );
    }

    // =========================================================
    // BACKUP
    // =========================================================

    function renderBackup() {
        clearContent();

        pageHeader(
            "Backup / Restore",
            "Export or restore LoraCord settings."
        );

        const area =
            el("textarea", {
                className:
                    "textarea"
            });

        area.style.minHeight =
            "430px";

        content.appendChild(
            area
        );

        content.appendChild(
            button(
                "Export Settings",
                () => {
                    const data = {};

                    for (
                        let i=0;
                        i<localStorage.length;
                        i++
                    ) {
                        const key =
                            localStorage.key(
                                i
                            );

                        if (
                            key &&
                            key.startsWith(
                                STORE
                            )
                        ) {
                            data[key] =
                                localStorage.getItem(
                                    key
                                );
                        }
                    }

                    area.value =
                        JSON.stringify(
                            data,
                            null,
                            2
                        );

                    notify(
                        "Export created."
                    );
                }
            )
        );

        content.appendChild(
            button(
                "Import Settings",
                () => {
                    try {
                        const data =
                            JSON.parse(
                                area.value
                            );

                        Object.entries(
                            data
                        ).forEach(
                            ([key,value]) => {
                                if (
                                    key.startsWith(
                                        STORE
                                    )
                                ) {
                                    localStorage.setItem(
                                        key,
                                        value
                                    );
                                }
                            }
                        );

                        notify(
                            "Imported. Reloading."
                        );

                        setTimeout(
                            () =>
                                location.reload(),
                            500
                        );
                    } catch {
                        notify(
                            "Invalid backup."
                        );
                    }
                }
            )
        );
    }

    // =========================================================
    // SETTINGS
    // =========================================================

    function renderSettings() {
        clearContent();

        pageHeader(
            "Settings",
            "LoraCord configuration."
        );

        const card =
            el("div", {
                className:
                    "card"
            });

        card.appendChild(
            el("div", {
                className:
                    "cardTitle",
                text:
                    "Quick Controls"
            })
        );

        [
            ["Glass UI","glass"],
            ["Glow","glow"],
            ["Rounded UI","rounded"],
            ["Smooth UI","smooth"],
            ["Performance Mode","performance"],
            ["FakeNitro","fakeNitro"]
        ].forEach(
            ([label,id]) => {
                card.appendChild(
                    button(
                        `${label}: ${
                            pluginEnabled(id)
                                ? "ON"
                                : "OFF"
                        }`,
                        () => {
                            setPlugin(
                                id,
                                !pluginEnabled(
                                    id
                                )
                            );

                            applyPlugins();
                            renderSettings();
                        }
                    )
                );
            }
        );

        content.appendChild(
            card
        );

        const reset =
            el("div", {
                className:
                    "card"
            });

        reset.appendChild(
            el("div", {
                className:
                    "cardTitle",
                text:
                    "Reset"
            })
        );

        reset.appendChild(
            button(
                "Reset Appearance",
                () => {
                    [
                        "glass",
                        "glow",
                        "rounded",
                        "smooth",
                        "performance",
                        "fakeNitro"
                    ].forEach(
                        id => {
                            setPlugin(
                                id,
                                DEFAULTS[id] ??
                                false
                            );
                        }
                    );

                    set(
                        "theme",
                        "LoraCord"
                    );

                    updateThemeVariables();
                    applyPlugins();

                    notify(
                        "Appearance reset."
                    );
                }
            )
        );

        reset.appendChild(
            button(
                "Reset Everything",
                () => {
                    const keys=[];

                    for (
                        let i=0;
                        i<localStorage.length;
                        i++
                    ) {
                        const key =
                            localStorage.key(
                                i
                            );

                        if (
                            key &&
                            key.startsWith(
                                STORE
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
            reset
        );
    }

    // =========================================================
    // DISCORD CSS
    // =========================================================

    function rebuildDiscordCSS(customCSS = null) {
        let css = "";

        if (
            pluginEnabled(
                "messageHover"
            )
        ) {
            css += `
                [class*="message"]:hover {
                    background:
                        rgba(88,101,242,.055)
                        !important;
                }
            `;
        }

        if (
            pluginEnabled(
                "messageGlow"
            )
        ) {
            css += `
                [class*="message"]:hover {
                    box-shadow:
                        inset 3px 0 0
                        rgba(88,101,242,.5)
                        !important;
                }
            `;
        }

        if (
            pluginEnabled(
                "messageBorders"
            )
        ) {
            css += `
                [class*="message"] {
                    border-bottom:
                        1px solid
                        rgba(255,255,255,.025)
                        !important;
                }
            `;
        }

        if (
            pluginEnabled(
                "messageSpacing"
            )
        ) {
            css += `
                [class*="message"] {
                    margin:
                        2px 0
                        !important;
                }
            `;
        }

        if (
            pluginEnabled(
                "linkGlow"
            )
        ) {
            css += `
                a:hover {
                    text-shadow:
                        0 0 10px
                        rgba(88,101,242,.4)
                        !important;
                }
            `;
        }

        if (
            pluginEnabled(
                "codeGlow"
            )
        ) {
            css += `
                pre,code {
                    box-shadow:
                        0 0 15px
                        rgba(88,101,242,.12)
                        !important;
                }
            `;
        }

        if (
            pluginEnabled(
                "mentionGlow"
            )
        ) {
            css += `
                [class*="mention"] {
                    background:
                        rgba(88,101,242,.17)
                        !important;
                    border-radius:
                        5px !important;
                }
            `;
        }

        if (
            pluginEnabled(
                "channelGlow"
            )
        ) {
            css += `
                [class*="containerDefault"]:hover {
                    box-shadow:
                        inset 2px 0 0
                        rgba(88,101,242,.5)
                        !important;
                }
            `;
        }

        if (
            pluginEnabled(
                "selectedChannel"
            )
        ) {
            css += `
                [class*="modeSelected"] {
                    box-shadow:
                        inset 3px 0 0
                        #5865f2
                        !important;
                }
            `;
        }

        if (
            pluginEnabled(
                "channelSpacing"
            )
        ) {
            css += `
                [class*="containerDefault"] {
                    margin:
                        2px 0
                        !important;
                }
            `;
        }

        if (
            pluginEnabled(
                "serverGlow"
            )
        ) {
            css += `
                [class*="listItem"]:hover {
                    filter:
                        drop-shadow(
                            0 0 8px
                            rgba(88,101,242,.5)
                        );
                }
            `;
        }

        if (
            pluginEnabled(
                "serverHover"
            )
        ) {
            css += `
                [class*="listItem"]:hover {
                    transform:
                        translateY(-1px)
                        !important;
                }
            `;
        }

        if (
            pluginEnabled(
                "hideMembers"
            )
        ) {
            css += `
                [class*="membersWrap"] {
                    display:
                        none !important;
                }
            `;
        }

        if (
            pluginEnabled(
                "hideEmoji"
            )
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
            pluginEnabled(
                "hideSticker"
            )
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
            pluginEnabled(
                "hideGift"
            )
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
            pluginEnabled(
                "largeComposer"
            )
        ) {
            css += `
                [role="textbox"] {
                    min-height:
                        52px !important;
                }
            `;
        }

        if (
            pluginEnabled(
                "composerGlow"
            )
        ) {
            css += `
                [role="textbox"]:focus-within {
                    box-shadow:
                        0 0 0 2px
                        rgba(88,101,242,.12),
                        0 0 25px
                        rgba(88,101,242,.12)
                        !important;
                }
            `;
        }

        if (customCSS !== null) {
            css += "\n" + customCSS;
        } else {
            css += get(
                "customCSS",
                ""
            );
        }

        globalDiscordCSS.textContent =
            css;
    }

    // =========================================================
    // GLOBAL DISCORD STYLE
    // =========================================================

    const globalDiscordCSS =
        document.createElement(
            "style"
        );

    globalDiscordCSS.id =
        "loracord11-discord-css";

    document.head.appendChild(
        globalDiscordCSS
    );

    // =========================================================
    // LAUNCHER
    // =========================================================

    function updateLauncher() {
        if (
            !pluginEnabled(
                "launcherIcon"
            )
        ) {
            launcher.style.display =
                "none";

            return;
        }

        launcher.style.display =
            "grid";

        launcher.textContent =
            get(
                "launcherIcon",
                "✦"
            );

        launcher.classList.toggle(
            "nitro",
            pluginEnabled(
                "fakeNitro"
            )
        );

        launcher.classList.toggle(
            "rainbow",
            pluginEnabled(
                "rainbow"
            )
        );
    }

    // =========================================================
    // FAKE NITRO
    // =========================================================

    function refreshFakeNitro() {
        document
            .querySelectorAll(
                ".loracord11-nitro"
            )
            .forEach(
                node =>
                    node.remove()
            );

        const enabled =
            pluginEnabled(
                "fakeNitro"
            );

        panel.classList.toggle(
            "nitro",
            enabled
        );

        if (!enabled) {
            return;
        }

        const targets = [
            ...document.querySelectorAll(
                '[aria-label*="Nitro" i]'
            ),
            ...document.querySelectorAll(
                '[class*="premium"]'
            ),
            ...document.querySelectorAll(
                '[class*="nitro"]'
            )
        ];

        targets
            .slice(
                0,
                10
            )
            .forEach(
                target => {
                    if (
                        target.querySelector(
                            ".loracord11-nitro"
                        )
                    ) {
                        return;
                    }

                    const badge =
                        document.createElement(
                            "span"
                        );

                    badge.className =
                        "loracord11-nitro";

                    badge.textContent =
                        "✦ NITRO";

                    Object.assign(
                        badge.style,
                        {
                            display:
                                "inline-flex",
                            alignItems:
                                "center",
                            marginLeft:
                                "6px",
                            padding:
                                "2px 6px",
                            borderRadius:
                                "5px",
                            background:
                                "linear-gradient(135deg,#ff73fa,#9b6cff,#5865f2)",
                            backgroundSize:
                                "250% 250%",
                            color:
                                "white",
                            fontSize:
                                "8px",
                            fontWeight:
                                "900",
                            boxShadow:
                                "0 0 10px rgba(255,115,250,.35)",
                            pointerEvents:
                                "none"
                        }
                    );

                    try {
                        target.appendChild(
                            badge
                        );
                    } catch {}
                }
            );
    }

    // =========================================================
    // APPLY EVERYTHING
    // =========================================================

    function applyPlugins() {
        updateThemeVariables();

        rebuildDiscordCSS();

        updateLauncher();

        refreshFakeNitro();

        if (
            pluginEnabled(
                "rainbow"
            )
        ) {
            launcher.classList.add(
                "rainbow"
            );

            panel.classList.add(
                "rainbow"
            );
        } else {
            launcher.classList.remove(
                "rainbow"
            );

            panel.classList.remove(
                "rainbow"
            );
        }
    }

    // =========================================================
    // KEYBOARD
    // =========================================================

    document.addEventListener(
        "keydown",
        event => {
            if (
                event.ctrlKey &&
                event.shiftKey &&
                event.key.toLowerCase() ===
                    "l" &&
                pluginEnabled(
                    "launcherIcon"
                )
            ) {
                event.preventDefault();
                openPanel();
            }

            if (
                event.ctrlKey &&
                event.shiftKey &&
                event.key.toLowerCase() ===
                    "k" &&
                pluginEnabled(
                    "palette"
                )
            ) {
                event.preventDefault();

                openPanel();

                setTimeout(
                    () =>
                        openPage(
                            "palette"
                        ),
                    20
                );
            }

            if (
                event.key ===
                "Escape"
            ) {
                closePanel();
            }
        }
    );

    // =========================================================
    // MUTATION WATCHER
    // =========================================================

    const observer =
        new MutationObserver(
            () => {
                if (
                    pluginEnabled(
                        "fakeNitro"
                    )
                ) {
                    refreshFakeNitro();
                }
            }
        );

    if (document.body) {
        observer.observe(
            document.body,
            {
                childList:true,
                subtree:true
            }
        );
    }

    // =========================================================
    // START
    // =========================================================

    updateThemeVariables();

    rebuildDiscordCSS();

    applyWallpaper();

    applyPlugins();

    renderHome();

    // Make Home visibly active.
    const home =
        navigation.querySelector(
            '[data-page="home"]'
        );

    home?.classList.add(
        "active"
    );

    // =========================================================
    // STARTUP TOAST
    // =========================================================

    setTimeout(
        () => {
            notify(
                "LoraCord 11.0 loaded"
            );
        },
        500
    );

    // =========================================================
    // NOTIFICATION
    // =========================================================

    function notify(message) {
        let host =
            shadow.getElementById
                ? shadow.getElementById("notifications")
                : shadow.querySelector("#notifications");

        if (!host) {
            host =
                el(
                    "div",
                    {
                        id:
                            "notifications"
                    }
                );

            Object.assign(
                host.style,
                {
                    position:
                        "fixed",
                    right:
                        "18px",
                    bottom:
                        "18px",
                    zIndex:
                        "999999"
                }
            );

            shadow.appendChild(
                host
            );
        }

        const item =
            el(
                "div",
                {
                    text:
                        message
                }
            );

        Object.assign(
            item.style,
            {
                padding:
                    "10px 13px",
                marginTop:
                    "7px",
                borderRadius:
                    "9px",
                background:
                    "#18191c",
                border:
                    "1px solid rgba(88,101,242,.4)",
                color:
                    "white",
                font:
                    "12px Arial,sans-serif",
                boxShadow:
                    "0 12px 35px rgba(0,0,0,.45)"
            }
        );

        host.appendChild(
            item
        );

        setTimeout(
            () => item.remove(),
            1800
        );
    }

    function recordPluginHistory(
        plugin,
        enabled
    ) {
        if (
            !pluginEnabled(
                "history"
            )
        ) {
            return;
        }

        const history =
            get(
                "pluginHistory",
                []
            );

        history.unshift({
            name:
                plugin.name,
            enabled,
            time:
                new Date().toISOString()
        });

        set(
            "pluginHistory",
            history.slice(
                0,
                50
            )
        );
    }

})();
