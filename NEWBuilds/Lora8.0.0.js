// ==UserScript==
// @name         LoraCord
// @namespace    https://loracord.local/
// @version      8.0.0
// @description  LoraCord - expanded Discord customization suite
// @author       LoraCord
// @match        https://discord.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    const VERSION = "8.0.0";
    const STORAGE = "loracord8_";

    const IDS = {
        style: "loracord8-style",
        feature: "loracord8-feature",
        launcher: "loracord8-launcher",
        panel: "loracord8-panel",
        toast: "loracord8-toast",
        wallpaper: "loracord8-wallpaper",
        customCSS: "loracord8-custom-css"
    };

    const state = {
        page: "home",
        pluginQuery: "",
        pluginFilter: "all",
        pluginCategory: "All",
        favoritesOnly: false
    };

    const THEMES = {
        LoraCord: ["#5865f2", "#8b5cf6", "#0d1018", "#24163b"],
        RecRoom: ["#00c8ff", "#765cff", "#04101a", "#29143f"],
        Aurora: ["#00e5ff", "#a05cff", "#061016", "#321744"],
        Crimson: ["#ff4f6d", "#ff9848", "#120507", "#461c20"],
        Emerald: ["#25dd88", "#00bca0", "#051009", "#123c29"],
        Ocean: ["#31b8ff", "#526fff", "#031019", "#113d53"],
        PurpleVoid: ["#a76bff", "#ff4fd8", "#0f0414", "#42154f"],
        Nitro: ["#ff73fa", "#9b6cff", "#110715", "#371950"],
        Monochrome: ["#f2f3f5", "#72767d", "#0b0c0e", "#18191c"]
    };

    /*
     * 100+ plugin catalog
     */
    const PLUGIN_DATA = [
        ["glass","Glass UI","Appearance","Translucent Discord panels."],
        ["animatedBG","Animated Background","Appearance","Animated gradient behind Discord."],
        ["glow","Glow Effects","Appearance","Soft hover glows."],
        ["rounded","Rounded UI","Appearance","Rounds common UI elements."],
        ["smooth","Smooth Animations","Appearance","Smoother client transitions."],
        ["compact","Compact Mode","Appearance","Tighter chat and channel spacing."],
        ["largeAvatars","Large Avatars","Appearance","Slightly enlarges visible avatars."],
        ["focus","Focus Mode","Appearance","Dims distracting interface elements."],
        ["highContrast","High Contrast","Appearance","Increases interface contrast."],
        ["reducedTransparency","Reduced Transparency","Appearance","Reduces translucent surfaces."],
        ["hideDividers","Hide Dividers","Appearance","Reduces visible separators."],
        ["dimInactive","Dim Inactive UI","Appearance","Dims less-important UI."],
        ["softShadows","Soft Shadows","Appearance","Adds subtle shadow depth."],
        ["minimalScrollbars","Minimal Scrollbars","Appearance","Uses slimmer scrollbars."],
        ["messageHover","Message Hover","Messages","Highlights hovered messages."],
        ["messageGlow","Message Glow","Messages","Adds a glow to hovered messages."],
        ["messageBorders","Message Borders","Messages","Adds subtle message separators."],
        ["messageSpacing","Message Spacing","Messages","Adds breathing room between messages."],
        ["timestampGlow","Timestamp Glow","Messages","Highlights timestamps."],
        ["linkGlow","Link Glow","Messages","Highlights links on hover."],
        ["codeGlow","Code Block Glow","Messages","Adds code block glow."],
        ["mentionGlow","Mention Highlight","Messages","Improves mention visibility."],
        ["editedGlow","Edited Highlight","Messages","Highlights edited indicators."],
        ["replyGlow","Reply Highlight","Messages","Highlights reply elements."],
        ["spoilerOutline","Spoiler Outline","Messages","Adds a visible spoiler outline."],
        ["embedGlow","Embed Glow","Messages","Adds subtle embed emphasis."],
        ["attachmentHover","Attachment Hover","Messages","Highlights attachment blocks."],
        ["messageReadability","Message Readability","Messages","Improves message line spacing."],
        ["hideEmoji","Hide Emoji Button","Chat","Hides the emoji control."],
        ["hideSticker","Hide Sticker Button","Chat","Hides the sticker control."],
        ["hideGift","Hide Gift Button","Chat","Hides the gift control."],
        ["largeComposer","Larger Chat Box","Chat","Makes the composer taller."],
        ["composerGlow","Chat Box Glow","Chat","Adds composer focus glow."],
        ["composerBorder","Chat Box Border","Chat","Adds stronger composer borders."],
        ["composerContrast","Chat Box Contrast","Chat","Makes the composer easier to see."],
        ["disableTypingFade","Typing Fade","Chat","Adjusts typing UI visibility."],
        ["quickReplyHints","Quick Reply Hints","Chat","Shows quick-reply hints."],
        ["channelGlow","Channel Glow","Channels","Highlights channels on hover."],
        ["selectedChannel","Selected Channel Glow","Channels","Highlights the active channel."],
        ["channelSpacing","Channel Spacing","Channels","Adds channel spacing."],
        ["hideChannelIcons","Hide Channel Icons","Channels","Dims channel icons."],
        ["channelBorders","Channel Borders","Channels","Adds subtle channel borders."],
        ["channelHoverScale","Channel Hover Scale","Channels","Adds channel hover movement."],
        ["categorySpacing","Category Spacing","Channels","Adds category spacing."],
        ["unreadGlow","Unread Channel Glow","Channels","Highlights unread channels."],
        ["serverGlow","Server Glow","Servers","Glows hovered server icons."],
        ["serverHover","Server Hover","Servers","Adds hover animation to server icons."],
        ["serverScale","Server Hover Scale","Servers","Slight server icon scaling."],
        ["serverDividers","Server Dividers","Servers","Adds sidebar dividers."],
        ["folderGlow","Folder Glow","Servers","Glows server folders."],
        ["selectedServerGlow","Selected Server Glow","Servers","Highlights selected servers."],
        ["hideMembers","Hide Member List","Layout","Hides the member sidebar."],
        ["wideChat","Wide Chat","Layout","Lets chat use more room."],
        ["compactSidebar","Compact Sidebar","Layout","Reduces sidebar spacing."],
        ["wideSidebar","Wide Sidebar","Layout","Gives channel names more room."],
        ["hideTooltips","Reduce Tooltips","Layout","Reduces tooltip clutter."],
        ["centeredChat","Centered Chat","Layout","Centers the message flow slightly."],
        ["dimNitro","Reduce Nitro UI","Interface","Dims Nitro promotional UI."],
        ["dimBoost","Reduce Boost UI","Interface","Dims boost UI."],
        ["dimShop","Reduce Shop UI","Interface","Dims shop UI."],
        ["dimDiscover","Reduce Discover UI","Interface","Dims discover UI."],
        ["fakeNitro","FakeNitro","Interface","Cosmetic Nitro-style visuals only."],
        ["fakeServerBoost","FakeBoost Cosmetic","Interface","Cosmetic boost styling."],
        ["customBadge","Custom Badge","Interface","Adds a local custom badge."],
        ["cleanTopBar","Clean Top Bar","Interface","Reduces top-bar clutter."],
        ["quickReplies","Quick Replies","Tools","Reusable message presets."],
        ["characterCounter","Character Counter","Tools","Shows composer character count."],
        ["timestamps","Timestamp Generator","Tools","Discord timestamp generator."],
        ["copyChannel","Copy Channel URL","Tools","Copies the current channel URL."],
        ["notes","Local Notes","Tools","Private browser-local notes."],
        ["commandPalette","Command Palette","Tools","Searchable command launcher."],
        ["markdownHelper","Markdown Helper","Tools","Quick Discord markdown helpers."],
        ["colorPicker","Color Picker","Tools","Color picker and hex copier."],
        ["jsonFormatter","JSON Formatter","Tools","Formats JSON locally."],
        ["textCounter","Text Counter","Tools","Counts words and characters."],
        ["unicodeTools","Unicode Tools","Tools","Small Unicode helpers."],
        ["clipboardHistory","Clipboard Notes","Tools","Local reusable snippets."],
        ["urlOpener","URL Opener","Tools","Opens pasted URLs."],
        ["recRoom","Rec Room Theme","Themes","Rec Room-inspired appearance."],
        ["aurora","Aurora Theme","Themes","Aurora preset."],
        ["crimson","Crimson Theme","Themes","Crimson preset."],
        ["emerald","Emerald Theme","Themes","Emerald preset."],
        ["ocean","Ocean Theme","Themes","Ocean preset."],
        ["purpleVoid","Purple Void","Themes","Purple preset."],
        ["nitroTheme","Nitro Theme","Themes","Cosmetic Nitro-inspired preset."],
        ["rainbow","Rainbow Mode","Themes","Animated rainbow accents."],
        ["customTheme","Custom Theme","Themes","Build a custom palette."],
        ["imageViewer","Image Viewer","Media","Image hover treatment."],
        ["videoGlow","Video Glow","Media","Highlights media players."],
        ["attachmentGlow","Attachment Glow","Media","Highlights attachments."],
        ["gifGlow","GIF Glow","Media","Highlights GIF content."],
        ["mediaBorders","Media Borders","Media","Adds media borders."],
        ["fontSize","Readable Font","Accessibility","Slightly increases small text."],
        ["lineHeight","Readable Line Height","Accessibility","Improves line spacing."],
        ["contrastBoost","Contrast Boost","Accessibility","Boosts UI contrast."],
        ["focusIndicators","Focus Indicators","Accessibility","Improves keyboard focus visibility."],
        ["reducedMotion","Reduced Motion","Accessibility","Reduces LoraCord animations."],
        ["launcher","LoraCord Launcher","Core","Floating LoraCord launcher."],
        ["shortcut","Keyboard Shortcut","Core","Ctrl+Shift+L opens LoraCord."],
        ["settings","Local Settings","Core","Stores LoraCord settings locally."],
        ["pluginSearch","Plugin Search","Core","Searches plugins."],
        ["favorites","Plugin Favorites","Core","Favorites plugins."],
        ["autoSave","Auto Save","Core","Persists LoraCord settings."],
        ["startupToast","Startup Toast","Core","Shows startup notification."],
        ["safeReset","Safe Reset","Core","Safely resets LoraCord settings."],
        ["themeEditor","Theme Editor","Advanced","Edit accent colors."],
        ["backgroundManager","Background Manager","Advanced","Manage Discord wallpaper."],
        ["cssEditor","CSS Editor","Advanced","Manage custom CSS."],
        ["pluginStats","Plugin Stats","Advanced","Shows plugin statistics."],
        ["exportSettings","Export Settings","Advanced","Exports LoraCord settings."],
        ["importSettings","Import Settings","Advanced","Imports LoraCord settings."],
        ["diagnostics","Diagnostics","Advanced","Shows runtime diagnostics."],
        ["debugPanel","Debug Panel","Advanced","Shows runtime information."],
        ["resetAppearance","Reset Appearance","Advanced","Restores appearance defaults."],
        ["commandHints","Command Hints","Advanced","Shows shortcut hints."],
        ["quickLauncher","Quick Launcher","Advanced","Adds a small quick-actions menu."],
        ["statusWidget","Status Widget","Advanced","Shows local LoraCord status."],
        ["themeHistory","Theme History","Advanced","Stores recent themes."],
        ["pluginHistory","Plugin History","Advanced","Records local plugin changes."],
        ["localProfile","Local Profile","Advanced","Creates a local LoraCord profile."],
        ["startupPage","Startup Page","Advanced","Chooses the opening dashboard page."],
        ["performanceMode","Performance Mode","Advanced","Reduces costly visual effects."],
        ["powerSave","Power Save","Advanced","Reduces animation and effects."],
        ["uiScaler","UI Scaler","Advanced","Scales the LoraCord dashboard."],
        ["customLauncherIcon","Custom Launcher Icon","Advanced","Changes the LoraCord launcher symbol."],
        ["accentPresets","Accent Presets","Advanced","Stores custom accent presets."],
        ["dashboardClock","Dashboard Clock","Advanced","Shows a local clock."],
        ["dashboardDate","Dashboard Date","Advanced","Shows today's date."],
        ["dashboardUptime","Dashboard Uptime","Advanced","Shows LoraCord uptime."],
        ["themeRandomizer","Theme Randomizer","Advanced","Picks a random theme."],
        ["pluginRandomizer","Plugin Randomizer","Advanced","Randomizes cosmetic plugins."]
    ];

    const PLUGINS = PLUGIN_DATA.map(([id,name,category,description]) => ({
        id,name,category,description
    }));

    const DEFAULTS = {};

    PLUGINS.forEach(plugin => {
        DEFAULTS[plugin.id] = false;
    });

    Object.assign(DEFAULTS,{
        glass:true,
        glow:true,
        rounded:true,
        smooth:true,
        messageHover:true,
        linkGlow:true,
        codeGlow:true,
        mentionGlow:true,
        channelGlow:true,
        selectedChannel:true,
        unreadGlow:true,
        serverGlow:true,
        serverHover:true,
        composerGlow:true,
        quickReplies:true,
        characterCounter:true,
        timestamps:true,
        notes:true,
        launcher:true,
        shortcut:true,
        settings:true,
        pluginSearch:true,
        favorites:true,
        autoSave:true,
        startupToast:true
    });

    function getSetting(key,fallback){
        try{
            const raw=localStorage.getItem(STORAGE+key);
            return raw===null?fallback:JSON.parse(raw);
        }catch{
            return fallback;
        }
    }

    function setSetting(key,value){
        try{
            localStorage.setItem(STORAGE+key,JSON.stringify(value));
        }catch{}
    }

    function getPlugin(id){
        return getSetting("plugin_"+id,DEFAULTS[id]??false);
    }

    function setPlugin(id,value){
        setSetting("plugin_"+id,Boolean(value));
    }

    function create(tag,options={}){
        const el=document.createElement(tag);
        if(options.id)el.id=options.id;
        if(options.className)el.className=options.className;
        if(options.text!==undefined)el.textContent=options.text;
        if(options.html!==undefined)el.innerHTML=options.html;
        return el;
    }

    function $(selector,root=document){return root.querySelector(selector)}
    function $$(selector,root=document){return Array.from(root.querySelectorAll(selector))}

    function esc(v){
        return String(v)
            .replaceAll("&","&amp;")
            .replaceAll("<","&lt;")
            .replaceAll(">","&gt;")
            .replaceAll('"',"&quot;")
            .replaceAll("'","&#039;");
    }

    function notify(message){
        let holder=document.getElementById(IDS.toast);
        if(!holder){
            holder=create("div",{id:IDS.toast});
            Object.assign(holder.style,{
                position:"fixed",
                right:"18px",
                bottom:"18px",
                zIndex:"2147483647"
            });
            document.body.appendChild(holder);
        }

        const toast=create("div",{text:message});
        Object.assign(toast.style,{
            padding:"10px 13px",
            marginTop:"7px",
            background:"#18191c",
            color:"#fff",
            border:"1px solid rgba(88,101,242,.45)",
            borderRadius:"9px",
            font:"12px Arial,sans-serif",
            boxShadow:"0 10px 30px rgba(0,0,0,.45)",
            opacity:"0",
            transform:"translateY(8px)",
            transition:".18s ease"
        });

        holder.appendChild(toast);

        requestAnimationFrame(()=>{
            toast.style.opacity="1";
            toast.style.transform="translateY(0)";
        });

        setTimeout(()=>{
            toast.style.opacity="0";
            toast.style.transform="translateY(8px)";
            setTimeout(()=>toast.remove(),220);
        },1800);
    }

    function makeButton(text,callback){
        const b=create("button",{className:"lc-btn",text});
        b.addEventListener("click",e=>{
            e.preventDefault();
            e.stopPropagation();
            callback();
        },true);
        return b;
    }

    function getComposer(){
        return document.querySelector('[role="textbox"]')
            || document.querySelector('[contenteditable="true"]');
    }

    function insertText(text){
        const composer=getComposer();
        if(!composer){
            notify("Open a Discord text channel first.");
            return;
        }
        composer.focus();
        try{
            document.execCommand("insertText",false,text);
            notify("Inserted.");
        }catch{
            notify("Could not insert text.");
        }
    }

    function applyTheme(name){
        const theme=THEMES[name];
        if(!theme)return;

        document.documentElement.style.setProperty("--lc-accent",theme[0]);
        document.documentElement.style.setProperty("--lc-accent2",theme[1]);

        setSetting("theme",name);

        if(getPlugin("animatedBG")){
            document.body.style.background=`linear-gradient(135deg,${theme[2]},${theme[3]},${theme[2]})`;
            document.body.style.backgroundSize="400% 400%";
            document.body.style.animation="lcBG 18s ease infinite";
        }

        const history=getSetting("themeHistory",[]);
        history.unshift(name);
        setSetting("themeHistory",[...new Set(history)].slice(0,10));

        refreshLauncher();
        refreshFakeNitro();

        notify(name+" theme applied.");
    }

    // =========================================================
    // CSS
    // =========================================================

    function injectBaseCSS(){
        if(document.getElementById(IDS.style))return;

        const style=create("style",{id:IDS.style});

        style.textContent=`
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
                0%,100%{box-shadow:0 0 10px rgba(88,101,242,.25)}
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
                background:linear-gradient(135deg,var(--lc-accent),var(--lc-accent2))!important;
                color:white!important;
                font-size:21px!important;
                font-weight:900!important;
                cursor:pointer!important;
                z-index:2147483647!important;
            }

            #${IDS.launcher}.glow{
                animation:lcGlow 3s ease infinite!important;
            }

            #${IDS.launcher}.nitro{
                background:linear-gradient(135deg,#ff73fa,#9b6cff,#5865f2,#ff73fa)!important;
                background-size:300% 300%!important;
                animation:lcNitro 4s ease infinite!important;
                box-shadow:0 0 25px rgba(255,115,250,.5)!important;
            }

            #${IDS.panel}{
                position:fixed!important;
                left:50%!important;
                top:50%!important;
                width:min(1080px,calc(100vw - 24px))!important;
                height:min(730px,calc(100vh - 24px))!important;
                transform:translate(-50%,-50%)!important;
                display:none!important;
                overflow:hidden!important;
                background:#111214!important;
                color:white!important;
                border:1px solid rgba(255,255,255,.08)!important;
                border-radius:16px!important;
                box-shadow:0 25px 100px rgba(0,0,0,.72)!important;
                z-index:2147483646!important;
                font-family:Arial,sans-serif!important;
                pointer-events:auto!important;
            }

            #${IDS.panel}.open{display:flex!important}
            #${IDS.panel} *{box-sizing:border-box}

            .lc-side{
                width:220px;
                flex:0 0 220px;
                background:#0f1012;
                border-right:1px solid rgba(255,255,255,.06);
                display:flex;
                flex-direction:column;
            }

            .lc-brand{
                padding:17px;
                border-bottom:1px solid rgba(255,255,255,.06);
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
                background:linear-gradient(135deg,var(--lc-accent),var(--lc-accent2));
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
                border:1px solid rgba(255,255,255,.07);
                border-radius:8px;
                color:white;
                outline:none;
            }

            .lc-nav{
                padding:0 9px;
                overflow-y:auto;
            }

            .lc-nav-section{
                padding:12px 8px 5px;
                color:#666b73;
                font-size:9px;
                font-weight:900;
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
                font-size:11px;
                font-weight:700;
            }

            .lc-nav-btn:hover,.lc-nav-btn.active{
                background:rgba(88,101,242,.17);
                color:white;
            }

            .lc-side-bottom{
                margin-top:auto;
                padding:10px;
                border-top:1px solid rgba(255,255,255,.06);
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
                border-bottom:1px solid rgba(255,255,255,.06);
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
                background:rgba(255,255,255,.05);
                color:white;
                cursor:pointer;
            }

            .lc-content{
                flex:1;
                overflow-y:auto;
                padding:18px;
            }

            .lc-title{
                font-size:23px;
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
                border:1px solid rgba(255,255,255,.06);
                border-radius:11px;
                background:rgba(255,255,255,.03);
            }

            .lc-card-title{
                font-size:13px;
                font-weight:800;
                margin-bottom:6px;
            }

            .lc-description{
                color:#9297a0;
                font-size:10px;
                line-height:1.45;
                margin-bottom:9px;
            }

            .lc-btn{
                width:100%;
                padding:9px;
                margin-top:6px;
                border:1px solid rgba(255,255,255,.07);
                border-radius:8px;
                background:rgba(255,255,255,.045);
                color:white;
                text-align:left;
                cursor:pointer;
                font-size:11px;
                font-weight:700;
            }

            .lc-btn:hover{
                background:rgba(88,101,242,.16);
                border-color:rgba(88,101,242,.3);
            }

            .lc-input,.lc-plugin-search{
                width:100%;
                padding:10px;
                box-sizing:border-box;
                background:#090a0c;
                border:1px solid rgba(255,255,255,.07);
                border-radius:8px;
                color:white;
                outline:none;
                margin-bottom:8px;
            }

            .lc-textarea{
                width:100%;
                min-height:240px;
                box-sizing:border-box;
                padding:10px;
                background:#090a0c;
                border:1px solid rgba(255,255,255,.07);
                border-radius:8px;
                color:white;
                resize:vertical;
                outline:none;
                font-family:monospace;
                font-size:12px;
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
                font-size:10px;
                font-weight:700;
            }

            .lc-filter.active{
                background:var(--lc-accent);
            }

            .lc-category{
                margin:17px 0 6px;
                color:#727780;
                font-size:9px;
                font-weight:900;
                letter-spacing:1px;
                text-transform:uppercase;
            }

            .lc-plugin{
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:12px;
                padding:11px 0;
                border-bottom:1px solid rgba(255,255,255,.045);
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

            .lc-toggle input:checked+.lc-toggle-track{
                background:var(--lc-accent);
            }

            .lc-toggle input:checked+.lc-toggle-track:before{
                transform:translateX(18px);
            }

            .lc-theme-preview{
                width:100%;
                height:64px;
                border-radius:8px;
                margin-bottom:8px;
            }

            .lc-grid{
                display:grid;
                grid-template-columns:repeat(4,minmax(0,1fr));
                gap:10px;
            }

            .lc-stat{
                padding:12px;
                border:1px solid rgba(255,255,255,.06);
                border-radius:10px;
                background:rgba(255,255,255,.025);
            }

            .lc-stat-number{
                font-size:21px;
                font-weight:900;
            }

            .lc-stat-label{
                font-size:9px;
                color:#777d86;
                margin-top:2px;
            }

            .lc-chip{
                display:inline-block;
                padding:4px 7px;
                margin:3px;
                border-radius:20px;
                background:rgba(88,101,242,.12);
                color:#bec3ff;
                font-size:9px;
            }

            .lc-command{
                display:flex;
                justify-content:space-between;
                gap:10px;
                padding:10px 0;
                border-bottom:1px solid rgba(255,255,255,.04);
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
                display:inline-flex !important;
                align-items:center !important;
                margin-left:6px !important;
                padding:2px 6px !important;
                border-radius:5px !important;
                background:linear-gradient(135deg,#ff73fa,#9b6cff,#5865f2) !important;
                background-size:250% 250% !important;
                color:white !important;
                font-size:8px !important;
                font-weight:900 !important;
                letter-spacing:.4px !important;
                box-shadow:0 0 10px rgba(255,115,250,.35) !important;
                animation:lcNitro 4s ease infinite !important;
                pointer-events:none !important;
            }

            #${IDS.panel}.nitro{
                border-color:rgba(255,115,250,.3)!important;
                box-shadow:0 0 45px rgba(255,115,250,.12)!important;
            }

            @media(max-width:700px){
                .lc-side{width:62px;flex-basis:62px}
                .lc-brand-name,.lc-brand-version,.lc-nav-section{display:none}
                .lc-nav-btn{text-align:center}
                .lc-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
            }
        `;

        document.head.appendChild(style);
    }

    // =========================================================
    // FEATURE ENGINE
    // =========================================================

    function rebuildFeatureCSS(){
        let style=document.getElementById(IDS.feature);

        if(!style){
            style=create("style",{id:IDS.feature});
            document.head.appendChild(style);
        }

        let css="";

        const on=id=>getPlugin(id);

        if(on("glass"))css+=`
            [class*="sidebar"],[class*="guilds"],[class*="panels"]{
                backdrop-filter:blur(var(--lc-blur)) saturate(135%) !important;
            }`;

        if(on("animatedBG"))css+=`
            body{
                background:linear-gradient(135deg,#080a11,#111a31,#2b1340,#071a2b)!important;
                background-size:400% 400%!important;
                animation:lcBG 18s ease infinite!important;
            }`;

        if(on("glow"))css+=`
            button:hover,[role="button"]:hover{
                box-shadow:0 0 14px rgba(88,101,242,.18)!important;
            }`;

        if(on("rounded"))css+=`
            [role="dialog"],[class*="card"],[class*="container"]{
                border-radius:var(--lc-radius)!important;
            }`;

        if(on("smooth"))css+=`
            button,[role="button"],[class*="channel"],[class*="message"]{
                transition:.16s ease!important;
            }`;

        if(on("compact"))css+=`
            [class*="message"]{
                padding-top:3px!important;
                padding-bottom:3px!important;
            }`;

        if(on("largeAvatars"))css+=`
            [class*="avatar"]{transform:scale(1.06)}`;

        if(on("focus"))css+=`
            [class*="promo"],[class*="upsell"],[class*="activity"]{
                opacity:.45!important;
            }`;

        if(on("highContrast")||on("contrastBoost"))css+=`
            body,[class*="container"],[class*="content"]{
                color:rgba(255,255,255,.97)!important;
            }`;

        if(on("reducedTransparency"))css+=`
            [class*="sidebar"],[class*="guilds"],[class*="panels"]{
                backdrop-filter:none!important;
            }`;

        if(on("hideDividers"))css+=`
            [class*="divider"],[class*="separator"]{
                opacity:.25!important;
            }`;

        if(on("dimInactive"))css+=`
            [class*="containerDefault"]:not(:hover){
                opacity:.86!important;
            }`;

        if(on("softShadows"))css+=`
            [class*="card"],[role="dialog"]{
                box-shadow:0 12px 35px rgba(0,0,0,.18);
            }`;

        if(on("minimalScrollbars"))css+=`
            ::-webkit-scrollbar{width:6px;height:6px}
            ::-webkit-scrollbar-thumb{
                background:linear-gradient(var(--lc-accent),var(--lc-accent2));
                border-radius:20px;
            }`;

        if(on("messageHover"))css+=`
            [class*="message"]:hover{
                background:rgba(88,101,242,.055)!important;
            }`;

        if(on("messageGlow"))css+=`
            [class*="message"]:hover{
                box-shadow:inset 3px 0 0 rgba(88,101,242,.5)!important;
            }`;

        if(on("messageBorders"))css+=`
            [class*="message"]{
                border-bottom:1px solid rgba(255,255,255,.025)!important;
            }`;

        if(on("messageSpacing"))css+=`
            [class*="message"]{margin:2px 0!important}`;

        if(on("timestampGlow"))css+=`
            time{text-shadow:0 0 8px rgba(88,101,242,.45)!important}`;

        if(on("linkGlow"))css+=`
            a:hover{text-shadow:0 0 10px rgba(88,101,242,.4)!important}`;

        if(on("codeGlow"))css+=`
            pre,code{box-shadow:0 0 15px rgba(88,101,242,.12)!important}`;

        if(on("mentionGlow"))css+=`
            [class*="mention"]{
                background:rgba(88,101,242,.17)!important;
                border-radius:5px!important;
            }`;

        if(on("editedGlow"))css+=`
            [class*="edited"]{
                text-shadow:0 0 8px rgba(88,101,242,.4)!important;
            }`;

        if(on("replyGlow"))css+=`
            [class*="replied"],[class*="reply"]{
                box-shadow:inset 2px 0 0 var(--lc-accent)!important;
            }`;

        if(on("spoilerOutline"))css+=`
            [class*="spoiler"]{
                outline:1px solid rgba(255,255,255,.15)!important;
            }`;

        if(on("embedGlow"))css+=`
            [class*="embed"]{
                box-shadow:0 0 18px rgba(88,101,242,.1)!important;
            }`;

        if(on("attachmentHover"))css+=`
            [class*="attachment"]:hover{
                transform:translateY(-1px);
            }`;

        if(on("messageReadability"))css+=`
            [class*="messageContent"]{
                line-height:1.55!important;
            }`;

        if(on("hideEmoji"))css+=`
            button[aria-label*="emoji" i]{display:none!important}`;

        if(on("hideSticker"))css+=`
            button[aria-label*="sticker" i]{display:none!important}`;

        if(on("hideGift"))css+=`
            button[aria-label*="gift" i]{display:none!important}`;

        if(on("largeComposer"))css+=`
            [role="textbox"]{min-height:52px!important}`;

        if(on("composerGlow"))css+=`
            [role="textbox"]:focus-within{
                box-shadow:0 0 0 2px rgba(88,101,242,.12),0 0 25px rgba(88,101,242,.12)!important;
            }`;

        if(on("composerBorder"))css+=`
            [role="textbox"]{
                border:1px solid rgba(88,101,242,.25)!important;
            }`;

        if(on("composerContrast"))css+=`
            [role="textbox"]{
                background:rgba(7,10,16,.8)!important;
            }`;

        if(on("channelGlow"))css+=`
            [class*="containerDefault"]:hover{
                box-shadow:inset 2px 0 0 rgba(88,101,242,.5)!important;
            }`;

        if(on("selectedChannel"))css+=`
            [class*="modeSelected"]{
                box-shadow:inset 3px 0 0 var(--lc-accent)!important;
            }`;

        if(on("channelSpacing"))css+=`
            [class*="containerDefault"]{margin:2px 0!important}`;

        if(on("hideChannelIcons"))css+=`
            [class*="containerDefault"] svg{opacity:.55!important}`;

        if(on("channelBorders"))css+=`
            [class*="containerDefault"]{
                border-bottom:1px solid rgba(255,255,255,.02)!important;
            }`;

        if(on("channelHoverScale"))css+=`
            [class*="containerDefault"]:hover{
                transform:translateX(2px);
            }`;

        if(on("categorySpacing"))css+=`
            [class*="containerDefault"]{margin-top:2px!important}`;

        if(on("unreadGlow"))css+=`
            [class*="unread"]{
                text-shadow:0 0 8px rgba(88,101,242,.45)!important;
            }`;

        if(on("serverGlow"))css+=`
            [class*="listItem"]:hover{
                filter:drop-shadow(0 0 8px rgba(88,101,242,.5));
            }`;

        if(on("serverHover"))css+=`
            [class*="listItem"]:hover{
                transform:translateY(-1px);
            }`;

        if(on("serverScale"))css+=`
            [class*="listItem"]:hover{
                transform:scale(1.04);
            }`;

        if(on("serverDividers"))css+=`
            [class*="guilds"]{
                border-right:1px solid rgba(255,255,255,.05)!important;
            }`;

        if(on("folderGlow"))css+=`
            [class*="folder"]:hover{
                box-shadow:0 0 12px rgba(88,101,242,.25)!important;
            }`;

        if(on("selectedServerGlow"))css+=`
            [class*="selected"]{
                filter:drop-shadow(0 0 7px rgba(88,101,242,.35));
            }`;

        if(on("hideMembers"))css+=`
            [class*="membersWrap"]{display:none!important}`;

        if(on("wideSidebar"))css+=`
            [class*="sidebar"]{min-width:260px!important}`;

        if(on("compactSidebar"))css+=`
            [class*="containerDefault"]{
                padding-top:2px!important;
                padding-bottom:2px!important;
            }`;

        if(on("wideChat"))css+=`
            [class*="chatContent"]{max-width:none!important}`;

        if(on("hideTooltips"))css+=`
            [role="tooltip"]{opacity:.8!important}`;

        if(on("centeredChat"))css+=`
            [class*="message"]{
                max-width:95%!important;
                margin-left:auto!important;
                margin-right:auto!important;
            }`;

        if(on("dimNitro"))css+=`
            [class*="premium"]{opacity:.4!important}`;

        if(on("dimBoost"))css+=`
            [class*="boost"]{opacity:.45!important}`;

        if(on("dimShop"))css+=`
            [class*="shop"]{opacity:.5!important}`;

        if(on("dimDiscover"))css+=`
            [class*="discover"]{opacity:.5!important}`;

        if(on("videoGlow"))css+=`
            video{box-shadow:0 0 18px rgba(88,101,242,.12)!important}`;

        if(on("attachmentGlow"))css+=`
            [class*="attachment"]{
                box-shadow:0 0 14px rgba(88,101,242,.1)!important;
            }`;

        if(on("gifGlow"))css+=`
            img[src*="gif" i]{
                box-shadow:0 0 14px rgba(88,101,242,.1)!important;
            }`;

        if(on("mediaBorders"))css+=`
            img,video{
                border:1px solid rgba(255,255,255,.04)!important;
            }`;

        if(on("fontSize"))css+=`
            [class*="messageContent"],[class*="username"]{
                font-size:1.03em!important;
            }`;

        if(on("lineHeight"))css+=`
            [class*="messageContent"]{
                line-height:1.6!important;
            }`;

        if(on("focusIndicators"))css+=`
            button:focus-visible,[role="button"]:focus-visible{
                outline:2px solid var(--lc-accent)!important;
                outline-offset:2px!important;
            }`;

        if(on("reducedMotion"))css+=`
            *,*:before,*:after{
                animation-duration:.001ms!important;
                animation-iteration-count:1!important;
                transition-duration:.001ms!important;
            }`;

        style.textContent=css;
    }

    function refreshLauncher(){
        document.getElementById(IDS.launcher)?.remove();
        if(!getPlugin("launcher"))return;

        const b=create("button",{id:IDS.launcher,text:getSetting("launcherIcon","✦")});

        if(getPlugin("fakeNitro"))b.classList.add("nitro");
        else if(getPlugin("glow"))b.classList.add("glow");

        b.title="LoraCord";
        b.onclick=openPanel;

        document.body.appendChild(b);
    }

    function refreshFakeNitro(){
        const enabled=getPlugin("fakeNitro");
        const panel=document.getElementById(IDS.panel);
        panel?.classList.toggle("nitro",enabled);

        document.querySelectorAll(".loracord-fake-nitro-badge").forEach(e=>e.remove());

        if(!enabled)return;

        addFakeNitroBadges();
    }

    function addFakeNitroBadges(){
        if(!getPlugin("fakeNitro"))return;

        const targets=[
            ...$$('[class*="premium"]'),
            ...$$('[class*="nitro"]'),
            ...$$('[aria-label*="Nitro" i]')
        ];

        targets.slice(0,15).forEach(target=>{
            if(target.querySelector(".loracord-fake-nitro-badge"))return;

            target.appendChild(
                create("span",{
                    className:"loracord-fake-nitro-badge",
                    text:"✦ NITRO"
                })
            );
        });
    }

    // =========================================================
    // PANEL
    // =========================================================

    function createPanel(){
        if(document.getElementById(IDS.panel))return;

        const panel=create("div",{id:IDS.panel});

        panel.innerHTML=`
            <div class="lc-side">
                <div class="lc-brand">
                    <div class="lc-brand-row">
                        <div class="lc-logo">L</div>
                        <div>
                            <div class="lc-brand-name">LoraCord</div>
                            <div class="lc-brand-version">v${VERSION}</div>
                        </div>
                    </div>
                </div>

                <input id="lcSearch" class="lc-search" placeholder="Search LoraCord...">

                <div class="lc-nav">

                    <div class="lc-nav-section">General</div>
                    <button class="lc-nav-btn active" data-page="home">⌂ Home</button>
                    <button class="lc-nav-btn" data-page="plugins">🧩 Plugins</button>
                    <button class="lc-nav-btn" data-page="themes">🎨 Themes</button>

                    <div class="lc-nav-section">Tools</div>
                    <button class="lc-nav-btn" data-page="quick">⚡ Quick Replies</button>
                    <button class="lc-nav-btn" data-page="toolbox">🧰 Toolbox</button>
                    <button class="lc-nav-btn" data-page="palette">⌘ Command Palette</button>
                    <button class="lc-nav-btn" data-page="css">⌘ Quick CSS</button>
                    <button class="lc-nav-btn" data-page="wallpaper">🖼 Wallpaper</button>
                    <button class="lc-nav-btn" data-page="notes">📝 Notes</button>

                    <div class="lc-nav-section">Advanced</div>
                    <button class="lc-nav-btn" data-page="editor">🎛 Theme Editor</button>
                    <button class="lc-nav-btn" data-page="stats">📊 Plugin Stats</button>
                    <button class="lc-nav-btn" data-page="diagnostics">🩺 Diagnostics</button>
                    <button class="lc-nav-btn" data-page="import">⇄ Import / Export</button>

                    <div class="lc-nav-section">System</div>
                    <button class="lc-nav-btn" data-page="settings">⚙ Settings</button>
                </div>

                <div class="lc-side-bottom">LoraCord ${VERSION}</div>
            </div>

            <div class="lc-main">
                <div class="lc-top">
                    <div class="lc-top-title" id="lcPageTitle">Home</div>
                    <div class="lc-top-actions">
                        <button class="lc-top-btn" id="lcReload">↻</button>
                        <button class="lc-top-btn" id="lcClose">×</button>
                    </div>
                </div>

                <div class="lc-content" id="lcContent"></div>
            </div>
        `;

        document.body.appendChild(panel);

        /*
         * Event delegation fixes the navigation issue.
         */
        panel.addEventListener("click",(event)=>{
            const button=event.target.closest(".lc-nav-btn");

            if(!button||!panel.contains(button))return;

            event.preventDefault();
            event.stopPropagation();

            $$(".lc-nav-btn",panel).forEach(b=>b.classList.remove("active"));
            button.classList.add("active");

            state.page=button.dataset.page;

            const title=$("#lcPageTitle",panel);
            if(title)title.textContent=button.textContent.trim();

            renderPage(state.page);
        },true);

        $("#lcClose",panel).addEventListener("click",()=>{
            panel.classList.remove("open");
        });

        $("#lcReload",panel).addEventListener("click",()=>{
            location.reload();
        });

        $("#lcSearch",panel).addEventListener("input",()=>{
            const q=$("#lcSearch",panel).value.trim();
            if(!q)return;

            openPage("plugins");

            setTimeout(()=>{
                const search=document.getElementById("lcPluginSearch");
                if(search){
                    search.value=q;
                    search.dispatchEvent(new Event("input",{bubbles:true}));
                }
            },30);
        });

        renderPage("home");
    }

    function openPanel(){
        if(!document.getElementById(IDS.panel))createPanel();
        document.getElementById(IDS.panel).classList.add("open");
    }

    function closePanel(){
        document.getElementById(IDS.panel)?.classList.remove("open");
    }

    function openPage(page){
        const panel=document.getElementById(IDS.panel);
        const button=panel?.querySelector(`[data-page="${page}"]`);
        button?.click();
    }

    // =========================================================
    // RENDERING
    // =========================================================

    function pageHeader(content,title,subtitle){
        content.appendChild(create("div",{className:"lc-title",text:title}));
        content.appendChild(create("div",{className:"lc-sub",text:subtitle}));
    }

    function renderPage(page){
        const content=document.getElementById("lcContent");
        if(!content)return;

        content.innerHTML="";

        switch(page){
            case "home":renderHome(content);break;
            case "plugins":renderPlugins(content);break;
            case "themes":renderThemes(content);break;
            case "quick":renderQuick(content);break;
            case "toolbox":renderToolbox(content);break;
            case "palette":renderPalette(content);break;
            case "css":renderCSS(content);break;
            case "wallpaper":renderWallpaper(content);break;
            case "notes":renderNotes(content);break;
            case "editor":renderEditor(content);break;
            case "stats":renderStats(content);break;
            case "diagnostics":renderDiagnostics(content);break;
            case "import":renderImport(content);break;
            case "settings":renderSettings(content);break;
            default:renderHome(content);
        }

        refreshFakeNitro();
    }

    function renderHome(content){
        pageHeader(content,"LoraCord","Your Discord customization center.");

        const enabled=PLUGINS.filter(p=>getPlugin(p.id)).length;

        const grid=create("div",{className:"lc-grid"});

        [
            [PLUGINS.length,"Plugins"],
            [enabled,"Enabled"],
            [Object.keys(THEMES).length,"Themes"],
            [VERSION,"Version"]
        ].forEach(([number,label])=>{
            const stat=create("div",{className:"lc-stat"});
            stat.innerHTML=`
                <div class="lc-stat-number">${esc(number)}</div>
                <div class="lc-stat-label">${esc(label)}</div>
            `;
            grid.appendChild(stat);
        });

        content.appendChild(grid);

        const actions=create("div",{className:"lc-card"});
        actions.appendChild(create("div",{className:"lc-card-title",text:"Quick Actions"}));
        actions.appendChild(makeButton("🧩 Plugins",()=>openPage("plugins")));
        actions.appendChild(makeButton("🎨 Rec Room",()=>applyTheme("RecRoom")));
        actions.appendChild(makeButton("💎 FakeNitro",()=>{
            setPlugin("fakeNitro",!getPlugin("fakeNitro"));
            refreshFakeNitro();
            refreshLauncher();
        }));
        actions.appendChild(makeButton("⌘ Command Palette",()=>openPage("palette")));
        actions.appendChild(makeButton("📊 Plugin Statistics",()=>openPage("stats")));
        content.appendChild(actions);

        const activity=create("div",{className:"lc-card"});
        activity.appendChild(create("div",{className:"lc-card-title",text:"Recent Themes"}));

        getSetting("themeHistory",[]).slice(0,6).forEach(theme=>{
            activity.appendChild(create("span",{className:"lc-chip",text:theme}));
        });

        content.appendChild(activity);
    }

    function renderPlugins(content){
        pageHeader(content,"Plugins",`${PLUGINS.length} LoraCord plugins`);

        const search=create("input",{id:"lcPluginSearch",className:"lc-plugin-search"});
        search.placeholder="Search plugins...";
        search.value=state.pluginQuery;

        search.oninput=()=>{
            state.pluginQuery=search.value;
            renderPlugins(content);
        };

        content.appendChild(search);

        const filters=create("div",{className:"lc-filters"});

        [
            ["all","All"],
            ["enabled","Enabled"],
            ["disabled","Disabled"]
        ].forEach(([id,label])=>{
            const b=create("button",{
                className:"lc-filter"+(state.pluginFilter===id?" active":""),
                text:label
            });
            b.onclick=()=>{
                state.pluginFilter=id;
                renderPlugins(content);
            };
            filters.appendChild(b);
        });

        [...new Set(["All",...PLUGINS.map(p=>p.category)])].forEach(category=>{
            const b=create("button",{
                className:"lc-filter"+(state.pluginCategory===category?" active":""),
                text:category
            });

            b.onclick=()=>{
                state.pluginCategory=category;
                renderPlugins(content);
            };

            filters.appendChild(b);
        });

        const favorite=create("button",{
            className:"lc-filter"+(state.favoritesOnly?" active":""),
            text:"★ Favorites"
        });

        favorite.onclick=()=>{
            state.favoritesOnly=!state.favoritesOnly;
            renderPlugins(content);
        };

        filters.appendChild(favorite);

        content.appendChild(filters);

        const query=state.pluginQuery.toLowerCase().trim();

        const filtered=PLUGINS.filter(plugin=>{
            const matchesQuery=
                !query||
                plugin.name.toLowerCase().includes(query)||
                plugin.description.toLowerCase().includes(query);

            const matchesCategory=
                state.pluginCategory==="All"||
                plugin.category===state.pluginCategory;

            const enabled=getPlugin(plugin.id);

            const matchesState=
                state.pluginFilter==="all"||
                (state.pluginFilter==="enabled"&&enabled)||
                (state.pluginFilter==="disabled"&&!enabled);

            const matchesFavorite=
                !state.favoritesOnly||
                getSetting("favorite_"+plugin.id,false);

            return matchesQuery&&matchesCategory&&matchesState&&matchesFavorite;
        });

        const groups={};

        filtered.forEach(plugin=>{
            (groups[plugin.category]??=[]).push(plugin);
        });

        Object.entries(groups).forEach(([category,plugins])=>{
            content.appendChild(create("div",{className:"lc-category",text:category}));

            plugins.forEach(plugin=>{
                const row=create("div",{className:"lc-plugin"});
                const info=create("div");

                info.innerHTML=`
                    <div class="lc-plugin-name">${esc(plugin.name)}</div>
                    <div class="lc-plugin-description">${esc(plugin.description)}</div>
                `;

                const controls=create("div",{style:{
                    display:"flex",
                    alignItems:"center",
                    gap:"6px"
                }});

                const fav=create("button",{
                    className:"lc-filter",
                    text:getSetting("favorite_"+plugin.id,false)?"★":"☆"
                });

                fav.onclick=()=>{
                    setSetting(
                        "favorite_"+plugin.id,
                        !getSetting("favorite_"+plugin.id,false)
                    );
                    renderPlugins(content);
                };

                const infoButton=create("button",{
                    className:"lc-filter",
                    text:"Info"
                });

                infoButton.onclick=()=>{
                    showPluginInfo(plugin);
                };

                const toggle=create("label",{className:"lc-toggle"});
                const input=create("input");
                const track=create("span",{className:"lc-toggle-track"});

                input.type="checkbox";
                input.checked=getPlugin(plugin.id);

                input.onchange=()=>{
                    setPlugin(plugin.id,input.checked);

                    if(getPlugin("autoSave")){
                        setSetting(
                            "pluginHistory",
                            [
                                {
                                    plugin:plugin.name,
                                    enabled:input.checked,
                                    time:new Date().toISOString()
                                },
                                ...getSetting("pluginHistory",[])
                            ].slice(0,50)
                        );
                    }

                    rebuildFeatureCSS();
                    refreshLauncher();
                    refreshFakeNitro();

                    notify(
                        plugin.name+
                        (input.checked?" enabled.":" disabled.")
                    );
                };

                toggle.appendChild(input);
                toggle.appendChild(track);

                controls.appendChild(fav);
                controls.appendChild(infoButton);
                controls.appendChild(toggle);

                row.appendChild(info);
                row.appendChild(controls);

                content.appendChild(row);
            });
        });

        if(!filtered.length){
            content.appendChild(create("div",{
                text:"No plugins found.",
                style:{
                    padding:"35px",
                    textAlign:"center",
                    color:"#9297a0"
                }
            }));
        }
    }

    function showPluginInfo(plugin){
        const overlay=create("div");
        Object.assign(overlay.style,{
            position:"fixed",
            inset:"0",
            zIndex:"2147483647",
            background:"rgba(0,0,0,.62)",
            display:"grid",
            placeItems:"center"
        });

        const card=create("div");
        Object.assign(card.style,{
            width:"min(540px,calc(100vw - 30px))",
            padding:"20px",
            background:"#18191c",
            color:"white",
            border:"1px solid rgba(255,255,255,.08)",
            borderRadius:"14px",
            boxShadow:"0 20px 70px rgba(0,0,0,.65)",
            fontFamily:"Arial,sans-serif"
        });

        card.innerHTML=`
            <div style="font-size:20px;font-weight:900">${esc(plugin.name)}</div>
            <div style="color:#777d86;font-size:10px;margin-top:3px">${esc(plugin.category)}</div>
            <div style="color:#b0b5bd;font-size:12px;line-height:1.5;margin-top:15px">${esc(plugin.description)}</div>
        `;

        card.appendChild(makeButton("Toggle",()=>{
            setPlugin(plugin.id,!getPlugin(plugin.id));
            rebuildFeatureCSS();
            refreshLauncher();
            refreshFakeNitro();
            overlay.remove();
        }));

        card.appendChild(makeButton("Close",()=>overlay.remove()));

        overlay.appendChild(card);
        document.body.appendChild(overlay);
    }

    function renderThemes(content){
        pageHeader(content,"Themes","LoraCord theme manager.");

        Object.entries(THEMES).forEach(([name,theme])=>{
            const card=create("div",{className:"lc-card"});

            const preview=create("div",{className:"lc-theme-preview"});
            preview.style.background=
                `linear-gradient(135deg,${theme[0]},${theme[1]})`;

            card.appendChild(preview);
            card.appendChild(create("div",{className:"lc-card-title",text:name}));
            card.appendChild(makeButton("Apply",()=>applyTheme(name)));

            content.appendChild(card);
        });

        const custom=create("div",{className:"lc-card"});
        custom.appendChild(create("div",{className:"lc-card-title",text:"Custom Accent"}));

        const a=create("input");
        a.type="color";
        a.value=getSetting("customA","#5865f2");
        Object.assign(a.style,{width:"100%",height:"38px"});

        const b=create("input");
        b.type="color";
        b.value=getSetting("customB","#8b5cf6");
        Object.assign(b.style,{width:"100%",height:"38px",marginTop:"7px"});

        custom.appendChild(a);
        custom.appendChild(b);

        custom.appendChild(makeButton("Apply Custom",()=>{
            document.documentElement.style.setProperty("--lc-accent",a.value);
            document.documentElement.style.setProperty("--lc-accent2",b.value);

            setSetting("customA",a.value);
            setSetting("customB",b.value);

            notify("Custom accent applied.");
        }));

        content.appendChild(custom);
    }

    function renderQuick(content){
        pageHeader(content,"Quick Replies","Save reusable Discord messages.");

        const name=create("input",{className:"lc-input"});
        name.placeholder="Reply name";

        const message=create("textarea",{className:"lc-textarea"});
        message.style.minHeight="100px";
        message.placeholder="Message";

        const editor=create("div",{className:"lc-card"});
        editor.appendChild(name);
        editor.appendChild(message);

        editor.appendChild(makeButton("Save Reply",()=>{
            if(!name.value.trim()||!message.value.trim()){
                notify("Fill both fields.");
                return;
            }

            const replies=getSetting("replies",[]);
            replies.push({
                name:name.value.trim(),
                text:message.value.trim()
            });

            setSetting("replies",replies);
            renderQuick(content);
            notify("Reply saved.");
        }));

        content.appendChild(editor);

        const replies=getSetting("replies",[]);

        replies.forEach((reply,index)=>{
            const card=create("div",{className:"lc-card"});

            card.appendChild(create("div",{
                className:"lc-card-title",
                text:reply.name
            }));

            card.appendChild(create("div",{
                className:"lc-description",
                text:reply.text
            }));

            card.appendChild(makeButton("Insert",()=>insertText(reply.text)));
            card.appendChild(makeButton("Copy",()=>navigator.clipboard?.writeText(reply.text)));
            card.appendChild(makeButton("Delete",()=>{
                replies.splice(index,1);
                setSetting("replies",replies);
                renderQuick(content);
            }));

            content.appendChild(card);
        });
    }

    function renderToolbox(content){
        pageHeader(content,"Toolbox","Utilities for Discord and LoraCord.");

        const timestamp=create("div",{className:"lc-card"});
        timestamp.appendChild(create("div",{className:"lc-card-title",text:"Timestamp Generator"}));

        const ts=create("input",{className:"lc-input"});
        ts.readOnly=true;

        timestamp.appendChild(ts);

        timestamp.appendChild(makeButton("Generate",()=>{
            ts.value=`<t:${Math.floor(Date.now()/1000)}:F>`;
        }));

        timestamp.appendChild(makeButton("Copy",()=>{
            navigator.clipboard?.writeText(ts.value);
        }));

        content.appendChild(timestamp);

        const counter=create("div",{className:"lc-card"});
        counter.appendChild(create("div",{className:"lc-card-title",text:"Text Counter"}));

        const text=create("textarea",{className:"lc-textarea"});
        text.style.minHeight="130px";

        const result=create("div",{
            className:"lc-description",
            text:"0 characters • 0 words"
        });

        text.oninput=()=>{
            const value=text.value;
            const words=value.trim()?value.trim().split(/\s+/).length:0;
            result.textContent=
                `${value.length} characters • ${words} words`;
        };

        counter.appendChild(text);
        counter.appendChild(result);

        content.appendChild(counter);

        const json=create("div",{className:"lc-card"});
        json.appendChild(create("div",{className:"lc-card-title",text:"JSON Formatter"}));

        const input=create("textarea",{className:"lc-textarea"});
        input.style.minHeight="150px";
        input.placeholder='{"example":true}';

        json.appendChild(input);

        json.appendChild(makeButton("Format JSON",()=>{
            try{
                input.value=JSON.stringify(
                    JSON.parse(input.value),
                    null,
                    2
                );
                notify("JSON formatted.");
            }catch{
                notify("Invalid JSON.");
            }
        }));

        content.appendChild(json);

        const color=create("div",{className:"lc-card"});
        color.appendChild(create("div",{className:"lc-card-title",text:"Color Picker"}));

        const picker=create("input");
        picker.type="color";
        picker.value="#5865f2";
        Object.assign(picker.style,{
            width:"100%",
            height:"42px"
        });

        color.appendChild(picker);
        color.appendChild(
            makeButton("Copy Hex",()=>{
                navigator.clipboard?.writeText(picker.value);
                notify(picker.value+" copied.");
            })
        );

        content.appendChild(color);
    }

    function renderPalette(content){
        pageHeader(content,"Command Palette","Search and launch LoraCord actions.");

        const search=create("input",{className:"lc-input"});
        search.placeholder="Search commands...";
        content.appendChild(search);

        const commands=[
            ["Open Plugins","Plugin manager",()=>openPage("plugins")],
            ["Open Themes","Theme manager",()=>openPage("themes")],
            ["Open Quick Replies","Reply manager",()=>openPage("quick")],
            ["Open Toolbox","Utilities",()=>openPage("toolbox")],
            ["Open Quick CSS","CSS editor",()=>openPage("css")],
            ["Open Wallpaper","Wallpaper manager",()=>openPage("wallpaper")],
            ["Open Notes","Local notes",()=>openPage("notes")],
            ["Theme Editor","Accent editor",()=>openPage("editor")],
            ["Plugin Statistics","Plugin stats",()=>openPage("stats")],
            ["Diagnostics","Runtime diagnostics",()=>openPage("diagnostics")],
            ["Toggle FakeNitro","Cosmetic Nitro",()=>{
                setPlugin("fakeNitro",!getPlugin("fakeNitro"));
                refreshFakeNitro();
                refreshLauncher();
            }],
            ["Rec Room Theme","Rec Room appearance",()=>applyTheme("RecRoom")],
            ["Nitro Theme","Nitro appearance",()=>applyTheme("Nitro")],
            ["Random Theme","Random theme",()=>{
                const names=Object.keys(THEMES);
                applyTheme(names[Math.floor(Math.random()*names.length)]);
            }],
            ["Reload Discord","Reload Discord",()=>location.reload()]
        ];

        const list=create("div");
        content.appendChild(list);

        function draw(){
            list.innerHTML="";
            const q=search.value.toLowerCase().trim();

            commands
                .filter(c=>!q||c[0].toLowerCase().includes(q)||c[1].toLowerCase().includes(q))
                .forEach(command=>{
                    const row=create("div",{className:"lc-command"});

                    row.innerHTML=`
                        <div>
                            <div class="lc-command-name">${esc(command[0])}</div>
                            <div class="lc-command-desc">${esc(command[1])}</div>
                        </div>
                    `;

                    row.appendChild(
                        makeButton("Run",command[2])
                    );

                    list.appendChild(row);
                });
        }

        search.oninput=draw;
        draw();
    }

    function renderCSS(content){
        pageHeader(content,"Quick CSS","Create local Discord CSS.");

        const editor=create("textarea",{className:"lc-textarea"});
        editor.style.minHeight="470px";
        editor.value=getSetting("css","");

        content.appendChild(editor);

        content.appendChild(makeButton("Apply CSS",()=>{
            let style=document.getElementById(IDS.customCSS);

            if(!style){
                style=create("style",{id:IDS.customCSS});
                document.head.appendChild(style);
            }

            style.textContent=editor.value;
            setSetting("css",editor.value);

            notify("CSS applied.");
        }));

        content.appendChild(makeButton("Clear CSS",()=>{
            document.getElementById(IDS.customCSS)?.remove();
            setSetting("css","");
            editor.value="";
            notify("CSS cleared.");
        }));
    }

    function applyWallpaper(url){
        if(!url){
            notify("Enter an image URL.");
            return;
        }

        let layer=document.getElementById(IDS.wallpaper);

        if(!layer){
            layer=create("div",{id:IDS.wallpaper});

            Object.assign(layer.style,{
                position:"fixed",
                inset:"0",
                pointerEvents:"none",
                zIndex:"0",
                backgroundSize:"cover",
                backgroundPosition:"center",
                backgroundRepeat:"no-repeat",
                opacity:"0.25"
            });

            document.body.appendChild(layer);
        }

        layer.style.backgroundImage=
            `url("${url.replaceAll('"','\\"')}")`;

        setSetting("wallpaperURL",url);
        notify("Wallpaper applied.");
    }

    function renderWallpaper(content){
        pageHeader(content,"Wallpaper","Use your own browser-local Discord wallpaper.");

        const input=create("input",{className:"lc-input"});
        input.placeholder="Direct image URL";
        input.value=getSetting("wallpaperURL","");

        content.appendChild(input);

        content.appendChild(
            makeButton(
                "Apply Wallpaper",
                ()=>applyWallpaper(input.value.trim())
            )
        );

        content.appendChild(
            makeButton(
                "Remove Wallpaper",
                ()=>{
                    document.getElementById(IDS.wallpaper)?.remove();
                    setSetting("wallpaperURL","");
                    input.value="";
                    notify("Wallpaper removed.");
                }
            )
        );
    }

    function renderNotes(content){
        pageHeader(content,"Notes","Private local notes.");

        const notes=create("textarea",{className:"lc-textarea"});
        notes.style.minHeight="500px";
        notes.value=getSetting("notes","");

        notes.oninput=()=>{
            setSetting("notes",notes.value);
        };

        content.appendChild(notes);
        content.appendChild(makeButton("Copy Notes",()=>{
            navigator.clipboard?.writeText(notes.value);
        }));
    }

    function renderEditor(content){
        pageHeader(content,"Theme Editor","Build your own LoraCord accent.");

        const a=create("input");
        a.type="color";
        a.value=getSetting("customA","#5865f2");
        Object.assign(a.style,{width:"100%",height:"40px"});

        const b=create("input");
        b.type="color";
        b.value=getSetting("customB","#8b5cf6");
        Object.assign(b.style,{width:"100%",height:"40px",marginTop:"7px"});

        const card=create("div",{className:"lc-card"});
        card.appendChild(create("div",{className:"lc-card-title",text:"Accent One"}));
        card.appendChild(a);
        card.appendChild(create("div",{className:"lc-card-title",text:"Accent Two",style:{marginTop:"10px"}}));
        card.appendChild(b);

        card.appendChild(makeButton("Save Custom Theme",()=>{
            setSetting("customA",a.value);
            setSetting("customB",b.value);

            document.documentElement.style.setProperty("--lc-accent",a.value);
            document.documentElement.style.setProperty("--lc-accent2",b.value);

            refreshLauncher();
            notify("Custom theme saved.");
        }));

        content.appendChild(card);
    }

    function renderStats(content){
        pageHeader(content,"Plugin Statistics","LoraCord plugin information.");

        const enabled=PLUGINS.filter(p=>getPlugin(p.id)).length;
        const disabled=PLUGINS.length-enabled;

        const grid=create("div",{className:"lc-grid"});

        [
            [PLUGINS.length,"Total"],
            [enabled,"Enabled"],
            [disabled,"Disabled"],
            [Object.keys(THEMES).length,"Themes"]
        ].forEach(([n,l])=>{
            const card=create("div",{className:"lc-stat"});
            card.innerHTML=`
                <div class="lc-stat-number">${esc(n)}</div>
                <div class="lc-stat-label">${esc(l)}</div>
            `;
            grid.appendChild(card);
        });

        content.appendChild(grid);

        const categories={};

        PLUGINS.forEach(plugin=>{
            categories[plugin.category]=
                (categories[plugin.category]||0)+1;
        });

        const card=create("div",{className:"lc-card"});
        card.appendChild(create("div",{className:"lc-card-title",text:"Categories"}));

        Object.entries(categories).forEach(([name,count])=>{
            card.appendChild(
                create("span",{
                    className:"lc-chip",
                    text:`${name}: ${count}`
                })
            );
        });

        content.appendChild(card);
    }

    function renderDiagnostics(content){
        pageHeader(content,"Diagnostics","Local LoraCord runtime status.");

        const checks=[
            ["Document",!!document.body],
            ["Panel",!!document.getElementById(IDS.panel)],
            ["Launcher",!!document.getElementById(IDS.launcher)],
            ["Feature CSS",!!document.getElementById(IDS.feature)],
            ["Custom CSS",!!document.getElementById(IDS.customCSS)],
            ["Wallpaper",!!document.getElementById(IDS.wallpaper)],
            ["FakeNitro",getPlugin("fakeNitro")],
            ["Plugin Count",PLUGINS.length]
        ];

        checks.forEach(([name,status])=>{
            const card=create("div",{className:"lc-card"});
            card.innerHTML=`
                <div class="lc-card-title">${esc(name)}</div>
                <div style="color:${status===true?"#23a55a":"#b5bac1"};font-size:11px">
                    ${esc(status)}
                </div>
            `;
            content.appendChild(card);
        });
    }

    function renderImport(content){
        pageHeader(content,"Import / Export","Back up your LoraCord settings.");

        const area=create("textarea",{className:"lc-textarea"});
        area.style.minHeight="400px";

        content.appendChild(area);

        content.appendChild(makeButton("Export Settings",()=>{
            const data={};

            for(let i=0;i<localStorage.length;i++){
                const key=localStorage.key(i);

                if(key?.startsWith(STORAGE)){
                    data[key]=localStorage.getItem(key);
                }
            }

            area.value=JSON.stringify(data,null,2);
            notify("Settings exported.");
        }));

        content.appendChild(makeButton("Import Settings",()=>{
            try{
                const data=JSON.parse(area.value);

                Object.entries(data).forEach(([key,value])=>{
                    if(key.startsWith(STORAGE)){
                        localStorage.setItem(key,value);
                    }
                });

                notify("Settings imported. Reloading.");
                setTimeout(()=>location.reload(),400);
            }catch{
                notify("Invalid LoraCord export.");
            }
        }));
    }

    function renderSettings(content){
        pageHeader(content,"Settings","Core LoraCord settings.");

        const card=create("div",{className:"lc-card"});
        card.appendChild(create("div",{className:"lc-card-title",text:"Quick Controls"}));

        card.appendChild(makeButton("Toggle Glass",()=>{
            setPlugin("glass",!getPlugin("glass"));
            rebuildFeatureCSS();
        }));

        card.appendChild(makeButton("Toggle Animated Background",()=>{
            setPlugin("animatedBG",!getPlugin("animatedBG"));
            rebuildFeatureCSS();
        }));

        card.appendChild(makeButton("Toggle FakeNitro",()=>{
            setPlugin("fakeNitro",!getPlugin("fakeNitro"));
            refreshFakeNitro();
            refreshLauncher();
        }));

        card.appendChild(makeButton("Random Theme",()=>{
            const names=Object.keys(THEMES);
            applyTheme(names[Math.floor(Math.random()*names.length)]);
        }));

        content.appendChild(card);

        const reset=create("div",{className:"lc-card"});
        reset.appendChild(create("div",{className:"lc-card-title",text:"Reset"}));

        reset.appendChild(
            makeButton(
                "Reset Appearance",
                ()=>{
                    [
                        "glass",
                        "animatedBG",
                        "glow",
                        "rounded",
                        "smooth",
                        "compact",
                        "fakeNitro"
                    ].forEach(id=>{
                        setPlugin(id,DEFAULTS[id]??false);
                    });

                    applyTheme("LoraCord");
                    rebuildFeatureCSS();
                    refreshFakeNitro();
                    refreshLauncher();

                    notify("Appearance reset.");
                }
            )
        );

        reset.appendChild(
            makeButton(
                "Reset Everything",
                ()=>{
                    const keys=[];

                    for(let i=0;i<localStorage.length;i++){
                        const key=localStorage.key(i);

                        if(key?.startsWith(STORAGE)){
                            keys.push(key);
                        }
                    }

                    keys.forEach(key=>{
                        localStorage.removeItem(key);
                    });

                    location.reload();
                }
            )
        );

        content.appendChild(reset);
    }

    // =========================================================
    // RESTORE
    // =========================================================

    function restoreCSS(){
        const css=getSetting("css","");

        if(!css)return;

        const style=create("style",{id:IDS.customCSS});
        style.textContent=css;
        document.head.appendChild(style);
    }

    function restoreWallpaper(){
        const url=getSetting("wallpaperURL","");

        if(url){
            applyWallpaper(url);
        }
    }

    // =========================================================
    // SHORTCUTS
    // =========================================================

    function installShortcuts(){
        document.addEventListener("keydown",(event)=>{
            if(
                event.ctrlKey &&
                event.shiftKey &&
                event.key.toLowerCase()==="l" &&
                getPlugin("shortcut")
            ){
                event.preventDefault();
                openPanel();
            }

            if(event.key==="Escape"){
                closePanel();
                document.getElementById("loracord-command-palette")?.remove();
            }

            if(
                event.ctrlKey &&
                event.shiftKey &&
                event.key.toLowerCase()==="k" &&
                getPlugin("commandPalette")
            ){
                event.preventDefault();
                openCommandPalette();
            }
        });
    }

    // =========================================================
    // COMMAND PALETTE
    // =========================================================

    function openCommandPalette(){
        const old=document.getElementById("loracord-command-palette");
        old?.remove();

        const overlay=create("div",{id:"loracord-command-palette"});

        Object.assign(overlay.style,{
            position:"fixed",
            inset:"0",
            zIndex:"2147483647",
            background:"rgba(0,0,0,.6)",
            display:"grid",
            placeItems:"start center",
            paddingTop:"90px",
            fontFamily:"Arial,sans-serif"
        });

        const box=create("div");

        Object.assign(box.style,{
            width:"min(650px,calc(100vw - 30px))",
            background:"#18191c",
            border:"1px solid rgba(255,255,255,.08)",
            borderRadius:"12px",
            padding:"12px",
            boxShadow:"0 25px 80px rgba(0,0,0,.65)"
        });

        const input=create("input",{className:"lc-input"});
        input.placeholder="Search LoraCord commands...";

        box.appendChild(input);

        const list=create("div");
        box.appendChild(list);

        const commands=[
            ["Open Plugins","Plugin manager",()=>openPage("plugins")],
            ["Open Themes","Theme manager",()=>openPage("themes")],
            ["Open Quick Replies","Quick replies",()=>openPage("quick")],
            ["Open Toolbox","Utilities",()=>openPage("toolbox")],
            ["Open Quick CSS","CSS editor",()=>openPage("css")],
            ["Open Wallpaper","Wallpaper",()=>openPage("wallpaper")],
            ["Open Notes","Notes",()=>openPage("notes")],
            ["Theme Editor","Accent editor",()=>openPage("editor")],
            ["Plugin Statistics","Plugin stats",()=>openPage("stats")],
            ["Diagnostics","Diagnostics",()=>openPage("diagnostics")],
            ["Toggle FakeNitro","Cosmetic FakeNitro",()=>{
                setPlugin("fakeNitro",!getPlugin("fakeNitro"));
                refreshFakeNitro();
                refreshLauncher();
            }],
            ["Rec Room Theme","Apply Rec Room",()=>applyTheme("RecRoom")],
            ["Nitro Theme","Apply Nitro theme",()=>applyTheme("Nitro")],
            ["Random Theme","Pick random theme",()=>{
                const names=Object.keys(THEMES);
                applyTheme(names[Math.floor(Math.random()*names.length)]);
            }],
            ["Reload Discord","Reload page",()=>location.reload()]
        ];

        function draw(){
            list.innerHTML="";

            const q=input.value.toLowerCase().trim();

            commands
                .filter(
                    command=>
                        !q ||
                        command[0].toLowerCase().includes(q) ||
                        command[1].toLowerCase().includes(q)
                )
                .forEach(command=>{
                    const row=create("div",{className:"lc-command"});

                    row.innerHTML=`
                        <div>
                            <div class="lc-command-name">${esc(command[0])}</div>
                            <div class="lc-command-desc">${esc(command[1])}</div>
                        </div>
                    `;

                    row.appendChild(
                        makeButton(
                            "Run",
                            ()=>{
                                command[2]();
                                overlay.remove();
                            }
                        )
                    );

                    list.appendChild(row);
                });
        }

        input.oninput=draw;

        overlay.appendChild(box);

        overlay.addEventListener("click",event=>{
            if(event.target===overlay){
                overlay.remove();
            }
        });

        document.body.appendChild(overlay);

        input.focus();
        draw();
    }

    // =========================================================
    // WATCHDOG
    // =========================================================

    function startWatchdog(){
        setInterval(()=>{
            if(!document.body)return;

            if(!document.getElementById(IDS.panel)){
                createPanel();
            }

            if(getPlugin("launcher")&&!document.getElementById(IDS.launcher)){
                refreshLauncher();
            }

            if(getPlugin("fakeNitro")){
                addFakeNitroBadges();
            }
        },2000);
    }

    // =========================================================
    // STARTUP
    // =========================================================

    function start(){
        if(!document.body){
            setTimeout(start,500);
            return;
        }

        injectBaseCSS();

        const savedTheme=getSetting("theme","LoraCord");
        if(THEMES[savedTheme]){
            applyTheme(savedTheme);
        }

        restoreCSS();
        restoreWallpaper();
        rebuildFeatureCSS();

        createPanel();
        refreshLauncher();
        refreshFakeNitro();

        installShortcuts();
        startWatchdog();

        if(getPlugin("startupToast")){
            notify(`LoraCord ${VERSION} loaded.`);
        }
    }

    start();

})();
