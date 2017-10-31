/**
 * Goal Hole
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    /**
     * @enum
     */
    pingaspongas.GoalHoleType = {
        BUTT: 1,
        VAG: 2
    };

    /**
     * @class GoalHole
     * @constructor
     * @param {number} x
     * @param {number} y
     * @param {GoalHoleType} type
     * @param {Rectangle} roam_bounds
     */
    var GoalHole = function(x, y, type, roam_bounds) {
        pingaspongas.DisplayObject.call(this, x, y, (type === pingaspongas.GoalHoleType.BUTT) ? "(__Y__)" : "({})");
        this._type = type;
        this._roamBounds = roam_bounds;

        // Amount of time until changing roam direction
        this._roamTime = 0;
    }
    var p = pingaspongas.inherit(GoalHole, pingaspongas.DisplayObject);

    GoalHole.MAX_DIRECTION_DURATION = 2500;
    GoalHole.MAX_SPEED = 16;

    // Getters/setters
    Object.defineProperties(p, {
        type: {
            get: function() { return this._type; }
        }
    });

    /**
     * Logic update
     * @override
     * @param {number} delta
     */
    p.update = function(delta) {
        var delta_seconds = delta / 1000;
        if (pingaspongas.utils.getTime() >= this._roamTime) {
            this._roamTime = pingaspongas.utils.getTime() + Math.random() * GoalHole.MAX_DIRECTION_DURATION;
            this._speedX = Math.random() * GoalHole.MAX_SPEED * (Math.round(Math.random()) ? 1 : -1);
            this._speedY = Math.random() * GoalHole.MAX_SPEED * (Math.round(Math.random()) ? 1 : -1);
        }

        if (this._speedX) {
            var new_x = this._x + (delta_seconds * this._speedX);
            if (new_x > this._roamBounds.x && new_x + this._width < this._roamBounds.x + this._roamBounds.width) {
                this.x = new_x;
            }
        }

        if (this._speedY) {
            var new_y = this._y + (delta_seconds * this._speedY);
            if (new_y > this._roamBounds.y && new_y + this._height < this._roamBounds.y + this._roamBounds.height) {
                this.y = new_y;
            }
        }
    };

    pingaspongas.GoalHole = GoalHole;
}());
