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
        // Parent node
        this.parent = document.getElementById(parent_id) || document.body;

        // Preformatted text element for the game
        this.preElement = null;

        // Screens to draw
        this._screens = [];

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

    /**
     * Adds a screen to be rendered
     * @param {BaseScreen} screen
     */
    p.addScreen = function(screen) {
        if (this._screens.indexOf(screen) === -1) {
            this._screens.push(screen);
            screen.parent = this;
            if (screen.visible) {
                this.render();
            }
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
            if (screen.visible) {
                this.render();
            }
        }
    };

    /**
     * Renders the screen
     */
    p.render = function() {
        var display = [];
        var _a = 0;
        for (; _a<Game.SCREEN_HEIGHT; ++_a) {
            display.push(pingaspongas.utils.padStringLeft("", Game.SCREEN_WIDTH));
        }

        var screen = void 0;
        var _b = 0;
        var limited_width = void 0, limited_height = void 0;
        for (_a=0; _a<this._screens.length; ++_a) {
            screen = this._screens[_a];
            limited_width = Math.min(screen.value.length > 0 ? screen.value[0].length : 0, Game.SCREEN_WIDTH - screen.x);
            limited_height = Math.min(screen.value.length, Game.SCREEN_HEIGHT - screen.y);
            if (screen.visible) {
                for (_b=0; _b<limited_height; ++_b) {
                    display[screen.y + _b] = pingaspongas.utils.strReplace(display[screen.y + _b], screen.value[_b].substr(screen.x > 0 ? 0 : Math.abs(screen.x), limited_width), screen.x, limited_width);
                }
            }
        }

        this.preElement.innerHTML = display.join("\n");
    };

    // Initializes the screen components
    p._init = function() {
        var pre = document.createElement("pre");
        pre.style.backgroundColor = Game.BACKGROUND_COLOR;
        pre.style.color = Game.TEXT_COLOR;
        pre.style.fontFamily = Game.FONT_FAMILY;
        pre.style.fontSize = Game.FONT_SIZE;
        pre.style.border = "0";
        pre.style.margin = "0";
        pre.style.padding = "0";
        this.preElement = pre;
        this.parent.appendChild(pre);
    };

    pingaspongas.Game = Game;
}());

