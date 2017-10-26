/**
 * Game
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
                this.render(true);
            }
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
                this.render(true);
            }
        }
    };

    /**
     * Redraws the screen
     * @override
     * @param {boolean} [redraw_parent] Redraws the parent
     * @param {boolean} [render_border=true] Renders border if it has one
     */
    p.render = function(redraw_parent, render_border) {
        if (render_border === undefined) {
            render_border = true;
        }

        // Have to handle borders within this method
        pingaspongas.DisplayObject.prototype.render.call(this, false, false);

        var child = void 0;
        var limited_width = void 0, limited_height = void 0;
        var _a = 0, _b = void 0;
        for (; _a<this._children.length; ++_a) {
            child = this._children[_a];
            if (child.visible) {
                limited_width = Math.min(child.value.length > 0 ? child.value[0].length : 0, this._width - child.x);
                limited_height = Math.min(child.value.length, this._height - child.y);
                for (_b=0; _b<limited_height; ++_b) {
                    this._renderCache[child.y + _b] = pingaspongas.utils.strReplace(this._renderCache[child.y + _b], child.value[_b].substr((child.x > 0) ? 0 : Math.abs(child.x), limited_width), child.x, limited_width);
                    console.log(child.y + _b + " = ", this._renderCache[child.y + _b]);
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

        if (this._parent && redraw_parent) {
            this._parent.render(true);
        }
    };

    pingaspongas.BaseScreen = BaseScreen;
}());
