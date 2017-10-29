/**
 * Paddle
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    var Paddle = function(x, y, length) {
        pingaspongas.DisplayObject.call(this, x, y, "", 0, 1);

        // Movement speed
        this.speed = 0;

        // Direction the paddle is moving
        this.direction = pingaspongas.Direction.NONE;

        this.width = length;
    };
    var p = pingaspongas.inherit(Paddle, pingaspongas.DisplayObject);

    Paddle.MAX_LENGTH = 26;

    // Getters/setters
    Object.defineProperties(p, {
        /** @override */
        width: {
            get: function() { return this._width; },
            set: function(value) {
                this._width = Math.max(Math.min(value, Paddle.MAX_LENGTH), 0);
                this.text = "8" + pingaspongas.utils.strRepeat("=", this._width) + "D";
            }
        }
    });

    pingaspongas.Paddle = Paddle;
}());
