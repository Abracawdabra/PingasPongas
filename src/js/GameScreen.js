/**
 * Level Screen
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    var KeyboardKey = pingaspongas.KeyboardKey;

    /**
     * @class GameScreen
     * @constructor
     * @param {boolean} multiplayer
     */
    var GameScreen = function(multiplayer) {
        pingaspongas.BaseScreen.call(this, 0, 0, pingaspongas.Game.SCREEN_WIDTH, pingaspongas.Game.SCREEN_HEIGHT);

        // For the pause screen
        this.paused = false;

        this._topPaddleScore = 0;
        this._bottomPaddleScore = 0;

        this._topPaddle = null;
        this._bottomPaddle = null;
    };
    var p = pingaspongas.inherit(GameScreen, pingaspongas.BaseScreen);

    // Speed at which the paddles move
    GameScreen.PADDLE_SPEED = 20;

    // Initial ball speed
    GameScreen.INITIAL_BALL_SPEED = 15;
    // Speed at which the ball increases each "level" (The highest score of either side)
    GameScreen.BALL_SPEED_INCREASE = 1.5;

    // Getters/setters
    Object.defineProperties(p, {
        level: {
            get: function() {
                return Math.max(this._topPaddleScore, this._bottomPaddleScore) + 1;
            }
        }
    });

    /**
     * Key state change down handler
     * @override
     * @param {number} key_code
     */
    p.onKeyChangeDown = function(key_code) {
        switch (key_code) {
            case KeyboardKey["A"]:
                break;
            case KeyboardKey["D"]:
                break;
            case KeyboardKey["ARROWLEFT"]:
                break;
            case KeyboardKey["ARROWRIGHT"]:
                break;
            case KeyboardKey["ENTER"]:
                if (!this.paused) {
                    var pause_screen = new pingaspongas.PauseScreen(this);
                    pause_screen.x = Math.floor(pingaspongas.Game.SCREEN_WIDTH / 2) - Math.floor(pause_screen.width / 2);
                    pause_screen.y = Math.floor(pingaspongas.Game.SCREEN_HEIGHT / 2) - Math.floor(pause_screen.height / 2);
                    this._parent.addScreen(pause_screen);
                    this._paused = true;
                }
        }
    };

    pingaspongas.GameScreen = GameScreen;
}());
