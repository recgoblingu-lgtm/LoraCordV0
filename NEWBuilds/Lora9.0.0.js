// ==UserScript==
// @name         LoraCord
// @namespace    https://loracord.local/
// @version      9.0.0
// @description  LoraCord - reliable Discord browser customization suite
// @author       LoraCord
// @match        https://discord.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    const VERSION = "9.0.0";
    const STORE = "loracord9_";

    const IDS = {
        style: "lc9-style",
        featureStyle: "lc9-feature-style",
        launcher: "lc9-launcher",
        panel: "lc9-panel",
        toast: "lc9-toast",
        wallpaper: "lc9-wallpaper",
        customCSS: "lc9-custom-css",
        commandPalette: "lc9-command-palette",
        counter: "lc9-counter"
    };

    const state = {
        page: "home",
        query: "",
        category: "All",
        filter: "all",
        favoritesOnly: false
    };

    const THEMES = {
        LoraCord: { a: "#5865f2", b: "#8b5cf6", bg: "#0d1018" },
        RecRoom: { a: "#00c8ff", b: "#765cff", bg: "#04101a" },
        Aurora: { a: "#00e5ff", b: "#a05cff", bg: "#061016" },
        Crimson: { a: "#ff4f6d", b: "#ff9848", bg: "#120507" },
        Emerald: { a: "#25dd88", b: "#00bca0", bg: "#051009" },
        Ocean: { a: "#31b8ff", b: "#526fff", bg: "#031019" },
        PurpleVoid: { a: "#a76bff", b: "#ff4fd8", bg: "#0f0414" },
        Nitro: { a: "#ff73fa", b: "#9b6cff", bg: "#110715" }
    };

    const PLUGINS = [
        ["quickReplies","Quick Replies","Tools","Store reusable messages and insert them into the composer.",true],
        ["timestampTool","Timestamp Generator","Tools","Generate Discord timestamps and copy them.",true],
        ["messageCounter","Character Counter","Tools","Count characters while typing.",true],
        ["notes","Local Notes","Tools","Private notes stored in your browser.",true],
        ["commandPalette","Command Palette","Tools","Searchable LoraCord command launcher.",true],
        ["markdownHelper","Markdown Helper","Tools","Insert common Discord Markdown snippets.",true],
        ["colorPicker","Color Picker","Tools","Pick a color and copy its hex value.",true],
        ["jsonFormatter","JSON Formatter","Tools","Format and validate JSON locally.",true],
        ["textCounter","Text Counter","Tools","Count words, lines and characters.",true],
        ["settingsBackup","Settings Backup","Tools","Export and import LoraCord settings.",true],
        ["channelURL","Copy Channel URL","Tools","Copy the current Discord URL.",true],
        ["wallpaper","Custom Wallpaper","Customization","Use an image URL as the Discord wallpaper.",true],
        ["quickCSS","Quick CSS","Customization","Apply custom CSS locally.",true],
        ["themeEditor","Theme Editor","Customization","Build and save custom accent themes.",true],
        ["favorites","Plugin Favorites","Core","Favorite plugins for faster access.",true],
        ["pluginSearch","Plugin Search","Core","Search and filter the plugin catalog.",true],
        ["diagnostics","Diagnostics","Advanced","Check which LoraCord systems are active.",true],
        ["stats","Plugin Stats","Advanced","View plugin statistics.",true],
        ["launcher","LoraCord Launcher","Core","Floating LoraCord launcher.",true],
        ["shortcut","Keyboard Shortcut","Core","Ctrl+Shift+L opens LoraCord.",true],
        ["startupToast","Startup Toast","Core","Show a LoraCord startup notification.",true],
        ["localClock","Local Clock","Dashboard","Show a local clock in LoraCord.",true],
        ["localDate","Local Date","Dashboard","Show today's date.",true],
        ["glass","Glass UI","Appearance","Glass effect on supported surfaces.",true],
        ["glow","Glow Effects","Appearance","Adds glow effects to supported UI.",true],
        ["rounded","Rounded UI","Appearance","Rounds supported interface elements.",true],
        ["smooth","Smooth Animations","Appearance","Adds transitions to supported UI.",true],
        ["compact","Compact Mode","Appearance","Reduces spacing where possible.",true],
        ["reducedMotion","Reduced Motion","Accessibility","Reduces LoraCord animation.",true],
        ["highContrast","High Contrast","Accessibility","Boosts visual contrast.",true],
        ["fontSize","Readable Text","Accessibility","Slightly enlarges common message text.",true],
        ["messageHover","Message Hover","Messages","Highlights hovered messages.",false],
        ["messageGlow","Message Glow","Messages","Adds a glow to hovered messages.",false],
        ["messageBorders","Message Borders","Messages","Adds subtle message separators.",false],
        ["messageSpacing","Message Spacing","Messages","Adds message spacing.",false],
        ["linkGlow","Link Glow","Messages","Adds glow to links.",false],
        ["codeGlow","Code Block Glow","Messages","Adds code block glow.",false],
        ["mentionHighlight","Mention Highlight","Messages","Highlights mentions.",false],
        ["channelGlow","Channel Glow","Channels","Highlights channels.",false],
        ["selectedChannelGlow","Selected Channel Glow","Channels","Highlights selected channel.",false],
        ["channelSpacing","Channel Spacing","Channels","Adds spacing between channels.",false],
        ["serverGlow","Server Glow","Servers","Adds glow to server icons.",false],
        ["serverHover","Server Hover","Servers","Adds hover movement to server icons.",false],
        ["hideMembers","Hide Member List","Layout","Hides the member list when current selectors match.",false],
        ["hideEmoji","Hide Emoji Button","Chat","Hides emoji controls when current aria labels match.",false],
        ["hideSticker","Hide Sticker Button","Chat","Hides sticker controls when current aria labels match.",false],
        ["hideGift","Hide Gift Button","Chat","Hides gift controls when current aria labels match.",false],
        ["largeComposer","Larger Chat Box","Chat","Makes the composer taller.",false],
        ["composerGlow","Chat Box Glow","Chat","Adds focus glow around the composer.",false],
        ["recRoom","Rec Room Theme","Themes","Rec Room-inspired cosmetic preset.",true],
        ["aurora","Aurora Theme","Themes","Blue/purple cosmetic preset.",true],
        ["crimson","Crimson Theme","Themes","Red/orange cosmetic preset.",true],
        ["emerald","Emerald Theme","Themes","Green cosmetic preset.",true],
        ["ocean","Ocean Theme","Themes","Blue cosmetic preset.",true],
        ["purple","Purple Void Theme","Themes","Purple/pink cosmetic preset.",true],
        ["nitroTheme","Nitro Theme","Themes","Nitro-inspired cosmetic preset.",true],
        ["rainbow","Rainbow Accent","Themes","Animated accent color.",true],
        ["fakeNitro","FakeNitro","Cosmetic","Cosmetic Nitro-style visuals. Does not unlock Nitro.",true],
        ["fakeBoost","FakeBoost","Cosmetic","Cosmetic boost styling. Does not grant boosts.",true],
        ["customBadge","Custom Badge","Cosmetic","Adds a local badge to the launcher.",true],
        ["themeHistory","Theme History","Advanced","Remember recently used themes.",true],
        ["pluginHistory","Plugin History","Advanced","Remember recent plugin changes.",true],
        ["performanceMode","Performance Mode","Performance","Reduces heavier LoraCord effects.",true],
        ["powerSave","Power Save","Performance","Reduces animations and effects.",true],
        ["randomTheme","Theme Randomizer","Fun","Pick a random built-in theme.",true],
        ["profile","Local Profile","Profile","Store a local LoraCord profile name.",true],
        ["commandHints","Command Hints","Dashboard","Show shortcut hints on the dashboard.",true],
        ["runtimeStatus","Runtime Status","Dashboard","Show LoraCord runtime information.",true]
    ].map(([id,name,category,description,reliable]) => ({
        id,name,category,description,reliable
    }));

    const DEFAULTS = {};
    PLUGINS.forEach(plugin => {
        DEFAULTS[plugin.id] = false;
    });

    Object.assign(DEFAULTS, {
        launcher:true,
        shortcut:true,
        startupToast:true,
        quickReplies:true,
        timestampTool:true,
        messageCounter:true,
        notes:true,
        commandPalette:true,
        markdownHelper:true,
        colorPicker:true,
        jsonFormatter:true,
        textCounter:true,
        settingsBackup:true,
        channelURL:true,
        wallpaper:true,
        quickCSS:true,
        themeEditor:true,
        favorites:true,
        pluginSearch:true,
        diagnostics:true,
        stats:true,
        localClock:true,
        localDate:true,
        glass:true,
        glow:true,
        rounded:true,
        smooth:true,
        fakeNitro:false,
        rainbow:false
    });

    function getSetting(key,fallback) {
        try {
            const raw = localStorage.getItem(STORE + key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch {
            return fallback;
        }
    }

    function setSetting(key,value) {
        try {
            localStorage.setItem(STORE + key,JSON.stringify(value));
        } catch {}
    }

    function getPlugin(id) {
        return getSetting(
            "plugin_" + id,
            DEFAULTS[id] ?? false
        );
    }

    function setPlugin(id,value) {
        setSetting("plugin_" + id,Boolean(value));
    }

    function create(tag,options={}) {
        const el = document.createElement(tag);

        if (options.id) el.id = options.id;
        if (options.className) el.className = options.className;
        if (options.text !== undefined) el.textContent = options.text;
        if (options.html !== undefined) el.innerHTML = options.html;

        return el;
    }

    function $(selector,root=document) {
        return root.querySelector(selector);
    }

    function $$(selector,root=document) {
        return Array.from(root.querySelectorAll(selector));
    }

    function esc(value) {
        return String(value)
            .replaceAll("&","&amp;")
            .replaceAll("<","&lt;")
            .replaceAll(">","&gt;")
            .replaceAll('"',"&quot;")
            .replaceAll("'","&#039;");
    }

    function notify(message) {
        let holder = document.getElementById(IDS.toast);

        if (!holder) {
            holder = create("div",{id:IDS.toast});

            Object.assign(holder.style,{
                position:"fixed",
                right:"18px",
                bottom:"18px",
                zIndex:"2147483647"
            });

            document.body.appendChild(holder);
        }

        const item = create("div",{text:message});

        Object.assign(item.style,{
            padding:"10px 13px",
            marginTop:"7px",
            background:"#18191c",
            color:"#fff",
            border:"1px solid rgba(88,101,242,.45)",
            borderRadius:"9px",
            boxShadow:"0 10px 30px rgba(0,0,0,.45)",
            font:"12px Arial,sans-serif",
            opacity:"0",
            transform:"translateY(8px)",
            transition:".18s ease"
        });

        holder.appendChild(item);

        requestAnimationFrame(()=>{
            item.style.opacity="1";
            item.style.transform="translateY(0)";
        });

        setTimeout(()=>{
            item.style.opacity="0";
            item.style.transform="translateY(8px)";
            setTimeout(()=>item.remove(),220);
        },1800);
    }

    function makeButton(text,callback) {
        const b = create("button",{
            className:"lc-btn",
            text
        });

        b.addEventListener("click",event=>{
            event.preventDefault();
            event.stopPropagation();
            callback();
        },true);

        return b;
    }

    function getComposer() {
        return document.querySelector('[role="textbox"]')
            || document.querySelector('[contenteditable="true"]');
    }

    function insertText(text) {
        const composer = getComposer();

        if (!composer) {
            notify("Open a Discord text channel first.");
            return;
        }

        composer.focus();

        try {
            document.execCommand("insertText",false,text);
            notify("Inserted.");
        } catch {
            notify("Could not insert text.");
        }
    }

    function applyTheme(name) {
        const theme = THEMES[name];

        if (!theme) return;

        document.documentElement.style.setProperty(
            "--lc-accent",
            theme.a
        );

        document.documentElement.style.setProperty(
            "--lc-accent2",
            theme.b
        );

        setSetting("theme",name);

        if (getPlugin("themeHistory")) {
            const history = getSetting("themeHistory",[]);
            history.unshift(name);
            setSetting(
                "themeHistory",
                [...new Set(history)].slice(0,10)
            );
        }

        if (getPlugin("rainbow") === false) {
            document.documentElement.style.setProperty(
                "--lc-accent",
                theme.a
            );
        }

        refreshLauncher();
        notify(name + " theme applied.");
    }

    function injectBaseCSS() {
        if (document.getElementById(IDS.style)) return;

        const style = create("style",{id:IDS.style});

        style.textContent = `
            :root{
                --lc-accent:#5865f2;
                --lc-accent2:#8b5cf6;
                --lc-blur:16px;
                --lc-radius:12px;
            }

            @keyframes lcBG{
                0%{background-position:0% 50%}
                50%{background-position:100% 50%}
                100%{background-position:0% 50%}
            }

            @keyframes lcGlow{
                0%,100%{box-shadow:0 0 10px rgba(88,101,242,.2)}
                50%{box-shadow:0 0 30px rgba(88,101,242,.65)}
            }

            @keyframes lcNitro{
                0%{background-position:0% 50%}
                50%{background-position:100% 50%}
                100%{background-position:0% 50%}
            }

            #${IDS.launcher}{
                position:fixed!important;
                right:18px!important;
                bottom:18px!important;
                width:52px!important;
                height:52px!important;
                border:0!important;
                border-radius:15px!important;
                background:
                    linear-gradient(
                        135deg,
                        var(--lc-accent),
                        var(--lc-accent2)
                    )!important;
                color:white!important;
                font:900 21px Arial,sans-serif!important;
                cursor:pointer!important;
                z-index:2147483647!important;
            }

            #${IDS.launcher}.glow{
                animation:lcGlow 3s ease infinite!important;
            }

            #${IDS.launcher}.nitro{
                background:
                    linear-gradient(
                        135deg,
                        #ff73fa,
                        #9b6cff,
                        #5865f2,
                        #ff73fa
                    )!important;
                background-size:300% 300%!important;
                animation:lcNitro 4s ease infinite!important;
                box-shadow:0 0 25px rgba(255,115,250,.5)!important;
            }

            #${IDS.panel}{
                position:fixed!important;
                left:50%!important;
                top:50%!important;
                width:min(
                    1100px,
                    calc(100vw - 24px)
                )!important;
                height:min(
                    740px,
                    calc(100vh - 24px)
                )!important;
                transform:translate(-50%,-50%)!important;
                display:none!important;
                overflow:hidden!important;
                background:#111214!important;
                color:white!important;
                border:
                    1px solid
                    rgba(255,255,255,.08)!important;
                border-radius:16px!important;
                box-shadow:
                    0 25px 100px
                    rgba(0,0,0,.72)!important;
                z-index:2147483646!important;
                font-family:Arial,sans-serif!important;
                pointer-events:auto!important;
            }

            #${IDS.panel}.open{
                display:flex!important;
            }

            #${IDS.panel} *{
                box-sizing:border-box;
            }

            .lc-side{
                width:225px;
                flex:0 0 225px;
                background:#0f1012;
                border-right:
                    1px solid
                    rgba(255,255,255,.06);
                display:flex;
                flex-direction:column;
            }

            .lc-brand{
                padding:17px;
                border-bottom:
                    1px solid
                    rgba(255,255,255,.06);
            }

            .lc-brand-row{
                display:flex;
                align-items:center;
                gap:9px;
            }

            .lc-logo{
                width:35px;
                height:35px;
                display:grid;
                place-items:center;
                border-radius:10px;
                background:
                    linear-gradient(
                        135deg,
                        var(--lc-accent),
                        var(--lc-accent2)
                    );
                font-weight:900;
            }

            .lc-brand-name{
                font-size:15px;
                font-weight:900;
            }

            .lc-brand-version{
                font-size:9px;
                color:#777d86;
                margin-top:2px;
            }

            .lc-search{
                width:calc(100% - 20px);
                margin:10px;
                padding:9px;
                background:#08090b;
                color:white;
                border:
                    1px solid
                    rgba(255,255,255,.07);
                border-radius:8px;
                outline:none;
            }

            .lc-nav{
                padding:0 9px;
                overflow-y:auto;
            }

            .lc-nav-section{
                padding:
                    12px 8px 5px;
                color:#686e76;
                font:
                    900 9px Arial,sans-serif;
                letter-spacing:1px;
                text-transform:uppercase;
            }

            .lc-nav-btn{
                width:100%;
                padding:9px;
                margin-bottom:3px;
                border:0;
                border-radius:8px;
                background:transparent;
                color:#a5a8ae;
                text-align:left;
                cursor:pointer;
                font:
                    700 11px Arial,sans-serif;
            }

            .lc-nav-btn:hover,
            .lc-nav-btn.active{
                background:
                    rgba(88,101,242,.17);
                color:white;
            }

            .lc-side-bottom{
                margin-top:auto;
                padding:10px;
                border-top:
                    1px solid
                    rgba(255,255,255,.06);
                color:#777d86;
                font-size:9px;
            }

            .lc-main{
                flex:1;
                min-width:0;
                display:flex;
                flex-direction:column;
            }

            .lc-top{
                height:58px;
                min-height:58px;
                display:flex;
                align-items:center;
                justify-content:space-between;
                padding:0 15px;
                border-bottom:
                    1px solid
                    rgba(255,255,255,.06);
            }

            .lc-top-title{
                font-size:14px;
                font-weight:900;
            }

            .lc-top-actions{
                display:flex;
                gap:5px;
            }

            .lc-top-btn{
                width:31px;
                height:31px;
                border:0;
                border-radius:8px;
                background:
                    rgba(255,255,255,.05);
                color:white;
                cursor:pointer;
            }

            .lc-content{
                flex:1;
                overflow-y:auto;
                padding:18px;
            }

            .lc-title{
                font-size:24px;
                font-weight:900;
                margin-bottom:4px;
            }

            .lc-sub{
                color:#9297a0;
                font-size:11px;
                margin-bottom:16px;
            }

            .lc-card{
                padding:13px;
                margin-bottom:11px;
                border:
                    1px solid
                    rgba(255,255,255,.06);
                border-radius:11px;
                background:
                    rgba(255,255,255,.03);
            }

            .lc-card-title{
                font-size:13px;
                font-weight:800;
                margin-bottom:6px;
            }

            .lc-desc{
                color:#9297a0;
                font-size:10px;
                line-height:1.45;
                margin-bottom:9px;
            }

            .lc-btn{
                width:100%;
                padding:9px;
                margin-top:6px;
                border:
                    1px solid
                    rgba(255,255,255,.07);
                border-radius:8px;
                background:
                    rgba(255,255,255,.045);
                color:white;
                text-align:left;
                cursor:pointer;
                font:
                    700 11px Arial,sans-serif;
            }

            .lc-btn:hover{
                background:
                    rgba(88,101,242,.16);
                border-color:
                    rgba(88,101,242,.3);
            }

            .lc-input,
            .lc-plugin-search{
                width:100%;
                padding:10px;
                background:#090a0c;
                color:white;
                border:
                    1px solid
                    rgba(255,255,255,.07);
                border-radius:8px;
                outline:none;
                margin-bottom:8px;
            }

            .lc-textarea{
                width:100%;
                min-height:220px;
                padding:10px;
                background:#090a0c;
                color:white;
                border:
                    1px solid
                    rgba(255,255,255,.07);
                border-radius:8px;
                outline:none;
                resize:vertical;
                font:12px monospace;
            }

            .lc-filters{
                display:flex;
                flex-wrap:wrap;
                gap:6px;
                margin:2px 0 14px;
            }

            .lc-filter{
                padding:7px 10px;
                border:0;
                border-radius:7px;
                background:#2b2d31;
                color:white;
                cursor:pointer;
                font:
                    700 10px Arial,sans-serif;
            }

            .lc-filter.active{
                background:var(--lc-accent);
            }

            .lc-category{
                margin:
                    17px 0 6px;
                color:#727780;
                font:
                    900 9px Arial,sans-serif;
                letter-spacing:1px;
                text-transform:uppercase;
            }

            .lc-plugin{
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:12px;
                padding:11px 0;
                border-bottom:
                    1px solid
                    rgba(255,255,255,.045);
            }

            .lc-plugin-name{
                font-size:12px;
                font-weight:800;
            }

            .lc-plugin-description{
                color:#9297a0;
                font-size:10px;
                margin-top:3px;
                line-height:1.4;
            }

            .lc-toggle{
                position:relative;
                width:40px;
                height:22px;
                flex:0 0 40px;
            }

            .lc-toggle input{
                display:none;
            }

            .lc-toggle-track{
                position:absolute;
                inset:0;
                border-radius:20px;
                background:#3a3d44;
                cursor:pointer;
            }

            .lc-toggle-track:before{
                content:"";
                position:absolute;
                width:16px;
                height:16px;
                left:3px;
                top:3px;
                background:white;
                border-radius:50%;
                transition:.18s ease;
            }

            .lc-toggle input:checked
            + .lc-toggle-track{
                background:var(--lc-accent);
            }

            .lc-toggle input:checked
            + .lc-toggle-track:before{
                transform:
                    translateX(18px);
            }

            .lc-grid{
                display:grid;
                grid-template-columns:
                    repeat(4,minmax(0,1fr));
                gap:10px;
            }

            .lc-stat{
                padding:12px;
                border:
                    1px solid
                    rgba(255,255,255,.06);
                border-radius:10px;
                background:
                    rgba(255,255,255,.025);
            }

            .lc-stat-number{
                font-size:21px;
                font-weight:900;
            }

            .lc-stat-label{
                color:#777d86;
                font-size:9px;
                margin-top:2px;
            }

            .lc-chip{
                display:inline-block;
                margin:3px;
                padding:4px 7px;
                border-radius:20px;
                background:
                    rgba(88,101,242,.12);
                color:#bec3ff;
                font-size:9px;
            }

            .lc-command{
                display:flex;
                justify-content:space-between;
                gap:10px;
                padding:10px 0;
                border-bottom:
                    1px solid
                    rgba(255,255,255,.04);
            }

            .lc-command-name{
                font-size:11px;
                font-weight:800;
            }

            .lc-command-desc{
                font-size:9px;
                color:#858b94;
                margin-top:2px;
            }

            .loracord-fake-nitro-badge{
                display:inline-flex!important;
                align-items:center!important;
                margin-left:6px!important;
                padding:2px 6px!important;
                border-radius:5px!important;
                background:
                    linear-gradient(
                        135deg,
                        #ff73fa,
                        #9b6cff,
                        #5865f2
                    )!important;
                background-size:
                    250% 250%!important;
                color:white!important;
                font-size:8px!important;
                font-weight:900!important;
                letter-spacing:.4px!important;
                box-shadow:
                    0 0 10px
                    rgba(255,115,250,.35)!important;
                animation:
                    lcNitro
                    4s ease
                    infinite!important;
                pointer-events:none!important;
            }

            #${IDS.panel}.nitro{
                border-color:
                    rgba(255,115,250,.3)!important;
                box-shadow:
                    0 0 45px
                    rgba(255,115,250,.12)!important;
            }

            @media(max-width:720px){
                .lc-side{
                    width:62px;
                    flex-basis:62px;
                }

                .lc-brand-name,
                .lc-brand-version,
                .lc-nav-section{
                    display:none;
                }

                .lc-nav-btn{
                    text-align:center;
                }

                .lc-grid{
                    grid-template-columns:
                        repeat(2,minmax(0,1fr));
                }
            }
        `;

        document.head.appendChild(style);
    }

    // =========================================================
    // FEATURE ENGINE
    // =========================================================

    function rebuildFeatureCSS() {
        let style = document.getElementById(IDS.featureStyle);

        if (!style) {
            style = create("style",{
                id:IDS.featureStyle
            });

            document.head.appendChild(style);
        }

        let css = "";
        const on = id => getPlugin(id);

        if (on("glass")) {
            css += `
                #${IDS.panel}{
                    backdrop-filter:blur(20px);
                }

                [class*="sidebar"],
                [class*="guilds"],
                [class*="panels"]{
                    backdrop-filter:
                        blur(var(--lc-blur))
                        saturate(135%)!important;
                }
            `;
        }

        if (on("glow")) {
            css += `
                #${IDS.panel} .lc-btn:hover,
                #${IDS.panel} .lc-nav-btn:hover{
                    box-shadow:
                        0 0 14px
                        rgba(88,101,242,.18);
                }
            `;
        }

        if (on("rounded")) {
            css += `
                [role="dialog"],
                [class*="card"],
                [class*="container"]{
                    border-radius:
                        var(--lc-radius)!important;
                }
            `;
        }

        if (on("smooth")) {
            css += `
                #${IDS.panel} *,
                button,
                [role="button"],
                [class*="channel"],
                [class*="message"]{
                    transition:.16s ease;
                }
            `;
        }

        if (on("compact")) {
            css += `
                [class*="message"]{
                    padding-top:3px!important;
                    padding-bottom:3px!important;
                }
            `;
        }

        if (on("highContrast")) {
            css += `
                #${IDS.panel}{
                    color:#fff;
                }
            `;
        }

        if (on("fontSize")) {
            css += `
                [class*="messageContent"],
                [class*="username"]{
                    font-size:1.03em!important;
                }
            `;
        }

        if (on("messageHover")) {
            css += `
                [class*="message"]:hover{
                    background:
                        rgba(88,101,242,.055)!important;
                }
            `;
        }

        if (on("messageGlow")) {
            css += `
                [class*="message"]:hover{
                    box-shadow:
                        inset 3px 0 0
                        rgba(88,101,242,.5)!important;
                }
            `;
        }

        if (on("messageBorders")) {
            css += `
                [class*="message"]{
                    border-bottom:
                        1px solid
                        rgba(255,255,255,.025)!important;
                }
            `;
        }

        if (on("messageSpacing")) {
            css += `
                [class*="message"]{
                    margin:2px 0!important;
                }
            `;
        }

        if (on("linkGlow")) {
            css += `
                a:hover{
                    text-shadow:
                        0 0 10px
                        rgba(88,101,242,.4)!important;
                }
            `;
        }

        if (on("codeGlow")) {
            css += `
                pre,code{
                    box-shadow:
                        0 0 15px
                        rgba(88,101,242,.12)!important;
                }
            `;
        }

        if (on("mentionHighlight")) {
            css += `
                [class*="mention"]{
                    background:
                        rgba(88,101,242,.17)!important;
                    border-radius:
                        5px!important;
                }
            `;
        }

        if (on("hideEmoji")) {
            css += `
                button[
                    aria-label*="emoji" i
                ]{
                    display:none!important;
                }
            `;
        }

        if (on("hideSticker")) {
            css += `
                button[
                    aria-label*="sticker" i
                ]{
                    display:none!important;
                }
            `;
        }

        if (on("hideGift")) {
            css += `
                button[
                    aria-label*="gift" i
                ]{
                    display:none!important;
                }
            `;
        }

        if (on("largeComposer")) {
            css += `
                [role="textbox"]{
                    min-height:
                        52px!important;
                }
            `;
        }

        if (on("composerGlow")) {
            css += `
                [role="textbox"]:focus-within{
                    box-shadow:
                        0 0 0 2px
                        rgba(88,101,242,.12),
                        0 0 25px
                        rgba(88,101,242,.12)!important;
                }
            `;
        }

        if (on("channelGlow")) {
            css += `
                [class*="containerDefault"]:hover{
                    box-shadow:
                        inset 2px 0 0
                        rgba(88,101,242,.5)!important;
                }
            `;
        }

        if (on("selectedChannelGlow")) {
            css += `
                [class*="modeSelected"]{
                    box-shadow:
                        inset 3px 0 0
                        var(--lc-accent)!important;
                }
            `;
        }

        if (on("channelSpacing")) {
            css += `
                [class*="containerDefault"]{
                    margin:2px 0!important;
                }
            `;
        }

        if (on("serverGlow")) {
            css += `
                [class*="listItem"]:hover{
                    filter:
                        drop-shadow(
                            0 0 8px
                            rgba(88,101,242,.5)
                        );
                }
            `;
        }

        if (on("serverHover")) {
            css += `
                [class*="listItem"]:hover{
                    transform:
                        translateY(-1px);
                }
            `;
        }

        if (on("hideMembers")) {
            css += `
                [class*="membersWrap"]{
                    display:none!important;
                }
            `;
        }

        if (on("reducedMotion")) {
            css += `
                #${IDS.panel} *,
                #${IDS.launcher}{
                    animation:none!important;
                    transition:none!important;
                }
            `;
        }

        if (on("performanceMode") || on("powerSave")) {
            css += `
                #${IDS.panel} *{
                    animation:none!important;
                }
            `;
        }

        style.textContent = css;
    }

    // =========================================================
    // FAKE NITRO
    // =========================================================

    function refreshFakeNitro() {
        const enabled = getPlugin("fakeNitro");

        const panel = document.getElementById(IDS.panel);
        const launcher = document.getElementById(IDS.launcher);

        panel?.classList.toggle("nitro",enabled);
        launcher?.classList.toggle("nitro",enabled);

        document
            .querySelectorAll(".loracord-fake-nitro-badge")
            .forEach(node=>node.remove());

        if (!enabled) return;

        const targets = [
            ...$$('[class*="premium"]'),
            ...$$('[class*="nitro"]'),
            ...$$('[aria-label*="Nitro" i]')
        ];

        targets.slice(0,12).forEach(target=>{
            if (
                target.querySelector(
                    ".loracord-fake-nitro-badge"
                )
            ) {
                return;
            }

            target.appendChild(
                create("span",{
                    className:
                        "loracord-fake-nitro-badge",
                    text:"✦ NITRO"
                })
            );
        });
    }

    // =========================================================
    // PANEL
    // =========================================================

    function createPanel() {
        if (document.getElementById(IDS.panel)) return;

        const panel = create("div",{
            id:IDS.panel
        });

        panel.innerHTML = `
            <div class="lc-side">

                <div class="lc-brand">
                    <div class="lc-brand-row">
                        <div class="lc-logo">L</div>

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
                    id="lc-global-search"
                    class="lc-search"
                    placeholder="Search LoraCord..."
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
                        data-page="toolbox">
                        🧰 Toolbox
                    </button>

                    <button
                        class="lc-nav-btn"
                        data-page="palette">
                        ⌘ Command Palette
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
                        Advanced
                    </div>

                    <button
                        class="lc-nav-btn"
                        data-page="editor">
                        🎛 Theme Editor
                    </button>

                    <button
                        class="lc-nav-btn"
                        data-page="stats">
                        📊 Plugin Stats
                    </button>

                    <button
                        class="lc-nav-btn"
                        data-page="diagnostics">
                        🩺 Diagnostics
                    </button>

                    <button
                        class="lc-nav-btn"
                        data-page="backup">
                        ⇄ Backup / Restore
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
                        id="lc-page-title"
                        class="lc-top-title">
                        Home
                    </div>

                    <div class="lc-top-actions">

                        <button
                            id="lc-refresh"
                            class="lc-top-btn">
                            ↻
                        </button>

                        <button
                            id="lc-close"
                            class="lc-top-btn">
                            ×
                        </button>

                    </div>
                </div>

                <div
                    id="lc-content"
                    class="lc-content">
                </div>

            </div>
        `;

        document.body.appendChild(panel);

        // Delegated navigation: fixes the old "stuck on Home" problem.
        panel.addEventListener(
            "click",
            event=>{
                const nav =
                    event.target.closest(
                        ".lc-nav-btn"
                    );

                if (
                    !nav ||
                    !panel.contains(nav)
                ) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                $$(".lc-nav-btn",panel)
                    .forEach(
                        button =>
                            button.classList.remove(
                                "active"
                            )
                    );

                nav.classList.add("active");

                state.page =
                    nav.dataset.page;

                const title =
                    $("#lc-page-title",panel);

                if (title) {
                    title.textContent =
                        nav.textContent.trim();
                }

                renderPage(state.page);
            },
            true
        );

        $("#lc-close",panel).onclick =
            ()=>closePanel();

        $("#lc-refresh",panel).onclick =
            ()=>location.reload();

        $("#lc-global-search",panel).oninput =
            event=>{
                const query =
                    event.target.value.trim();

                if (!query) return;

                openPage("plugins");

                setTimeout(()=>{
                    const input =
                        document.getElementById(
                            "lc-plugin-search"
                        );

                    if (input) {
                        input.value =
                            query;

                        input.dispatchEvent(
                            new Event(
                                "input",
                                {
                                    bubbles:true
                                }
                            )
                        );
                    }
                },30);
            };

        renderPage("home");
    }

    function openPanel() {
        if (!document.getElementById(IDS.panel)) {
            createPanel();
        }

        document.getElementById(
            IDS.panel
        ).classList.add("open");
    }

    function closePanel() {
        document.getElementById(
            IDS.panel
        )?.classList.remove("open");
    }

    function openPage(page) {
        const panel =
            document.getElementById(
                IDS.panel
            );

        const button =
            panel?.querySelector(
                `[data-page="${page}"]`
            );

        button?.click();
    }

    // =========================================================
    // LAUNCHER
    // =========================================================

    function refreshLauncher() {
        document.getElementById(
            IDS.launcher
        )?.remove();

        if (!getPlugin("launcher")) {
            return;
        }

        const launcher =
            create("button",{
                id:IDS.launcher,
                text:getSetting(
                    "launcherIcon",
                    "✦"
                )
            });

        if (getPlugin("fakeNitro")) {
            launcher.classList.add("nitro");
        } else if (getPlugin("glow")) {
            launcher.classList.add("glow");
        }

        launcher.title =
            "Open LoraCord";

        launcher.onclick =
            openPanel;

        document.body.appendChild(
            launcher
        );
    }

    // =========================================================
    // PAGES
    // =========================================================

    function pageHeader(
        content,
        title,
        subtitle
    ) {
        content.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-title",
                    text:title
                }
            )
        );

        content.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-sub",
                    text:subtitle
                }
            )
        );
    }

    function renderPage(page) {
        const content =
            document.getElementById(
                "lc-content"
            );

        if (!content) return;

        content.innerHTML = "";

        switch(page){
            case "home":
                renderHome(content);
                break;

            case "plugins":
                renderPlugins(content);
                break;

            case "themes":
                renderThemes(content);
                break;

            case "quick":
                renderQuickReplies(content);
                break;

            case "toolbox":
                renderToolbox(content);
                break;

            case "palette":
                renderPalette(content);
                break;

            case "css":
                renderCSS(content);
                break;

            case "wallpaper":
                renderWallpaper(content);
                break;

            case "notes":
                renderNotes(content);
                break;

            case "editor":
                renderThemeEditor(content);
                break;

            case "stats":
                renderStats(content);
                break;

            case "diagnostics":
                renderDiagnostics(content);
                break;

            case "backup":
                renderBackup(content);
                break;

            case "settings":
                renderSettings(content);
                break;

            default:
                renderHome(content);
        }
    }

    // =========================================================
    // HOME
    // =========================================================

    function renderHome(content) {
        pageHeader(
            content,
            "LoraCord",
            "Your Discord customization center."
        );

        const enabled =
            PLUGINS.filter(
                plugin=>getPlugin(plugin.id)
            ).length;

        const grid =
            create("div",{
                className:"lc-grid"
            });

        [
            [PLUGINS.length,"Plugins"],
            [enabled,"Enabled"],
            [Object.keys(THEMES).length,"Themes"],
            [VERSION,"Version"]
        ].forEach(
            ([number,label])=>{
                const stat =
                    create(
                        "div",
                        {
                            className:
                                "lc-stat"
                        }
                    );

                stat.innerHTML=`
                    <div class="lc-stat-number">
                        ${esc(number)}
                    </div>

                    <div class="lc-stat-label">
                        ${esc(label)}
                    </div>
                `;

                grid.appendChild(stat);
            }
        );

        content.appendChild(grid);

        const actions =
            create(
                "div",
                {
                    className:
                        "lc-card"
                }
            );

        actions.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-card-title",
                    text:"Quick Actions"
                }
            )
        );

        actions.appendChild(
            makeButton(
                "🧩 Plugins",
                ()=>openPage("plugins")
            )
        );

        actions.appendChild(
            makeButton(
                "🎨 Rec Room Theme",
                ()=>applyTheme("RecRoom")
            )
        );

        actions.appendChild(
            makeButton(
                "💎 Toggle FakeNitro",
                ()=>{
                    setPlugin(
                        "fakeNitro",
                        !getPlugin(
                            "fakeNitro"
                        )
                    );

                    applyPlugins();
                }
            )
        );

        actions.appendChild(
            makeButton(
                "⌘ Command Palette",
                ()=>openPage("palette")
            )
        );

        actions.appendChild(
            makeButton(
                "🩺 Diagnostics",
                ()=>openPage("diagnostics")
            )
        );

        content.appendChild(actions);

        if (
            getPlugin("localClock") ||
            getPlugin("localDate")
        ) {
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
                            "Local Status"
                    }
                )
            );

            const time =
                create(
                    "div",
                    {
                        className:
                            "lc-desc"
                    }
                );

            card.appendChild(time);

            const update=()=>{
                const now =
                    new Date();

                const parts=[];

                if (
                    getPlugin(
                        "localClock"
                    )
                ) {
                    parts.push(
                        now.toLocaleTimeString()
                    );
                }

                if (
                    getPlugin(
                        "localDate"
                    )
                ) {
                    parts.push(
                        now.toLocaleDateString()
                    );
                }

                time.textContent =
                    parts.join(
                        " • "
                    );
            };

            update();

            setInterval(
                update,
                1000
            );

            content.appendChild(card);
        }
    }

    // =========================================================
    // PLUGINS
    // =========================================================

    function renderPlugins(content) {
        pageHeader(
            content,
            "Plugins",
            `${PLUGINS.length} LoraCord plugins.`
        );

        const search =
            create(
                "input",
                {
                    id:
                        "lc-plugin-search",
                    className:
                        "lc-plugin-search"
                }
            );

        search.placeholder =
            "Search plugins...";

        search.value =
            state.query;

        search.oninput =
            ()=>{
                state.query =
                    search.value;

                renderPlugins(
                    content
                );
            };

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
            ["all","All"],
            ["enabled","Enabled"],
            ["disabled","Disabled"]
        ].forEach(
            ([id,label])=>{
                const button =
                    create(
                        "button",
                        {
                            className:
                                "lc-filter"+
                                (
                                    state.filter===
                                    id
                                        ? " active"
                                        : ""
                                ),
                            text:label
                        }
                    );

                button.onclick =
                    ()=>{
                        state.filter =
                            id;

                        renderPlugins(
                            content
                        );
                    };

                filters.appendChild(
                    button
                );
            }
        );

        [
            "All",
            ...new Set(
                PLUGINS.map(
                    plugin =>
                        plugin.category
                )
            )
        ].forEach(
            category=>{
                const button =
                    create(
                        "button",
                        {
                            className:
                                "lc-filter"+
                                (
                                    state.category===
                                    category
                                        ? " active"
                                        : ""
                                ),
                            text:category
                        }
                    );

                button.onclick =
                    ()=>{
                        state.category =
                            category;

                        renderPlugins(
                            content
                        );
                    };

                filters.appendChild(
                    button
                );
            }
        );

        const favorite =
            create(
                "button",
                {
                    className:
                        "lc-filter"+
                        (
                            state.favoritesOnly
                                ? " active"
                                : ""
                        ),
                    text:
                        "★ Favorites"
                }
            );

        favorite.onclick =
            ()=>{
                state.favoritesOnly =
                    !state.favoritesOnly;

                renderPlugins(
                    content
                );
            };

        filters.appendChild(
            favorite
        );

        content.appendChild(
            filters
        );

        const query =
            state.query
                .toLowerCase()
                .trim();

        const filtered =
            PLUGINS.filter(
                plugin=>{
                    const textMatch =
                        !query||
                        plugin.name
                            .toLowerCase()
                            .includes(
                                query
                            )||
                        plugin.description
                            .toLowerCase()
                            .includes(
                                query
                            );

                    const categoryMatch =
                        state.category===
                            "All"||
                        plugin.category===
                            state.category;

                    const enabled =
                        getPlugin(
                            plugin.id
                        );

                    const filterMatch =
                        state.filter===
                            "all"||
                        (
                            state.filter===
                            "enabled"&&
                            enabled
                        )||
                        (
                            state.filter===
                            "disabled"&&
                            !enabled
                        );

                    const favorite =
                        getSetting(
                            "favorite_"+
                            plugin.id,
                            false
                        );

                    const favoriteMatch =
                        !state.favoritesOnly||
                        favorite;

                    return (
                        textMatch&&
                        categoryMatch&&
                        filterMatch&&
                        favoriteMatch
                    );
                }
            );

        const groups={};

        filtered.forEach(
            plugin=>{
                (
                    groups[
                        plugin.category
                    ]??=[]
                ).push(plugin);
            }
        );

        Object.entries(
            groups
        ).forEach(
            ([category,plugins])=>{
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
                    plugin=>{
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

                        info.innerHTML=`
                            <div class="lc-plugin-name">
                                ${esc(plugin.name)}
                            </div>

                            <div class="lc-plugin-description">
                                ${esc(plugin.description)}
                            </div>

                            <div style="
                                margin-top:4px;
                                font-size:9px;
                                color:${
                                    plugin.reliable
                                        ? "#23a55a"
                                        : "#f0b232"
                                };
                            ">
                                ${
                                    plugin.reliable
                                        ? "Reliable local feature"
                                        : "Discord DOM dependent"
                                }
                            </div>
                        `;

                        const controls =
                            create(
                                "div",
                                {
                                    style:{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap:
                                            "6px"
                                    }
                                }
                            );

                        const star =
                            create(
                                "button",
                                {
                                    className:
                                        "lc-filter",
                                    text:
                                        getSetting(
                                            "favorite_"+
                                            plugin.id,
                                            false
                                        )
                                            ? "★"
                                            : "☆"
                                }
                            );

                        star.onclick =
                            ()=>{
                                setSetting(
                                    "favorite_"+
                                    plugin.id,
                                    !getSetting(
                                        "favorite_"+
                                        plugin.id,
                                        false
                                    )
                                );

                                renderPlugins(
                                    content
                                );
                            };

                        const infoButton =
                            create(
                                "button",
                                {
                                    className:
                                        "lc-filter",
                                    text:
                                        "Info"
                                }
                            );

                        infoButton.onclick =
                            ()=>{
                                showPluginInfo(
                                    plugin
                                );
                            };

                        const toggle =
                            create(
                                "label",
                                {
                                    className:
                                        "lc-toggle"
                                }
                            );

                        const input =
                            create("input");

                        input.type =
                            "checkbox";

                        input.checked =
                            getPlugin(
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

                        input.onchange =
                            ()=>{
                                setPlugin(
                                    plugin.id,
                                    input.checked
                                );

                                const history =
                                    getSetting(
                                        "pluginHistory",
                                        []
                                    );

                                history.unshift({
                                    plugin:
                                        plugin.name,
                                    enabled:
                                        input.checked,
                                    time:
                                        new Date()
                                            .toISOString()
                                });

                                setSetting(
                                    "pluginHistory",
                                    history.slice(
                                        0,
                                        50
                                    )
                                );

                                applyPlugins();

                                notify(
                                    plugin.name+
                                    (
                                        input.checked
                                            ? " enabled."
                                            : " disabled."
                                    )
                                );
                            };

                        toggle.appendChild(
                            input
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
                );
            }
        );

        if (!filtered.length) {
            content.appendChild(
                create(
                    "div",
                    {
                        text:
                            "No plugins found.",
                        style:{
                            padding:"35px",
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

    function showPluginInfo(plugin) {
        const overlay =
            create("div");

        Object.assign(
            overlay.style,
            {
                position:"fixed",
                inset:"0",
                zIndex:"2147483647",
                background:
                    "rgba(0,0,0,.62)",
                display:
                    "grid",
                placeItems:
                    "center"
            }
        );

        const card =
            create("div");

        Object.assign(
            card.style,
            {
                width:
                    "min(560px,calc(100vw - 30px))",
                padding:
                    "20px",
                background:
                    "#18191c",
                color:
                    "white",
                border:
                    "1px solid rgba(255,255,255,.08)",
                borderRadius:
                    "14px",
                boxShadow:
                    "0 20px 70px rgba(0,0,0,.65)",
                fontFamily:
                    "Arial,sans-serif"
            }
        );

        card.innerHTML=`
            <div style="
                font-size:20px;
                font-weight:900
            ">
                ${esc(plugin.name)}
            </div>

            <div style="
                font-size:10px;
                color:#777d86;
                margin-top:3px
            ">
                ${esc(plugin.category)}
            </div>

            <div style="
                font-size:12px;
                color:#b5bac1;
                line-height:1.5;
                margin-top:14px
            ">
                ${esc(plugin.description)}
            </div>

            <div style="
                font-size:10px;
                margin-top:12px;
                color:${
                    plugin.reliable
                        ? "#23a55a"
                        : "#f0b232"
                }
            ">
                ${
                    plugin.reliable
                        ? "Implemented locally."
                        : "Depends on Discord's changing DOM."
                }
            </div>
        `;

        card.appendChild(
            makeButton(
                "Toggle",
                ()=>{
                    setPlugin(
                        plugin.id,
                        !getPlugin(
                            plugin.id
                        )
                    );

                    applyPlugins();

                    overlay.remove();
                }
            )
        );

        card.appendChild(
            makeButton(
                "Close",
                ()=>overlay.remove()
            )
        );

        overlay.appendChild(
            card
        );

        document.body.appendChild(
            overlay
        );
    }

    // =========================================================
    // THEMES
    // =========================================================

    function renderThemes(content) {
        pageHeader(
            content,
            "Themes",
            "LoraCord cosmetic presets."
        );

        Object.entries(
            THEMES
        ).forEach(
            ([name,theme])=>{
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
                    `
                        linear-gradient(
                            135deg,
                            ${theme.a},
                            ${theme.b}
                        )
                    `;

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
                        ()=>applyTheme(
                            name
                        )
                    )
                );

                content.appendChild(
                    card
                );
            }
        );

        const custom =
            create(
                "div",
                {
                    className:
                        "lc-card"
                }
            );

        custom.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-card-title",
                    text:
                        "Custom Accent"
                }
            )
        );

        const a =
            create("input");

        a.type="color";
        a.value =
            getSetting(
                "customA",
                "#5865f2"
            );

        Object.assign(
            a.style,
            {
                width:"100%",
                height:"40px"
            }
        );

        const b =
            create("input");

        b.type="color";
        b.value =
            getSetting(
                "customB",
                "#8b5cf6"
            );

        Object.assign(
            b.style,
            {
                width:"100%",
                height:"40px",
                marginTop:"7px"
            }
        );

        custom.appendChild(a);
        custom.appendChild(b);

        custom.appendChild(
            makeButton(
                "Apply Custom",
                ()=>{
                    document.documentElement.style
                        .setProperty(
                            "--lc-accent",
                            a.value
                        );

                    document.documentElement.style
                        .setProperty(
                            "--lc-accent2",
                            b.value
                        );

                    setSetting(
                        "customA",
                        a.value
                    );

                    setSetting(
                        "customB",
                        b.value
                    );

                    setSetting(
                        "theme",
                        "Custom"
                    );

                    refreshLauncher();

                    notify(
                        "Custom accent applied."
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

    function renderQuickReplies(content) {
        pageHeader(
            content,
            "Quick Replies",
            "Save reusable messages."
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

        const text =
            create(
                "textarea",
                {
                    className:
                        "lc-textarea"
                }
            );

        text.placeholder =
            "Message";

        text.style.minHeight =
            "90px";

        const editor =
            create(
                "div",
                {
                    className:
                        "lc-card"
                }
            );

        editor.appendChild(name);
        editor.appendChild(text);

        editor.appendChild(
            makeButton(
                "Save Reply",
                ()=>{
                    if (
                        !name.value.trim() ||
                        !text.value.trim()
                    ) {
                        notify(
                            "Fill both fields."
                        );

                        return;
                    }

                    const replies =
                        getSetting(
                            "replies",
                            []
                        );

                    replies.push({
                        name:
                            name.value.trim(),
                        text:
                            text.value.trim()
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

        const replies =
            getSetting(
                "replies",
                []
            );

        replies.forEach(
            (reply,index)=>{
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
                                "lc-desc",
                            text:
                                reply.text
                        }
                    )
                );

                card.appendChild(
                    makeButton(
                        "Insert",
                        ()=>insertText(
                            reply.text
                        )
                    )
                );

                card.appendChild(
                    makeButton(
                        "Copy",
                        ()=>{
                            navigator.clipboard?.writeText(
                                reply.text
                            );
                        }
                    )
                );

                card.appendChild(
                    makeButton(
                        "Delete",
                        ()=>{
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
    // TOOLBOX
    // =========================================================

    function renderToolbox(content) {
        pageHeader(
            content,
            "Toolbox",
            "Utilities that run locally in your browser."
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

        const output =
            create(
                "input",
                {
                    className:
                        "lc-input"
                }
            );

        output.readOnly = true;

        timestamp.appendChild(output);

        timestamp.appendChild(
            makeButton(
                "Generate",
                ()=>{
                    output.value =
                        `<t:${Math.floor(
                            Date.now()/1000
                        )}:F>`;
                }
            )
        );

        timestamp.appendChild(
            makeButton(
                "Copy",
                ()=>{
                    navigator.clipboard?.writeText(
                        output.value
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

        const counter =
            create(
                "div",
                {
                    className:
                        "lc-card"
                }
            );

        counter.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-card-title",
                    text:
                        "Text Counter"
                }
            )
        );

        const area =
            create(
                "textarea",
                {
                    className:
                        "lc-textarea"
                }
            );

        area.style.minHeight =
            "130px";

        const result =
            create(
                "div",
                {
                    className:
                        "lc-desc",
                    text:
                        "0 characters • 0 words • 0 lines"
                }
            );

        area.oninput =
            ()=>{
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
                        ? value.split(/\n/).length
                        : 0;

                result.textContent =
                    `${value.length} characters • ${words} words • ${lines} lines`;
            };

        counter.appendChild(area);
        counter.appendChild(result);

        content.appendChild(
            counter
        );

        const json =
            create(
                "div",
                {
                    className:
                        "lc-card"
                }
            );

        json.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-card-title",
                    text:
                        "JSON Formatter"
                }
            )
        );

        const jsonInput =
            create(
                "textarea",
                {
                    className:
                        "lc-textarea"
                }
            );

        jsonInput.style.minHeight =
            "150px";

        jsonInput.placeholder =
            '{"example":true}';

        json.appendChild(
            jsonInput
        );

        json.appendChild(
            makeButton(
                "Format JSON",
                ()=>{
                    try {
                        jsonInput.value =
                            JSON.stringify(
                                JSON.parse(
                                    jsonInput.value
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
            json
        );
    }

    // =========================================================
    // COMMAND PALETTE
    // =========================================================

    function renderPalette(content) {
        pageHeader(
            content,
            "Command Palette",
            "Search LoraCord actions."
        );

        const search =
            create(
                "input",
                {
                    className:
                        "lc-input"
                }
            );

        search.placeholder =
            "Search commands...";

        content.appendChild(
            search
        );

        const list =
            create("div");

        content.appendChild(
            list
        );

        const commands=[
            ["Open Plugins","Plugin manager",()=>openPage("plugins")],
            ["Open Themes","Theme manager",()=>openPage("themes")],
            ["Open Quick Replies","Reply manager",()=>openPage("quick")],
            ["Open Toolbox","Utilities",()=>openPage("toolbox")],
            ["Open Quick CSS","CSS editor",()=>openPage("css")],
            ["Open Wallpaper","Wallpaper",()=>openPage("wallpaper")],
            ["Open Notes","Notes",()=>openPage("notes")],
            ["Toggle FakeNitro","Cosmetic Nitro",()=>{
                setPlugin(
                    "fakeNitro",
                    !getPlugin("fakeNitro")
                );

                applyPlugins();
            }],
            ["Rec Room Theme","Apply Rec Room theme",()=>{
                applyTheme("RecRoom")
            }],
            ["Nitro Theme","Apply Nitro theme",()=>{
                applyTheme("Nitro")
            }],
            ["Random Theme","Pick a random theme",()=>{
                const names =
                    Object.keys(
                        THEMES
                    );

                applyTheme(
                    names[
                        Math.floor(
                            Math.random()*names.length
                        )
                    ]
                );
            }],
            ["Reload Discord","Reload page",()=>{
                location.reload()
            }]
        ];

        const draw=()=>{
            list.innerHTML="";

            const query =
                search.value
                    .toLowerCase()
                    .trim();

            commands
                .filter(
                    command=>
                        !query||
                        command[0]
                            .toLowerCase()
                            .includes(query)||
                        command[1]
                            .toLowerCase()
                            .includes(query)
                )
                .forEach(
                    command=>{
                        const row =
                            create(
                                "div",
                                {
                                    className:
                                        "lc-command"
                                }
                            );

                        row.innerHTML=`
                            <div>
                                <div class="lc-command-name">
                                    ${esc(
                                        command[0]
                                    )}
                                </div>

                                <div class="lc-command-desc">
                                    ${esc(
                                        command[1]
                                    )}
                                </div>
                            </div>
                        `;

                        row.appendChild(
                            makeButton(
                                "Run",
                                command[2]
                            )
                        );

                        list.appendChild(
                            row
                        );
                    }
                );
        };

        search.oninput =
            draw;

        draw();
    }

    // =========================================================
    // CSS / WALLPAPER / NOTES
    // =========================================================

    function renderCSS(content) {
        pageHeader(
            content,
            "Quick CSS",
            "Apply local Discord CSS."
        );

        const editor =
            create(
                "textarea",
                {
                    className:
                        "lc-textarea"
                }
            );

        editor.style.minHeight =
            "470px";

        editor.value =
            getSetting(
                "customCSS",
                ""
            );

        content.appendChild(
            editor
        );

        content.appendChild(
            makeButton(
                "Apply CSS",
                ()=>{
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
                ()=>{
                    document.getElementById(
                        IDS.customCSS
                    )?.remove();

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

    function renderWallpaper(content) {
        pageHeader(
            content,
            "Wallpaper",
            "Use an image URL as a browser-local Discord wallpaper."
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
                "wallpaper",
                ""
            );

        content.appendChild(
            input
        );

        content.appendChild(
            makeButton(
                "Apply Wallpaper",
                ()=>{
                    applyWallpaper(
                        input.value.trim()
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
                ()=>{
                    document.getElementById(
                        IDS.wallpaper
                    )?.remove();

                    setSetting(
                        "wallpaper",
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

    function renderNotes(content) {
        pageHeader(
            content,
            "Notes",
            "Private notes stored locally."
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
            "500px";

        notes.value =
            getSetting(
                "notes",
                ""
            );

        notes.oninput =
            ()=>{
                setSetting(
                    "notes",
                    notes.value
                );
            };

        content.appendChild(
            notes
        );

        content.appendChild(
            makeButton(
                "Copy Notes",
                ()=>{
                    navigator.clipboard?.writeText(
                        notes.value
                    );
                }
            )
        );
    }

    // =========================================================
    // THEME EDITOR
    // =========================================================

    function renderThemeEditor(content) {
        pageHeader(
            content,
            "Theme Editor",
            "Create a custom LoraCord accent."
        );

        const card =
            create(
                "div",
                {
                    className:
                        "lc-card"
                }
            );

        const a =
            create("input");

        a.type =
            "color";

        a.value =
            getSetting(
                "customA",
                "#5865f2"
            );

        Object.assign(
            a.style,
            {
                width:"100%",
                height:"40px"
            }
        );

        const b =
            create("input");

        b.type =
            "color";

        b.value =
            getSetting(
                "customB",
                "#8b5cf6"
            );

        Object.assign(
            b.style,
            {
                width:"100%",
                height:"40px",
                marginTop:"8px"
            }
        );

        card.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-desc",
                    text:
                        "Primary color"
                }
            )
        );

        card.appendChild(a);

        card.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-desc",
                    text:
                        "Secondary color"
                }
            )
        );

        card.appendChild(b);

        card.appendChild(
            makeButton(
                "Save Custom Theme",
                ()=>{
                    document.documentElement
                        .style
                        .setProperty(
                            "--lc-accent",
                            a.value
                        );

                    document.documentElement
                        .style
                        .setProperty(
                            "--lc-accent2",
                            b.value
                        );

                    setSetting(
                        "customA",
                        a.value
                    );

                    setSetting(
                        "customB",
                        b.value
                    );

                    setSetting(
                        "theme",
                        "Custom"
                    );

                    refreshLauncher();

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

    function renderStats(content) {
        pageHeader(
            content,
            "Plugin Stats",
            "LoraCord system information."
        );

        const enabled =
            PLUGINS.filter(
                p=>getPlugin(p.id)
            ).length;

        const reliable =
            PLUGINS.filter(
                p=>p.reliable
            ).length;

        const domBased =
            PLUGINS.length-
            reliable;

        const grid =
            create(
                "div",
                {
                    className:
                        "lc-grid"
                }
            );

        [
            [PLUGINS.length,"Total"],
            [enabled,"Enabled"],
            [reliable,"Reliable"],
            [domBased,"DOM Based"]
        ].forEach(
            ([num,label])=>{
                const stat =
                    create(
                        "div",
                        {
                            className:
                                "lc-stat"
                        }
                    );

                stat.innerHTML=`
                    <div class="lc-stat-number">
                        ${esc(num)}
                    </div>

                    <div class="lc-stat-label">
                        ${esc(label)}
                    </div>
                `;

                grid.appendChild(
                    stat
                );
            }
        );

        content.appendChild(
            grid
        );

        const categories={};

        PLUGINS.forEach(
            plugin=>{
                categories[
                    plugin.category
                ]=
                    (
                        categories[
                            plugin.category
                        ]||0
                    )+1;
            }
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
                        "Categories"
                }
            )
        );

        Object.entries(
            categories
        ).forEach(
            ([key,value])=>{
                const chip =
                    create(
                        "span",
                        {
                            className:
                                "lc-chip",
                            text:
                                `${key}: ${value}`
                        }
                    );

                card.appendChild(
                    chip
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

    function renderDiagnostics(content) {
        pageHeader(
            content,
            "Diagnostics",
            "Check LoraCord's local runtime."
        );

        const checks=[
            ["Document",Boolean(document.body)],
            ["Panel",Boolean(document.getElementById(IDS.panel))],
            ["Launcher",Boolean(document.getElementById(IDS.launcher))],
            ["Feature CSS",Boolean(document.getElementById(IDS.featureStyle))],
            ["Custom CSS",Boolean(document.getElementById(IDS.customCSS))],
            ["Wallpaper",Boolean(document.getElementById(IDS.wallpaper))],
            ["FakeNitro",getPlugin("fakeNitro")],
            ["Discord Host",location.hostname==="discord.com"],
            ["Plugin Count",PLUGINS.length]
        ];

        checks.forEach(
            ([name,value])=>{
                const card =
                    create(
                        "div",
                        {
                            className:
                                "lc-card"
                        }
                    );

                card.innerHTML=`
                    <div class="lc-card-title">
                        ${esc(name)}
                    </div>

                    <div style="
                        color:${
                            value===true
                                ? "#23a55a"
                                : "#b5bac1"
                        };
                        font-size:11px;
                    ">
                        ${esc(value)}
                    </div>
                `;

                content.appendChild(
                    card
                );
            }
        );
    }

    // =========================================================
    // BACKUP
    // =========================================================

    function renderBackup(content) {
        pageHeader(
            content,
            "Backup / Restore",
            "Save or restore your LoraCord configuration."
        );

        const area =
            create(
                "textarea",
                {
                    className:
                        "lc-textarea"
                }
            );

        area.style.minHeight =
            "430px";

        content.appendChild(
            area
        );

        content.appendChild(
            makeButton(
                "Export Settings",
                ()=>{
                    const data={};

                    for(
                        let i=0;
                        i<localStorage.length;
                        i++
                    ){
                        const key =
                            localStorage.key(i);

                        if(
                            key?.startsWith(
                                STORE
                            )
                        ){
                            data[key]=
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
                        "Settings exported."
                    );
                }
            )
        );

        content.appendChild(
            makeButton(
                "Import Settings",
                ()=>{
                    try{
                        const data =
                            JSON.parse(
                                area.value
                            );

                        Object.entries(
                            data
                        ).forEach(
                            ([key,value])=>{
                                if(
                                    key.startsWith(
                                        STORE
                                    )
                                ){
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
                            ()=>location.reload(),
                            400
                        );
                    }catch{
                        notify(
                            "Invalid export."
                        );
                    }
                }
            )
        );
    }

    // =========================================================
    // SETTINGS
    // =========================================================

    function renderSettings(content) {
        pageHeader(
            content,
            "Settings",
            "LoraCord configuration."
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
                        "Quick Controls"
                }
            )
        );

        card.appendChild(
            makeButton(
                "Toggle Glass",
                ()=>{
                    setPlugin(
                        "glass",
                        !getPlugin(
                            "glass"
                        )
                    );

                    applyPlugins();
                }
            )
        );

        card.appendChild(
            makeButton(
                "Toggle Glow",
                ()=>{
                    setPlugin(
                        "glow",
                        !getPlugin(
                            "glow"
                        )
                    );

                    applyPlugins();
                }
            )
        );

        card.appendChild(
            makeButton(
                "Toggle Rounded UI",
                ()=>{
                    setPlugin(
                        "rounded",
                        !getPlugin(
                            "rounded"
                        )
                    );

                    applyPlugins();
                }
            )
        );

        card.appendChild(
            makeButton(
                "Toggle Performance Mode",
                ()=>{
                    setPlugin(
                        "performanceMode",
                        !getPlugin(
                            "performanceMode"
                        )
                    );

                    applyPlugins();
                }
            )
        );

        card.appendChild(
            makeButton(
                "Toggle FakeNitro",
                ()=>{
                    setPlugin(
                        "fakeNitro",
                        !getPlugin(
                            "fakeNitro"
                        )
                    );

                    applyPlugins();
                }
            )
        );

        content.appendChild(
            card
        );

        const reset =
            create(
                "div",
                {
                    className:
                        "lc-card"
                }
            );

        reset.appendChild(
            create(
                "div",
                {
                    className:
                        "lc-card-title",
                    text:
                        "Reset"
                }
            )
        );

        reset.appendChild(
            makeButton(
                "Reset Appearance",
                ()=>{
                    [
                        "glass",
                        "glow",
                        "rounded",
                        "smooth",
                        "compact",
                        "fakeNitro",
                        "fakeBoost"
                    ].forEach(
                        id=>{
                            setPlugin(
                                id,
                                DEFAULTS[id]??false
                            );
                        }
                    );

                    applyTheme(
                        "LoraCord"
                    );

                    applyPlugins();

                    notify(
                        "Appearance reset."
                    );
                }
            )
        );

        reset.appendChild(
            makeButton(
                "Reset Everything",
                ()=>{
                    const keys=[];

                    for(
                        let i=0;
                        i<localStorage.length;
                        i++
                    ){
                        const key =
                            localStorage.key(i);

                        if(
                            key?.startsWith(
                                STORE
                            )
                        ){
                            keys.push(
                                key
                            );
                        }
                    }

                    keys.forEach(
                        key=>
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
    // APPLY PLUGINS
    // =========================================================

    function applyPlugins() {
        rebuildFeatureCSS();

        if(
            getPlugin("performanceMode")||
            getPlugin("powerSave")
        ){
            document.documentElement.style
                .setProperty(
                    "--lc-blur",
                    "0px"
                );
        }else{
            document.documentElement.style
                .setProperty(
                    "--lc-blur",
                    "16px"
                );
        }

        refreshLauncher();
        refreshFakeNitro();
    }

    // =========================================================
    // SAVE / RESTORE
    // =========================================================

    function applySavedCSS() {
        const css =
            getSetting(
                "customCSS",
                ""
            );

        if(!css){
            return;
        }

        let style =
            document.getElementById(
                IDS.customCSS
            );

        if(!style){
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
            css;
    }

    function applySavedWallpaper() {
        const url =
            getSetting(
                "wallpaper",
                ""
            );

        if(url){
            applyWallpaper(
                url
            );
        }
    }

    // =========================================================
    // WATCHER
    // =========================================================

    function startMutationWatcher() {
        const observer =
            new MutationObserver(
                ()=>{
                    if(
                        getPlugin(
                            "fakeNitro"
                        )
                    ){
                        refreshFakeNitro();
                    }
                }
            );

        observer.observe(
            document.body,
            {
                childList:true,
                subtree:true
            }
        );
    }

    // =========================================================
    // SHORTCUTS
    // =========================================================

    function installShortcuts() {
        document.addEventListener(
            "keydown",
            event=>{
                if(
                    event.ctrlKey&&
                    event.shiftKey&&
                    event.key.toLowerCase()==="l"&&
                    getPlugin("shortcut")
                ){
                    event.preventDefault();
                    openPanel();
                }

                if(
                    event.ctrlKey&&
                    event.shiftKey&&
                    event.key.toLowerCase()==="k"&&
                    getPlugin("commandPalette")
                ){
                    event.preventDefault();

                    openPanel();

                    setTimeout(
                        ()=>{
                            openPage(
                                "palette"
                            );
                        },
                        20
                    );
                }

                if(
                    event.key==="Escape"
                ){
                    closePanel();
                }
            }
        );
    }

    // =========================================================
    // CHARACTER COUNTER
    // =========================================================

    function startMessageCounter() {
        if(
            !getPlugin(
                "messageCounter"
            )
        ){
            return;
        }

        const observer =
            new MutationObserver(
                ()=>{
                    const composer =
                        getComposer();

                    if(!composer){
                        return;
                    }

                    let counter =
                        document.getElementById(
                            IDS.counter
                        );

                    if(!counter){
                        counter =
                            create(
                                "div",
                                {
                                    id:
                                        IDS.counter
                                }
                            );

                        Object.assign(
                            counter.style,
                            {
                                position:"fixed",
                                right:"72px",
                                bottom:"26px",
                                zIndex:"2147483646",
                                color:"#777d86",
                                font:"9px Arial,sans-serif",
                                pointerEvents:"none"
                            }
                        );

                        document.body.appendChild(
                            counter
                        );
                    }

                    counter.textContent =
                        String(
                            (
                                composer.textContent||
                                ""
                            ).length
                        );
                }
            );

        observer.observe(
            document.body,
            {
                childList:true,
                subtree:true
            }
        );
    }

    // =========================================================
    // STARTUP
    // =========================================================

    function start() {
        if(!document.body){
            setTimeout(
                start,
                500
            );
            return;
        }

        injectBaseCSS();

        const theme =
            getSetting(
                "theme",
                "LoraCord"
            );

        if(THEMES[theme]){
            applyTheme(theme);
        }else{
            const a =
                getSetting(
                    "customA",
                    "#5865f2"
                );

            const b =
                getSetting(
                    "customB",
                    "#8b5cf6"
                );

            document.documentElement.style
                .setProperty(
                    "--lc-accent",
                    a
                );

            document.documentElement.style
                .setProperty(
                    "--lc-accent2",
                    b
                );
        }

        applySavedCSS();
        applySavedWallpaper();

        createPanel();
        applyPlugins();

        installShortcuts();
        startMutationWatcher();
        startMessageCounter();

        if(
            getPlugin(
                "startupToast"
            )
        ){
            notify(
                `LoraCord ${VERSION} loaded.`
            );
        }

        setInterval(
            ()=>{
                if(
                    !document.getElementById(
                        IDS.panel
                    )
                ){
                    createPanel();
                }

                if(
                    getPlugin(
                        "launcher"
                    )&&
                    !document.getElementById(
                        IDS.launcher
                    )
                ){
                    refreshLauncher();
                }
            },
            2000
        );
    }

    start();

})();
