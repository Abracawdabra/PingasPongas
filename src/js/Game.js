/**
 * Pingas Pongas
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    /**
     * @class Game
     * @constructor
     * @param {string} parent_id ID of the parent container. If not found, defaults to using document's body
     */
    function Game(parent_id) {
        this.parent = document.getElementById(parent_id) || document.body;

        this._init();
    }
    var p = Game.prototype;

    // Width of the game screen
    Game.SCREEN_WIDTH = 62;

    // Height of the game screen
    Game.SCREEN_HEIGHT = 25;

    // Font family for the textarea
    Game.FONT_FAMILY = "monospace";

    // Font size for the textarea
    Game.FONT_SIZE = "16px";

    // Background color of the textarea
    Game.BACKGROUND_COLOR = "#000000";

    // Text color of the textarea
    Game.TEXT_COLOR = "#ffffff";

    // Parent node
    p.parent = null;

    // Textarea for the game
    p.textArea = null;

    // Screens to draw
    p._screens = [];

    /**
     * Adds a screen to be rendered
     * @param {BaseScreen} screen
     */
    p.addScreen = function(screen) {
        if (this._screens.indexOf(screen) === -1) {
            this._screens.push(screen);
            screen.parent = this;
            this.redraw();
        }
    };

    /**
     * Removes a screen from being rendere
     * @param {BaseScreen} screend
     */
    p.removeScreen = function(screen) {
        var index = this._screens.indexOf(screen);
        if (index > -1) {
            this._screens.splice(index, 1);
            screen.parent = null;
            this.redraw();
        }
    };

    /**
     * Redraws the screen
     */
    p.redraw = function() {
        var display = [];
        var _a = 0;
        for (; _a<Game.SCREEN_HEIGHT; ++_a) {
            display.push(pingaspongas.utils.padStringLeft("", Game.SCREEN_WIDTH));
        }

        var screen = void 0;
        var _b = 0;
        for (_a=0; _a<this._screens.length; ++_a) {
            screen = this._screens[_a];
            for (_b=0; _b<screen.value.length; ++_b) {
                display[screen.y] = pingaspongas.utils.strReplace(display[screen.y], screen.value[_b], screen.x, screen.value[_b].length);
            }
        }

        this.textArea.value = display.join("\n");
    };

    // Initializes the screen components
    p._init = function() {
        var textarea = document.createElement("textarea");
        textarea.cols = Game.SCREEN_WIDTH;
        textarea.rows = Game.SCREEN_HEIGHT;
        textarea.style.fontFamily = Game.FONT_FAMILY;
        textarea.style.fontSize = Game.FONT_SIZE;
        textarea.style.backgroundColor = Game.BACKGROUND_COLOR;
        textarea.style.color = Game.TEXT_COLOR;
        textarea.style.resize = "none";
        textarea.style.whiteSpace = "pre";
        textarea.style.overflow = "hidden";
        textarea.readOnly = true;
        textarea.spellcheck = false;
        this.textArea = textarea;
        this.parent.appendChild(textarea);
    };

    pingaspongas.Game = Game;
}());
