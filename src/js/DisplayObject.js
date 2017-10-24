/**
 * Game
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    /**
     * @class DisplayObject
     * @constructor
     * @param {number} x X position
     * @param {number} y Y position
     * @param {string} text
     * @param {number} [width] Width constraint
     * @param {number} [height] Height constraint
     */
    function DisplayObject(x, y, text, width, height) {
        this._x = x || 0;
        this._y = y || 0;
        this._width = width || 0;
        this._height = height || 0;
        this._text = text;
    }
    var p = DisplayObject.prototype;

    // Getters/setters
    Object.defineProperties(p, {
        parent: {
            get: function() { return this._parent; },
            set: function(value) {
                this._parent = value;
                this.render(true);
            }
        },
        x: {
            get: function() { return this._x; },
            set: function(value) {
                this._x = value;
                this.render(true);
            }
        },
        y: {
            get: function() { return this._y; },
            set: function(value) {
                this._y = value;
                this.render(true);
            }
        },
        width: {
            get: function() { return this._width },
            set: function(value) {
                this._width = value;
                this.render(true);
            }
        },
        height: {
            get: function() { return this._height },
            set: function(value) {
                this._height = value;
                this.render(true);
            }
        },
        text: {
            get: function() { return this._text },
            set: function(value) {
                this._text = value;
                this.render(true);
            }
        },
        visible: {
            get: function() { return this._isVisible; },
            set: function(value) {
                this._isVisible = value;
                this.render(true);
            }
        },
        value: { get: function() { return this._renderCache; } }
    });

    // Parent screen
    p._parent = null;

    // X position
    p._x = 0;

    // Y position
    p._y = 0;

    // Width
    p._width = 0;

    // Height
    p._height = 0;

    // Text value for this object (not for display purposes)
    p._text = "";

    // Determines if object is visible
    p._isVisible = true;

    // Cached display string array
    p._renderCache = [];

    /**
     * Renders the display object and caches the result
     * @param {boolean} [redraw_parent] Redraws the parent screen
     */
    p.render = function(redraw_parent) {
        var parent = this._parent || { x: 0, y: 0, width: pingaspongas.Game.SCREEN_WIDTH, height: pingaspongas.Game.SCREEN_HEIGHT };

        var split = (this._text !== "") ? this._text.split("\n") : [];
        var fill_width = void 0;
        if (this._width) {
            fill_width = Math.min(this._width, parent.x + parent.width - this._x);
        }
        else {
            var max = 0;
            for (var _a=0; _a<split.length; ++_a) {
                if (split[_a].length > max) {
                    max = split[_a].length;
                }
            }
            this._width = max;
            fill_width = Math.min(max, parent.x + parent.width - this._x);
        }

        this._height = this._height || split.length;
        var fill_height = Math.min(this._height, pingaspongas.Game.SCREEN_HEIGHT - this._y);
        var display = [];
        for (var _b=0; _b<fill_height; ++_b) {
            if (_b < split.length) {
                display.push((split[_b].length > fill_width) ? split[_b].substr(0, fill_width) : pingaspongas.utils.padStringRight(split[_b], fill_width));
            }
            else {
                display.push(pingaspongas.utils.padStringLeft("", fill_width));
            }
        }

        this._renderCache = display;

        if (this._parent && redraw_parent) {
            this.parent.redraw();
        }
    };

    pingaspongas.DisplayObject = DisplayObject;
}());
