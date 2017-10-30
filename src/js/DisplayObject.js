/**
 * Display Object
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

        // Determines if object is visible
        this._visible = true;

        // Cached display string array
        this._renderCache = null;

        // Border sides
        this._border = DisplayObject.Border.NONE;

        if (this._text) {
            this.render();
        }
    }
    var p = DisplayObject.prototype;

    /**
     * Border bitflags
     * @enum
     */
    DisplayObject.Border = {
        NONE: 0,
        LEFT: 1,
        RIGHT: 2,
        TOP: 4,
        BOTTOM: 8,
        ALL_SIDES: 15
    };

    // Getters/setters
    Object.defineProperties(p, {
        parent: {
            get: function() { return this._parent; },
            set: function(value) {
                this._parent = value;
                if (this._parent && this._visible) {
                    this.render();
                }
            }
        },
        x: {
            get: function() { return Math.floor(this._x); },
            set: function(value) {
                this._x = value;
                if (this._parent && this._visible && !this._parent.needsRedraw) {
                    this._parent.needsRedraw = true;
                }
            }
        },
        realX: { get: function() { return this._x; } },
        realY: { get: function() { return this._y; } },
        y: {
            get: function() { return Math.floor(this._y); },
            set: function(value) {
                this._y = value;
                if (this._parent && this._visible && !this._parent.needsRedraw) {
                    this._parent.needsRedraw = true;
                }
            }
        },
        width: {
            get: function() { return this._width },
            set: function(value) {
                this._width = value;
                if (this._parent) {
                    this.render();
                }
            }
        },
        height: {
            get: function() { return this._height },
            set: function(value) {
                this._height = value;
                if (this._parent) {
                    this.render();
                }
            }
        },
        text: {
            get: function() { return this._text },
            set: function(value) {
                this._text = value.toString();
                if (this._parent) {
                    this.render();
                }
            }
        },
        visible: {
            get: function() { return this._visible; },
            set: function(value) {
                this._visible = value;
                if (this._parent && !this._parent.needsRedraw) {
                    this._parent.needsRedraw = true;
                }
            }
        },
        border: {
            get: function() { return this._border; },
            set: function(value) {
                this._border = value;
                if (this._parent) {
                    this.render();
                }
            }
        },
        value: { get: function() { return this._renderCache; } }
    });

    /**
     * Renders the display object and caches the result
     * @param {boolean} [render_border=true] Renders border for this object
     */
    p.render = function(render_border) {
        if (render_border === undefined) {
            render_border = true;
        }

        var split = (this._text !== "") ? this._text.split("\n") : [];
        var _a = 0;
        if (!this._width) {
            var max = 0;
            for (; _a<split.length; ++_a) {
                if (split[_a].length > max) {
                    max = split[_a].length;
                }
            }
            this._width = max;
        }

        this._height = this._height || split.length;
        var display = [];
        var line = void 0;
        for (_a=0; _a<this._height; ++_a) {
            if (_a < split.length) {
                line = pingaspongas.utils.padStringRight(split[_a], this._width);
            }
            else {
                line = pingaspongas.utils.padStringLeft("", this._width);
            }

            display.push(line);
        }

        if (render_border) {
            if ((this._border & DisplayObject.Border.LEFT) || (this._border & DisplayObject.Border.RIGHT)) {
                for (_a=0; _a<display.length; ++_a) {
                    display[_a] = this._getBorderStr(_a, true) + display[_a] + this._getBorderStr(_a, false);
                }
            }

            if (this._border & DisplayObject.Border.TOP) {
                display.unshift(this._getBorderStr(-1, true));
            }

            if (this._border & DisplayObject.Border.BOTTOM) {
                display.push(this._getBorderStr(this._height, true));
            }
        }

        this._renderCache = display;

        if (this._parent && !this._parent.needsRedraw) {
            this._parent.needsRedraw = true;
        }
    };

    /**
     * Returns a border string depending on position
     * @param {number} row Row position
     * @param {boolean} first_column Is the first column or not
     * @return {string}
     */
    p._getBorderStr = function(row, first_column) {
        var Border = DisplayObject.Border;
        if (this._border === Border.NONE) {
            // Faster for when there's no border
            return "";
        }

        var has_left = this._border & Border.LEFT;
        var has_right = this._border & Border.RIGHT;
        var value = "";
        if (row === -1 || row === this._height) {
            var has_top = row === -1 && (this._border & Border.TOP);
            var has_top_left_corner = has_top && has_left;
            var has_top_right_corner = has_top && has_right;
            var has_bottom = row === this._height && (this._border & Border.BOTTOM);
            var has_bottom_left_corner = has_bottom && has_left;
            var has_bottom_right_corner = has_bottom && has_right;
            if (first_column) {
                // Top/bottom left border
                value = (has_top_left_corner || has_bottom_left_corner ? "+" : (has_left ? "|" : ""));
                if (has_top || has_bottom) {
                    // Top/bottom border
                    value += pingaspongas.utils.strRepeat("-", this._width);
                }
            }

            // Top/bottom right border
            value += (has_top_right_corner || has_bottom_right_corner) ? "+" : (has_right ? "|" : "");
        }
        else if ((first_column && has_left) || (!first_column && has_right)) {
            value = "|";
        }

        return value;
    };

    pingaspongas.DisplayObject = DisplayObject;
}());
