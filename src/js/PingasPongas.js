/**
 * Pingas Pongas
 * @author Cawdabra
 * @license MIT
 */

var pingaspongas = this.pingaspongas = {};

(function() {
    "use strict";

    /**
     * Makes a copy of an object
     * @param {object} obj
     * @return {object}
     */
    function copyObject(obj) {
        var copy = {};
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (typeof obj[prop] === "object") {
                    copy[prop] = copyObject(obj[prop]);
                }
                else if (Array.isArray(obj[prop])) {
                    copy[prop] = obj[prop].slice();
                }
                else {
                    copy[prop] = obj[prop];
                }
            }
        }
    }

    /**
     * Makes a subclass inherit a parent class
     * @param {Object} subclass
     * @param {Object} parent
     */
    pingaspongas.inherit = function(subclass, parent) {
        // Inherit any static properties
        for (var prop in parent) {
            if (parent.hasOwnProperty(prop)) {
                if (typeof parent[prop] === "object") {
                    subclass[prop] = copyObject(parent[prop]);
                }
                else if (Array.isArray(parent[prop])) {
                    subclass[prop] = parent[prop].slice();
                }
                else {
                    subclass[prop] = parent[prop];
                }
            }
        }

        subclass.prototype = Object.create(parent.prototype);
        subclass.prototype.__super = parent.prototype;

        return subclass.prototype;
    };
}());
