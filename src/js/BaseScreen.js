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

    // Object setters/getters
    Object.defineProperties(p, {
        /** @override */
        width: {
            get: function() { return this._width; },
            set: function(value) {
                this._width = value;
                this._renderChildren();
                if (this._parent && this._visible) {
                    this.render(true);
                }
            }
        },
        /** @override */
        height: {
            get: function() { return this._height; },
            set: function(value) {
                this._height = value;
                this._renderChildren();
                if (this._parent && this._visible) {
                    this.render(true);
                }
            }
        }
    });

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
     */
    p.render = function(redraw_parent) {
        pingaspongas.DisplayObject.prototype.render.call(this);
        var child = void 0;
        var _a = void 0, _b = void 0;
        for (_a=0; _a<this._children.length; ++_a) {
            child = this._children[_a];
            if (child.visible) {
                for (_b=0; _b<child.value.length; ++_b) {
                    this._renderCache[child.y + _b] = pingaspongas.utils.strReplace(this._renderCache[child.y + _b], child.value[_b], child.x, child.value[_b].length);
                    console.log(child.y + _b + " = ", this._renderCache[child.y + _b]);
                }
            }
        }

        if (this._parent && redraw_parent) {
            this._parent.render(true);
        }
    };

    /**
     * Re-renders each child. Only needs to be called when screen dimensions are changed.
     */
    p._renderChildren = function() {
        var child = void 0;
        var _a = 0;
        for (; _a<this._children.length; ++_a) {
            child = this._children[_a];
            if (child.visible) {
                this._children[_a].render();
            }
        }
    };

    pingaspongas.BaseScreen = BaseScreen;
}());
