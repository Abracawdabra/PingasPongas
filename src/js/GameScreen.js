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
    var Direction = pingaspongas.Direction;

    /** For when refering a player is needed */
    var Player = {
        NONE: 0,
        ONE: 1,
        TWO: 2
    };

    /** Collision sources */
    var Collision = {
        NONE: 0,
        LEFT_WALL: 1,
        RIGHT_WALL: 2,
        TOP_WALL: 3,
        BOTTOM_WALL: 4,
        PLAYER_ONE_LEFT_EDGE: 5,
        PLAYER_ONE_RIGHT_EDGE: 6,
        PLAYER_ONE_MIDDLE: 7,
        PLAYER_TWO_LEFT_EDGE: 8,
        PLAYER_TWO_RIGHT_EDGE: 9,
        PLAYER_TWO_MIDDLE: 10,
        GOAL_HOLE: 11
    };

    /**
     * @class GameScreen
     * @constructor
     * @param {number} points_goal How many points until the game ends
     * @param {boolean} [multiplayer]
     */
    var GameScreen = function(points_goal, multiplayer) {
        pingaspongas.BaseScreen.call(this, 0, 0, pingaspongas.Game.SCREEN_WIDTH, pingaspongas.Game.SCREEN_HEIGHT);

        // Indicates 2 player game
        this._multiplayer = multiplayer;

        // How many points until the game ends
        this._pointsGoal = points_goal;

        // For pausing gameplay
        this._paused = false;

        // Time when the game was paused
        this._pauseStartTime = 0;

        // Round number for display purposes
        this._roundNum = 0;

        // Player one score
        this._playerOneScore = 0;

        // Player two/CPU score
        this._playerTwoScore = 0;

        // The player who is to serve
        this._servingPlayer = Player.NONE;

        // Used for blocking input
        this._roundStarted = false;

        // Time for when a round starts
        this._roundStartTime = 0;

        // Time for when to setup the next round (provides a delay between each round)
        this._setupRoundTime = 0;

        // Indicates the game ended
        this._gameOver = false;

        // Table bounds
        this._tableBounds = new pingaspongas.Rectangle(0, 0, GameScreen.TABLE_WIDTH, this._height);

        // Used for changing paddle lengths after a round
        this._increasePaddleSize = Player.NONE;

        this._playerOnePaddle = null;
        this._playerTwoPaddle = null;
        this._ball = null;

        // The last player to hit the ball
        this._lastBallHitter = Player.NONE;

        this._sidePanel = null;
        this._txtRound = null;
        this._txtPlayerOneScore = null;
        this._txtPlayerTwoScore = null;

        this._initUI();
        this._setupRound();
    };
    var p = pingaspongas.inherit(GameScreen, pingaspongas.BaseScreen);

    // Default paddle length
    GameScreen.DEFAULT_PADDLE_LENGTH = 8;

    // Speed at which the paddles move
    GameScreen.PADDLE_SPEED = 25;

    // Initial ball speed (characters per second)
    GameScreen.INITIAL_BALL_SPEED = 10;

    // Speed at which the ball increases each "level" (The highest score of either side)
    GameScreen.BALL_SPEED_INCREASE = 1.5;

    // Maximum ball speed so it doesn't go through paddles/goals
    GameScreen.MAX_BALL_SPEED = 40;

    // Game table width
    GameScreen.TABLE_WIDTH = 39;

    // Round Start Delay (milliseconds)
    GameScreen.ROUND_START_DELAY = 2000;

    // Delay between each round (milliseconds)
    GameScreen.END_OF_ROUND_DELAY = 1500;

    // Getters/setters
    Object.defineProperties(p, {
        levelBallSpeed: {
            get: function() {
                return Math.min(GameScreen.INITIAL_BALL_SPEED + (GameScreen.BALL_SPEED_INCREASE * Math.max(this._playerOneScore, this._playerTwoScore)), GameScreen.MAX_BALL_SPEED);
            }
        },
        paused: {
            get: function() { return this._paused; },
            set: function(value) {
                this._paused = value;
                if (value) {
                    this._pauseStartTime = utils.getTime();
                }
                else {
                    var pause_duration = utils.getTime() - this._pauseStartTime;
                    if (!this._roundStarted) {
                        this._roundStartTime += pause_duration;
                    }
                }
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
                this._playerOnePaddle.speed += -GameScreen.PADDLE_SPEED;
                break;
            case KeyboardKey["D"]:
                this._playerOnePaddle.speed += GameScreen.PADDLE_SPEED;
                break;
            case KeyboardKey["ARROWLEFT"]:
                if (this._multiplayer) {
                    this._playerTwoPaddle.speed += -GameScreen.PADDLE_SPEED;
                }
                break;
            case KeyboardKey["ARROWRIGHT"]:
                if (this._multiplayer) {
                    this._playerTwoPaddle.speed += GameScreen.PADDLE_SPEED;
                }
                break;
            case KeyboardKey["ENTER"]:
                var pause_screen = new pingaspongas.PauseScreen(this);
                pause_screen.x = Math.floor(pingaspongas.Game.SCREEN_WIDTH / 2) - Math.floor(pause_screen.width / 2);
                pause_screen.y = Math.floor(pingaspongas.Game.SCREEN_HEIGHT / 2) - Math.floor(pause_screen.height / 2);
                this._parent.addScreen(pause_screen);
                this.paused = true;
        }
    };

    /**
     * Key state change up handler
     * @override
     * @param {number} key_code
     */
    p.onKeyChangeUp = function(key_code) {
        switch (key_code) {
            case KeyboardKey["A"]:
                this._playerOnePaddle.speed += GameScreen.PADDLE_SPEED;
                break;
            case KeyboardKey["D"]:
                this._playerOnePaddle.speed += -GameScreen.PADDLE_SPEED;
                break;
            case KeyboardKey["ARROWLEFT"]:
                if (this._multiplayer) {
                    this._playerTwoPaddle.speed += GameScreen.PADDLE_SPEED;
                }
                break;
            case KeyboardKey["ARROWRIGHT"]:
                if (this._multiplayer) {
                    this._playerTwoPaddle.speed += -GameScreen.PADDLE_SPEED;
                }
        }
    };

    /**
     * Logic update
     * @override
     * @param {number} delta
     */
    p.update = function(delta) {
        if (!this._paused) {
            var time = utils.getTime();

            if (!this._gameOver) {
                var delta_seconds = delta / 1000;

                var paddle_new_x = void 0;
                if (this._playerOnePaddle.speed) {
                    paddle_new_x = this._playerOnePaddle.realX + (delta_seconds * this._playerOnePaddle.speed);
                    switch (this._getPaddleWallCollision(this._playerOnePaddle, paddle_new_x)) {
                        case Collision.NONE:
                            this._playerOnePaddle.x = paddle_new_x;
                            break;
                        case Collision.LEFT_WALL:
                            this._playerOnePaddle.x = this._tableBounds.x;
                            break;
                        case Collision.RIGHT_WALL:
                            this._playerOnePaddle.x = this._tableBounds.x + this._tableBounds.width - this._playerOnePaddle.width;
                    }
                }

                if (!this._multiplayer) {
                    // CPU code
                }

                if (this._playerTwoPaddle.speed) {
                    paddle_new_x = this._playerTwoPaddle.realX + (delta_seconds * this._playerTwoPaddle.speed);
                    switch (this._getPaddleWallCollision(this._playerTwoPaddle, paddle_new_x)) {
                        case Collision.NONE:
                            this._playerTwoPaddle.x = paddle_new_x;
                            break;
                        case Collision.LEFT_WALL:
                            this._playerTwoPaddle.x = this._tableBounds.x;
                            break;
                        case Collision.RIGHT_WALL:
                            this._playerTwoPaddle.x = this._tableBounds.x + this._tableBounds.width - this._playerTwoPaddle.width;
                    }
                }

                if (this._setupRoundTime > 0 && time > this._setupRoundTime) {
                    this._setupRoundTime = 0;
                    this._setupRound();
                }
                else if (!this._roundStarted && time >= this._roundStartTime) {
                    this._roundStarted = true;
                    this._serve();
                }
                else if (this._roundStarted && this._setupRoundTime === 0) {
                    var ball_new_x = this._ball.realX + (delta_seconds * this._ball.speedX);
                    var ball_new_y = this._ball.realY + (delta_seconds * this._ball.speedY);
                    switch(this._getBallCollision(ball_new_x, ball_new_y)) {
                        case Collision.NONE:
                            this._ball.x = ball_new_x;
                            this._ball.y = ball_new_y;
                            break;
                        case Collision.LEFT_WALL:
                            this._ball.speedX = Math.abs(this._ball.speedX);
                            this._ball.x = this._tableBounds.x;
                            this._ball.y = ball_new_y;
                            break;
                        case Collision.RIGHT_WALL:
                            this._ball.speedX = -this._ball.speedX;
                            this._ball.x = this._tableBounds.x + this._tableBounds.width - this._ball.width;
                            this._ball.y = ball_new_y;
                            break;
                        case Collision.TOP_WALL:
                            this._servingPlayer = Player.TWO;
                            this._increasePaddleSize = Player.ONE;
                            this._setupRoundTime = utils.getTime() + GameScreen.END_OF_ROUND_DELAY;
                            break;
                        case Collision.BOTTOM_WALL:
                            this._servingPlayer = Player.ONE;
                            this._increasePaddleSize = Player.TWO;
                            this._setupRoundTime = utils.getTime() + GameScreen.END_OF_ROUND_DELAY;
                            break;
                        case Collision.PLAYER_ONE_LEFT_EDGE:
                            this._lastBallHitter = Player.ONE;
                            this._ball.speedY = -this.levelBallSpeed - (GameScreen.BALL_SPEED_INCREASE * 4);
                            this._ball.speedX = this._ball.speedY;
                            break;
                        case Collision.PLAYER_ONE_RIGHT_EDGE:
                            this._lastBallHitter = Player.ONE;
                            this._ball.speedY = -this.levelBallSpeed - (GameScreen.BALL_SPEED_INCREASE * 4);
                            this._ball.speedY = Math.abs(this._ball.speedY);
                            break;
                        case Collision.PLAYER_ONE_MIDDLE:
                            this._lastBallHitter = Player.ONE;
                            this._ball.speedY = -this.levelBallSpeed;
                            break;
                        case Collision.PLAYER_TWO_LEFT_EDGE:
                            this._lastBallHitter = Player.TWO;
                            this._ball.speedY = this.levelBallSpeed + (GameScreen.BALL_SPEED_INCREASE * 4);
                            this._ball.speedX = -this._ball.speedY;
                            break;
                        case Collision.PLAYER_TWO_RIGHT_EDGE:
                            this._lastBallHitter = Player.TWO;
                            this._ball.speedY = this.levelBallSpeed + (GameScreen.BALL_SPEED_INCREASE * 4);
                            this._ball.speedX = this._ball.speedY;
                            break;
                        case Collision.PLAYER_TWO_MIDDLE:
                            this._lastBallHitter = Player.TWO;
                            this._ball.speedY = this.levelBallSpeed;
                            break;
                        case Collision.GOAL_HOLE:
                            this._lastPointPlayer = this._lastBallHitter;
                            if (this._lastBallHitter === Player.ONE) {
                                ++this._playerOneScore;
                            }
                            else if (this._lastBallHitter === Player.TWO) {
                                ++this._playerTwoScore;
                            }

                            this._updateSidePanel();

                            if (this._playerOneScore >= this._pointsGoal) {
                                this._endGame(Player.ONE);
                            }
                            else {
                                this._setupRoundTime = utils.getTime() + GameScreen.END_OF_ROUND_DELAY;
                            }
                    }
                }
            }

            pingaspongas.BaseScreen.prototype.update.call(this, delta);
        }
    };

    /**
     * Starts another game
     */
    p.playAgain = function() {
        if (this._multiplayer) {
            this._parent.startMultiplayerGame(this._pointsGoal);
        }
        else {
            this._parent.startSinglePlayerGame(this._pointsGoal);
        }
    };

    /**
     * UI initialization
     */
    p._initUI = function() {
        var middle_line = new DisplayObject(0, 0, utils.strRepeat("-", GameScreen.TABLE_WIDTH));
        middle_line.y = utils.getCenteredY(middle_line, this);
        this.addChild(middle_line);

        var player_one_paddle = new pingaspongas.Paddle(0, this.height - 3, GameScreen.DEFAULT_PADDLE_LENGTH);
        player_one_paddle.x = utils.getCenteredX(player_one_paddle, this._tableBounds);
        this.addChild(player_one_paddle);
        this._playerOnePaddle = player_one_paddle;

        var player_two_paddle = new pingaspongas.Paddle(0, 2, GameScreen.DEFAULT_PADDLE_LENGTH);
        player_two_paddle.x = utils.getCenteredX(player_two_paddle, this._tableBounds);
        this.addChild(player_two_paddle);
        this._playerTwoPaddle = player_two_paddle;

        var ball = new pingaspongas.Ball(0, 0);
        this.addChild(ball);
        this._ball = ball;

        var side_panel = new DisplayObject(this._tableBounds.x + this._tableBounds.width, 0, "", this._width - this._tableBounds.width - 1, this._height);
        side_panel.border = DisplayObject.Border.LEFT;
        this.addChild(side_panel);
        this._sidePanel = side_panel;

        var txt_round_label = new DisplayObject(0, 5, "ROUND");
        txt_round_label.x = utils.getCenteredX(txt_round_label, side_panel) + 1;
        this.addChild(txt_round_label);

        this._txtRound = new DisplayObject(0, txt_round_label.y + 1, "");
        this.addChild(this._txtRound);

        var txt_player_one_label = new DisplayObject(0, this._txtRound.y + 5, "PLAYER 1");
        txt_player_one_label.x = utils.getCenteredX(txt_player_one_label, side_panel) + 1;
        this.addChild(txt_player_one_label);

        this._txtPlayerOneScore = new DisplayObject(0, txt_player_one_label.y + 1, "");
        this.addChild(this._txtPlayerOneScore);

        var txt_player_two_label = new DisplayObject(0, this._txtPlayerOneScore.y + 5, this._multiplayer ? "PLAYER 2" : "CPU");
        txt_player_two_label.x = utils.getCenteredX(txt_player_two_label, side_panel) + 1;
        this.addChild(txt_player_two_label);

        this._txtPlayerTwoScore = new DisplayObject(0, txt_player_two_label.y + 1, "");
        this.addChild(this._txtPlayerTwoScore);
    };

    /**
     * Updates the side panel text
     */
    p._updateSidePanel = function() {
        var points_goal = isFinite(this._pointsGoal) ? this._pointsGoal.toString() : "∞";
        var text = this._playerOneScore + "/" + points_goal;
        if (this._txtPlayerOneScore.text !== text) {
            this._txtPlayerOneScore.text = text;
            this._txtPlayerOneScore.width = text.length;
            this._txtPlayerOneScore.x = utils.getCenteredX(this._txtPlayerOneScore, this._sidePanel) + 1;
        }

        text = this._playerTwoScore + "/" + points_goal;
        if (this._txtPlayerTwoScore.text !== text) {
            this._txtPlayerTwoScore.text = text;
            this._txtPlayerTwoScore.width = text.length;
            this._txtPlayerTwoScore.x = utils.getCenteredX(this._txtPlayerTwoScore, this._sidePanel) + 1;
        }

        text = this._roundNum.toString();
        if (this._txtRound.text !== text) {
            this._txtRound.text = text;
            this._txtRound.width = text.length;
            this._txtRound.x = utils.getCenteredX(this._txtRound, this._sidePanel) + 1;
        }
    };

    /**
     * Sets up a round
     */
    p._setupRound = function() {
        this._roundStarted = false;

        if (this._increasePaddleSize === Player.ONE) {
            ++this._playerOnePaddle.width;
            --this._playerTwoPaddle.width;
        }
        else if (this._increasePaddleSize === Player.TWO) {
            ++this._playerTwoPaddle.width;
            --this._playerOnePaddle.width;
        }

        this._ball.visible = false;
        this._ball.y = utils.getCenteredY(this._ball, this._tableBounds);
        this._ball.speedX = 0;
        this._ball.speedY = 0;

        ++this._roundNum;
        this._updateSidePanel();

        this._roundStartTime = utils.getTime() + GameScreen.ROUND_START_DELAY;
    };

    /**
     * Serves the ball
     */
    p._serve = function() {
        this._ball.x = utils.getRandBetween(this._tableBounds.x + 2, this._tableBounds.x + this._tableBounds.width - 2);

        var ball_speed = this.levelBallSpeed;
        switch (this._servingPlayer) {
            case Player.NONE:
                this._ball.speedY = Math.round(Math.random()) ? ball_speed : -ball_speed;
                break;
            case Player.ONE:
                this._ball.speedY = ball_speed;
                break;
            case Player.TWO:
                this._ball.speedY = -ball_speed;
        }

        this._ball.speedX = ball_speed * (Math.round(Math.random()) ? 1 : -1);
        this._ball.visible = true;
    };

    /**
     * Game over
     * @param {Player} winner
     */
    p._endGame = function(winner) {
        this._gameOver = true;
        this._updateSidePanel();
        var winner_str = (winner === Player.ONE) ? "PLAYER 1" : (this._multiplayer) ? "PLAYER 2" : "CPU";
        var game_over_screen = new pingaspongas.GameOverScreen(this, winner_str);
        game_over_screen.x = Math.floor(pingaspongas.Game.SCREEN_WIDTH / 2) - Math.floor(game_over_screen.width / 2);
        game_over_screen.y = Math.floor(pingaspongas.Game.SCREEN_HEIGHT / 2) - Math.floor(game_over_screen.height / 2);
        this._parent.addScreen(game_over_screen);
    };

    /**
     * Returns any source the ball has collided with
     * @param {number} new_x
     * @param {number} new_y
     * @return {Collision}
     */
    p._getBallCollision = function(new_x, new_y) {
        new_x = Math.floor(new_x);
        new_y = Math.floor(new_y);

        var ball = this._ball;
        var ball_part = (ball.direction === Direction.LEFT) ? new_x : new_x + 1;
        if (new_y < this._tableBounds.y) {
            return Collision.TOP_WALL;
        }
        else if (new_y > this._tableBounds.y + this._tableBounds.height) {
            return Collision.BOTTOM_WALL;
        }
        else if (ball_part < this._tableBounds.x) {
            return Collision.LEFT_WALL;
        }
        else if (ball_part >= this._tableBounds.x + this._tableBounds.width) {
            return Collision.RIGHT_WALL;
        }
        else {
            var p1_paddle_right_edge = this._playerOnePaddle.x + this._playerOnePaddle.width;
            var p2_paddle_right_edge = this._playerTwoPaddle.x + this._playerTwoPaddle.width;
            if (ball.y === this._playerOnePaddle.y || new_y === this._playerOnePaddle.y) {
                if (ball_part === this._playerOnePaddle.x) {
                    return Collision.PLAYER_ONE_LEFT_EDGE;
                }
                else if (ball_part === p1_paddle_right_edge) {
                    return Collision.PLAYER_ONE_RIGHT_EDGE;
                }
                else if (ball_part > this._playerOnePaddle.x && ball_part < p1_paddle_right_edge) {
                    return Collision.PLAYER_ONE_MIDDLE;
                }
            }
            else if (ball.y === this._playerTwoPaddle.y || new_y === this._playerTwoPaddle.y) {
                if (ball_part === this._playerTwoPaddle.x) {
                    return Collision.PLAYER_TWO_LEFT_EDGE;
                }
                else if (ball_part === p2_paddle_right_edge) {
                    return Collision.PLAYER_TWO_RIGHT_EDGE;
                }
                else if (ball_part > this._playerTwoPaddle.x && ball_part < p2_paddle_right_edge) {
                    return Collision.PLAYER_TWO_MIDDLE;
                }
            }
        }

        return Collision.NONE;
    };

    /**
     * Returns which wall, if any, a paddle is colliding with
     * @param {paddle} paddle
     * @param {number} new_x
     * @return {Collision}
     */
    p._getPaddleWallCollision = function(paddle, new_x) {
        if (new_x < this._tableBounds.x) {
            return Collision.LEFT_WALL;
        }
        else if (new_x + paddle.width > this._tableBounds.x + this._tableBounds.width) {
            return Collision.RIGHT_WALL;
        }

        return Collision.NONE;
    };

    pingaspongas.GameScreen = GameScreen;
}());
