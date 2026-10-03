// ==UserScript==
// @name         Universal Web Frame Overlay
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Embed any website you want in a massive, floating overlay window with an editable URL bar.
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Default starting URL (you can change this to whatever you want)
    let currentUrl = 'https://www.wikipedia.org';

    // Inject styles for the massive container, URL bar, and toggle handle
    const style = document.createElement('style');
    style.innerHTML = `
        #universal-overlay-container {
            position: fixed;
            top: 20px;
            right: 20px;
            bottom: 20px;
            left: 20px;
            z-index: 999999;
            background: rgba(10, 10, 15, 0.95);
            border-radius: 16px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-family: system-ui, -apple-system, sans-serif;
            backdrop-filter: blur(12px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
        }
        #universal-overlay-container.minimized {
            transform: translateY(calc(100% - 50px));
            opacity: 0.9;
        }
        .universal-top-bar {
            background: rgba(20, 20, 30, 0.9);
            padding: 10px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            gap: 12px;
            user-select: none;
        }
        .universal-url-form {
            display: flex;
            flex-grow: 1;
            gap: 8px;
        }
        .universal-url-input {
            flex-grow: 1;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            color: #ffffff;
            padding: 6px 12px;
            font-size: 13px;
            outline: none;
        }
        .universal-url-input:focus {
            border-color: #6ee7b7;
        }
        .universal-controls {
            display: flex;
            gap: 8px;
        }
        .universal-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s;
            white-space: nowrap;
        }
        .universal-btn:hover {
            background: rgba(255, 255, 255, 0.25);
        }
        .universal-frame-wrapper {
            flex-grow: 1;
            width: 100%;
            height: 100%;
            background: #000;
        }
        .universal-frame-wrapper iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    `;
    document.head.appendChild(style);

    // Create the overlay container element
    const container = document.createElement('div');
    container.id = 'universal-overlay-container';
    
    let isMinimized = false;

    function render() {
        container.className = isMinimized ? 'minimized' : '';
        container.innerHTML = `
            <div class="universal-top-bar">
                <form class="universal-url-form" id="universal-form">
                    <input type="text" class="universal-url-input" id="universal-input" value="${currentUrl}" placeholder="Enter URL (e.g. https://example.com)" />
                    <button type="submit" class="universal-btn">Go 🚀</button>
                </form>
                <div class="universal-controls">
                    <button class="universal-btn" id="universal-min-btn" type="button">${isMinimized ? 'Expand 🗖' : 'Minimize _'}</button>
                    <button class="universal-btn" id="universal-close-btn" type="button">✕</button>
                </div>
            </div>
            <div class="universal-frame-wrapper">
                <iframe id="universal-iframe" src="${currentUrl}"></iframe>
            </div>
        `;

        // Handle URL form submission to load new sites dynamically
        container.querySelector('#universal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            let newUrl = container.querySelector('#universal-input').value.trim();
            if (newUrl) {
                // Automatically prepend https:// if missing
                if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
                    newUrl = 'https://' + newUrl;
                }
                currentUrl = newUrl;
                container.querySelector('#universal-iframe').src = currentUrl;
            }
        });

        // Minimize/Expand buttons
        container.querySelector('#universal-min-btn').addEventListener('click', () => {
            isMinimized = !isMinimized;
            render();
        });

        // Close button
        container.querySelector('#universal-close-btn').addEventListener('click', () => {
            container.remove();
        });
    }

    document.body.appendChild(container);
    render();

})();
