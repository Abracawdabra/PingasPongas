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
     * @param {number} width Width of the screen
     * @param {number} height Height of the screen
     * @param {number} [x] X position
     * @param {number} [y] Y position
     */
    function BaseScreen(parent, x, y, width, height) {
        this.__super.constructor.call(this, x, y, "", width, height);
    }
    var p = pingaspongas.inherit(BaseScreen, pingaspongas.DisplayObject);

    // Child objects
    p._children = [];

    /**
     * Adds a child object to the screen
     * @param {DisplayObject} child
     */
    p.addChild = function(child) {
        if (this._children.indexOf(child) === -1) {
            this._children.push(child);
            child.parent = this;
            if (child.visible) {
                child.render();
                this.redraw();
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
            if (child.visible) {
                this.redraw();
            }
        }
    };

    /**
     * Redraws the screen
     */
    p.redraw = function() {
        this.render();

        var child = void 0;
        var line = "";
        for (var c=0, d=0; c<this._children.length; ++c) {
            child = this._children[c];
            for (d=0; d<child.value.length; ++d) {
                this._value[child.y + d] = utils.strReplace(this._value[child.y + d], child.value[d], child.x, child.width);
            }
        }

        this._parent.redraw();
    };

    pingaspongas.BaseScreen = BaseScreen;
}());
