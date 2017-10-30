/**
 * Ball
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    var Direction = pingaspongas.Direction;

    var Ball = function(x, y) {
        pingaspongas.DisplayObject.call(this, x, y, "", 2, 1);

        // Y movement speed (characters per second)
        this.speedY = 0;

        // X movement speed (characters per second)
        this._speedX = 0;

        // Direction the ball is facing
        this._direction = 0;

        this.direction = Direction.LEFT;
    };
    var p = pingaspongas.inherit(Ball, pingaspongas.DisplayObject);

    // Getters/setters
    Object.defineProperties(p, {
        direction: {
            get: function() { return this._direction; },
            set: function(value) {
                this._direction = value;
                this.text = (value === Direction.LEFT) ? "O~" : "~O";
            }
        },
        speedX: {
            get: function() { return this._speedX; },
            set: function(value) {
                this._speedX = value;
                this.direction = (value <= 0) ? Direction.LEFT : Direction.RIGHT;
            }
        }
    });

    pingaspongas.Ball = Ball;
}());
