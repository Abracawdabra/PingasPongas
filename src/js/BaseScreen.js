/**
 * Base Screen
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    /**
     * @class BaseScreen
     * @constructor
     * @param {number} x X position
     * @param {number} y Y position
     * @param {number} [width] Width of the screen
     * @param {number} [height] Height of the screen
     */
    function BaseScreen(x, y, width, height) {
        pingaspongas.DisplayObject.call(this, x, y, "", width || pingaspongas.Game.SCREEN_WIDTH, height || pingaspongas.Game.SCREEN_HEIGHT);

        // Updated when components change
        this.needsRedraw = false;

        // Components
        this._children = [];
    }
    pingaspongas.inherit(BaseScreen, pingaspongas.DisplayObject);
    var p = BaseScreen.prototype;

    /**
     * Adds a child object to the screen
     * @param {DisplayObject} child
     */
    p.addChild = function(child) {
        if (this._children.indexOf(child) === -1) {
            this._children.push(child);
            child.parent = this;
            if (child.visible) {
                this.render();
            }
        }
    };

    /**
     * Adds a child object at a specified index
     * @param {DisplayObject} child
     * @param {number} index
     */
    p.addChildAt = function(child, index) {
        this.removeChild(child);
        index = Math.max(Math.min(index, this._children.length), 0);
        this._children = this._children.slice(0, index).concat([child]).concat(this._children.slice(index));
        child.parent = this;
        if (child.visible) {
            this.render();
        }
    };

    /**
     * Removes a child object from the screen
     * @param {DisplayObject} child
     */
    p.removeChild = function(child) {
        var index = this._children.indexOf(child);
        if (index > -1) {
            this._children.splice(index, 1);
            child.parent = null;
            if (child.visible) {
                this.render();
            }
        }
    };

    /**
     * Removes a child object at a specified index
     * @param {number} index
     */
    p.removeChildAt = function(index) {
        if (index > -1 && index < this._children.length) {
            var child = this._children[index];
            this._children.splice(index, 1);
            child.parent = null;
            if (child.visible) {
                this.render();
            }
        }
    };

    /**
     * Event for when a key's state changes to down
     * @param {number} key_code
     */
    p.onKeyChangeDown = function(key_code) {
    };

    /**
     * Event for when a key's state changes to up
     * @param {number} key_code
     */
    p.onKeyChangeUp = function(key_code) {
    };

    /**
     * Update logic
     * @param {number} delta
     */
    p.update = function(delta) {
        if (this.needsRedraw) {
            this.render(true);
        }
    };

    /**
     * Redraws the screen
     * @override
     * @param {boolean} [render_border=true] Renders border if it has one
     */
    p.render = function(render_border) {
        if (render_border === undefined) {
            render_border = true;
        }

        // Have to handle borders within this method
        pingaspongas.DisplayObject.prototype.render.call(this, false);

        var child = void 0;
        var limited_width = void 0, limited_height = void 0;
        var child_start_index = void 0;
        var child_y_index_offset = void 0;
        var _a = 0, _b = void 0;
        for (; _a<this._children.length; ++_a) {
            child = this._children[_a];
            if (child.visible) {
                limited_width = Math.min((child.value.length > 0) ? child.value[0].length : 0, this._width - child.x);
                limited_height = Math.min((child.y > -1) ? child.value.length : child.y + child.value.length, this._height - child.y);
                child_start_index = (child.y > -1) ? child.y : 0;
                child_y_index_offset = (child.y > -1) ? 0 : Math.abs(child.y);
                for (_b=0; _b<limited_height; ++_b) {
                    this._renderCache[child_start_index + _b] = pingaspongas.utils.strReplace(this._renderCache[child_start_index  + _b], child.value[_b + child_y_index_offset].substr((child.x > -1) ? 0 : Math.abs(child.x), limited_width), child.x, limited_width);
                }
            }
        }

        if (render_border) {
            var Border = pingaspongas.DisplayObject.Border;
            if ((this._border & Border.LEFT) || (this._border & Border.RIGHT)) {
                for (_a=0; _a<this._renderCache.length; ++_a) {
                    this._renderCache[_a] = this._getBorderStr(_a, true) + this._renderCache[_a] + this._getBorderStr(_a, false);
                }
            }

            if (this._border & Border.TOP) {
                this._renderCache.unshift(this._getBorderStr(-1, true));
            }

            if (this._border & Border.BOTTOM) {
                this._renderCache.push(this._getBorderStr(this._height, true));
            }
        }

        this.needsRedraw = false;

        if (this._parent && !this._parent.needsRedraw) {
            this._parent.needsRedraw = true;
        }
    };

    pingaspongas.BaseScreen = BaseScreen;
}());
