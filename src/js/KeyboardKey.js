/**
 * Keyboard Keys
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    pingaspongas.KeyboardKey = {
        "A": 65,
        "D": 68,
        "ARROWLEFT": 37,
        "ARROWRIGHT": 39,
        "ARROWUP": 38,
        "ARROWDOWN": 40,
        "ENTER": 13,

        // Internet Explorer and Firefox 36 and earlier compatibility
        "LEFT": 37,
        "RIGHT": 39,
        "UP": 38,
        "DOWN": 40
    };

    // Keys to prevent from effecting the page
    pingaspongas.PreventableKeys = [37, 39, 38, 40, 32];
}());
