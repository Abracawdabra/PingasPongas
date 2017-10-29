/**
 * Rectangle
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    /**
     * @class Rectangle
     * @constructor
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    var Rectangle = function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };
    var p = Rectangle.prototype;

    pingaspongas.Rectangle = Rectangle;
}());
