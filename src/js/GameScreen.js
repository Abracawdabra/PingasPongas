/**
 * Level Screen
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    var KeyboardKey = pingaspongas.KeyboardKey;
    var utils = pingaspongas.utils;
    var DisplayObject = pingaspongas.DisplayObject;

    /**
     * @class GameScreen
     * @constructor
     * @param {number} points_goal How many points until the game ends
     * @param {boolean} [multiplayer]
     */
    var GameScreen = function(points_goal, multiplayer) {
        pingaspongas.BaseScreen.call(this, 0, 0, pingaspongas.Game.SCREEN_WIDTH, pingaspongas.Game.SCREEN_HEIGHT);

        // For the pause screen
        this.paused = false;

        // Indicates 2 player game
        this._multiplayer = multiplayer;

        // Round number for display purposes
        this._roundNum = 0;

        // How many points until the game ends
        this._pointsGoal = points_goal;

        // Used for blocking input
        this._roundStarted = false;

        // Table bounds
        this._tableBounds = new pingaspongas.Rectangle(0, 0, GameScreen.TABLE_WIDTH, this._height);

        this._topPaddleScore = 0;
        this._bottomPaddleScore = 0;

        this._topPaddle = null;
        this._bottomPaddle = null;
        this._ball = null;

        this._initUI();
        this._setupRound();
    };
    var p = pingaspongas.inherit(GameScreen, pingaspongas.BaseScreen);

    // Default paddle length
    GameScreen.DEFAULT_PADDLE_LENGTH = 6;

    // Speed at which the paddles move
    GameScreen.PADDLE_SPEED = 20;

    // Initial ball speed
    GameScreen.INITIAL_BALL_SPEED = 15;
    // Speed at which the ball increases each "level" (The highest score of either side)
    GameScreen.BALL_SPEED_INCREASE = 1.5;

    // Game table width
    GameScreen.TABLE_WIDTH = 39;

    // Getters/setters
    Object.defineProperties(p, {
        // Used for calculating the ball speed for and during a round
        level: {
            get: function() {
                return Math.max(this._topPaddleScore, this._bottomPaddleScore);
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
                if (this._roundStarted) {

                }
                break;
            case KeyboardKey["D"]:
                if (this._roundStarted) {

                }
                break;
            case KeyboardKey["ARROWLEFT"]:
                if (this._roundStarted && this._multiplayer) {

                }
                break;
            case KeyboardKey["ARROWRIGHT"]:
                if (this._roundStarted && this._multiplayer) {

                }
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

    /**
     * Logic update
     * @override
     * @param {number} delta
     */
    p.update = function(delta) {
        if (!this.paused) {
            pingaspongas.BaseScreen.prototype.update.call(this, delta);
        }
    };

    /**
     * UI initialization
     */
    p._initUI = function() {
        var middle_line = new pingaspongas.DisplayObject(0, 0, utils.strRepeat("-", GameScreen.TABLE_WIDTH));
        middle_line.y = utils.getCenteredY(middle_line, this);
        this.addChild(middle_line);

        var top_paddle = new pingaspongas.Paddle(0, 2, GameScreen.DEFAULT_PADDLE_LENGTH);
        this.addChild(top_paddle);
        this._topPaddle = top_paddle;

        var bottom_paddle = new pingaspongas.Paddle(0, this.height - 3, GameScreen.DEFAULT_PADDLE_LENGTH);
        this.addChild(bottom_paddle);
        this._bottomPaddle = bottom_paddle;

        var ball = new pingaspongas.Ball(0, 0);
        this.addChild(ball);
        this._ball = ball;
    };

    /**
     * Sets up a round
     */
    p._setupRound = function() {
        this._roundStarted = false;

        this._topPaddle.x = utils.getCenteredX(this._topPaddle, this._tableBounds);
        this._bottomPaddle.x = this._topPaddle.x;

        this._ball.x = utils.getCenteredX(this._ball, this._tableBounds);
        this._ball.y = utils.getCenteredY(this._ball, this._tableBounds);
    };

    pingaspongas.GameScreen = GameScreen;
}());
