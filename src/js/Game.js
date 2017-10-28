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

        // Updated when screens change
        this.needsRedraw = false;

        // FPS converted to a millisecond interval
        this._tickInterval = 1000 / Game.FPS;

        // Current timeout ID
        this._timeoutID = 0;

        // Timestamp of the last timer tick
        this._lastTickTime = 0;

        // FPS stat
        this._currentFPS = 0;

        // Screens to draw
        this._screens = [];

        // List of key codes that are currently down
        this._keysDown = [];

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

    // Desired frames per second
    Game.FPS = 25;

    /**
     * Getters/setters
     */
    Object.defineProperties(p, {
        currentFPS: { get: function() { return this._currentFPS; } }
    });

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
        var screen_start_index = void 0;
        var screen_y_index_offset = void 0;
        for (_a=0; _a<this._screens.length; ++_a) {
            screen = this._screens[_a];
            limited_width = Math.min((screen.value.length > -1) ? screen.value[0].length : 0, Game.SCREEN_WIDTH - screen.x);
            limited_height = Math.min((screen.y > -1) ? screen.value.length : screen.y + screen.value.length, Game.SCREEN_HEIGHT - screen.y);
            screen_start_index = (screen.y > -1) ? screen.y : 0;
            screen_y_index_offset = (screen.y > -1) ? 0 : Math.abs(screen.y);
            if (screen.visible) {
                for (_b=0; _b<limited_height; ++_b) {
                    display[screen_start_index + _b] = pingaspongas.utils.strReplace(display[screen_start_index + _b], screen.value[_b + screen_y_index_offset].substr((screen.x > -1) ? 0 : Math.abs(screen.x), limited_width), screen.x, limited_width);
                }
            }
        }

        this.preElement.innerHTML = display.join("\n");
        this.needsRedraw = false;
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

        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onTick = this._onTick.bind(this);

        window.addEventListener("keydown", this._onKeyDown);
        window.addEventListener("keyup", this._onKeyUp);

        this.addScreen(new pingaspongas.TitleScreen());

        this._lastTickTime = pingaspongas.utils.getTime();
        this._timeoutID = setTimeout(this._onTick);
    };

    /**
     * Timer tick event handler
     */
    p._onTick = function(e) {
        var t = pingaspongas.utils.getTime();
        var delta = t - this._lastTickTime;
        this._currentFPS = 1000/delta;
        this._update(delta);
        this._lastTickTime = pingaspongas.utils.getTime();
        this._timeoutID = setTimeout(this._onTick, this._tickInterval - (pingaspongas.utils.getTime() - t));
    };
    /**
     * Key down event handler
     * @param {Event} e
     */
    p._onKeyDown = function(e) {
        var key_code = pingaspongas.utils.getKeyCode(e);
        if (this._screens.length > 0 && this._keysDown.indexOf(key_code) === -1) {
            this._screens[this._screens.length - 1].onKeyChangeDown(key_code);
            this._keysDown.push(key_code);
        }
    };

    /**
     * Key up event handler
     * @param {Event} e
     */
    p._onKeyUp = function(e) {
        var key_code = pingaspongas.utils.getKeyCode(e);
        if (this._screens.length > 0) {
            this._screens[this._screens.length - 1].onKeyChangeUp(key_code);
            var index = this._keysDown.indexOf(key_code);
            if (index > -1) {
                this._keysDown.splice(index, 1);
            }
        }
    };

    /**
     * Update logic
     * @param {number} delta
     */
    p._update = function(delta) {
        var _a = 0;
        for (; _a<this._screens.length; ++_a) {
            this._screens[_a].update(delta);
        }

        if (this.needsRedraw) {
            this.render();
        }
    };

    pingaspongas.Game = Game;
}());

