// ==UserScript==
// @name         Alt Select to Copy with Unlock
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically copy selected text to clipboard when holding Alt key and unlock text selection restrictions
// @author       MoCongxin
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let isAltPressed = false;
    let styleSheet = null;
    let pressedKey = "Alt";

    function resetAltState() {
        isAltPressed = false;
        restoreSelectionRestrictions();
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === pressedKey) {
            isAltPressed = true;
            unlockSelectionRestrictions();
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === pressedKey) {
            resetAltState();
        }
    });

    document.addEventListener('blur', resetAltState);
    document.addEventListener('focus', resetAltState);

    document.addEventListener('mouseup', function(event) {
        if (isAltPressed && event.altKey) { // 双重检查 Alt 键状态
            let selectedText = window.getSelection().toString();
            if (selectedText) {
                copyToClipboard(selectedText);
            }
            setTimeout(resetAltState, 100); // 延时重置状态
        }
    });

    function copyToClipboard(text) {
        let textArea = document.createElement('textarea');
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = 0;
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Unable to copy to clipboard', err);
        }
        document.body.removeChild(textArea);
    }

    function unlockSelectionRestrictions() {
        if (!styleSheet) {
            let styles = `
                * {
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    user-select: text !important;
                }
            `;
            styleSheet = document.createElement("style");
            styleSheet.type = "text/css";
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
        }
    }

    function restoreSelectionRestrictions() {
        if (styleSheet) {
            styleSheet.remove();
            styleSheet = null;
        }
    }
})();
