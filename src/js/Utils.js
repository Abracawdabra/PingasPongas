/**
 * Game
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    var utils = {};

    /**
     * Pads a string with heading spaces until it meets a certain length
     * @param {string} text
     * @param {number} width
     * @return {string}
     */
    utils.padStringLeft = function(text, width) {
        while (text.length < width) {
            text += " ";
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
            text = " " + text;
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

    pingaspongas.utils = utils;
}());