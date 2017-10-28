/**
 * Utilities
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    var utils = {};

    /**
     * Gets time in milliseconds
     * @return {number}
     */
    utils.getTime = (window.performance && window.performance.now) ? window.performance.now.bind(window.performance) : Date.now || function() { return new Date().getTime(); };

    /**
     * Returns a key code given a keyboard event
     * @param {KeyboardEvent} e
     * @return {number}
     */
    utils.getKeyCode = function(e) {
        var identifier = e.key || e.keyIdentifier;
        if (identifier) {
            identifier = identifier.toUpperCase();
            if (identifier in pingaspongas.KeyboardKey) {
                return pingaspongas.KeyboardKey[identifier];
            }
        }
        else if (e.keyCode) {
            return e.keyCode;
        }

        // No code for this identifier
        return 0;
    };

    /**
     * Pads a string with heading spaces until it meets a certain length
     * @param {string} text
     * @param {number} width
     * @return {string}
     */
    utils.padStringLeft = function(text, width) {
        while (text.length < width) {
            text = " " + text;
        }

        return text;
    };

    /**
     * Pads a string with trailing spaces until it meets a certain length
     * @param {string} text
     * @param {number} width
     * @param {string}
     */
    utils.padStringRight = function(text, width) {
        while (text.length < width) {
            text += " ";
        }

        return text;
    };

    /**
     * Replaces part of a string starting from start_index
     * @param {string} str
     * @param {string} dest
     * @param {number} start_index
     * @param {number} length
     * @return {string}
     */
    utils.strReplace = function(source, dest, start_index, length) {
        return source.substring(0, start_index) + dest + source.substring(start_index + length);
    };

    /**
     * Repeats a string a number of times
     * @param {string} str
     * @param {number} count
     * @return {string}
     */
    utils.strRepeat = function(str, count) {
        var value = str;
        var _a = 1;
        for (; _a<count; ++_a) {
            value += str;
        }

        return value;
    };

    /**
     * Returns the horizontal center of an object in accordance to another object
     * @param {IRect} obj1 Object to be centered
     * @param {IRect} obj2
     * @return {number}
     */
    utils.getCenteredX = function(obj1, obj2) {
        return obj2.x + Math.floor(obj2.width / 2) - Math.floor(obj1.width / 2);
    };

    /**
     * Returns the Vertical center an object in accordance to another object
     * @param {IRect} obj1 Object to be centered
     * @param {IRect} obj2
     * @return {number}
     */
    utils.getCenteredY = function(obj1, obj2) {
        return obj2.y + Math.floor(obj2.height / 2) - Math.floor(obj1.height / 2);
    };

    /**
     * Returns a number between a range
     */
    utils.getRandBetween = function(min, max) {
        return Math.floor((Math.random() * (max - min)) + min);
    };

    /**
     * Returns the width and height of a font in pixels
     * @param {string} font_family
     * @param {string} font_size
     * @return {object} Object with width and height properties
     */
    utils.getFontPixelSize = function(font_family, font_size) {
        var pre = document.createElement("pre");
        pre.style.fontFamily = font_family;
        pre.style.fontSize = font_size;
        pre.style.borderWidth = "0";
        pre.style.borderSpacing = "0";
        pre.style.margin = "0";
        pre.style.padding = "0";
        pre.style.display = "inline";
        pre.style.position = "absolute";
        pre.style.left = "-9001px"
        pre.style.top = "-9001px";
        pre.innerText = " ";
        document.body.appendChild(pre);

        var rect = pre.getBoundingClientRect();
        document.body.removeChild(pre);
        return {
            width: rect.right - rect.left,
            height: rect.bottom - rect.top
        };
    };

    pingaspongas.utils = utils;
}());
