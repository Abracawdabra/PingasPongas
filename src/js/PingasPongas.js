/**
 * Pingas Pongas
 * @author Cawdabra
 * @license MIT
 */

var pingaspongas = this.pingaspongas = {};

(function() {
    "use strict";

    /**
     * Makes a subclass inherit a parent class
     * @param {Object} child
     * @param {Object} parent
     * @return {Object}
     */
    pingaspongas.inherit = function(child, parent) {
        child.prototype = Object.create(parent.prototype);
        return child.prototype;
    };

    /**
     * Directions
     * @enum
     */
    pingaspongas.Direction = {
        NONE: 0,
        LEFT: 1,
        RIGHT: 2
    };
}());
