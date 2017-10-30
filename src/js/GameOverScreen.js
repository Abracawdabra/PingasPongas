/**
 * Game Over Screen
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    var DisplayObject = pingaspongas.DisplayObject;
    var utils = pingaspongas.utils;
    var KeyboardKey = pingaspongas.KeyboardKey;

    var MenuItem = {
        PLAY_AGAIN: 1,
        EXIT: 2
    };

    /**
     * @class GameOverScreen
     * @constructor
     * @param {GameScreen} game_screen
     * @param {string} winner
     */
    var GameOverScreen = function(game_screen, winner) {
        pingaspongas.BaseScreen.call(this, 0, 0, 19, 8);
        this._border = DisplayObject.Border.ALL_SIDES;

        // The game screen that spawned this
        this._gameScreen = game_screen;

        this._winner = winner;

        this._txtPlayAgain = null;
        this._txtExit = null;
        this._txtLeftSelectMarker = null;
        this._txtRightSelectMarker = null;

        this._initUI();
        this._selectMenuItem(MenuItem.PLAY_AGAIN);
    };
    var p = pingaspongas.inherit(GameOverScreen, pingaspongas.BaseScreen);

    /**
     * Key state change down handler
     * @override
     * @param {number} key_code
     */
    p.onKeyChangeDown = function(key_code) {
        switch (key_code) {
            case KeyboardKey["ARROWUP"]:
                this._selectMenuItem(this._selectedMenuItem - 1);
                break;
            case KeyboardKey["ARROWDOWN"]:
                this._selectMenuItem(this._selectedMenuItem + 1);
                break;
            case KeyboardKey["ENTER"]:
                switch (this._selectedMenuItem) {
                    case MenuItem.PLAY_AGAIN:
                        this._gameScreen.playAgain();
                        break;
                    case MenuItem.EXIT:
                        this._parent.showTitleScreen();
                }
        }
    };

    /**
     * UI initialization
     */
    p._initUI = function() {
        var txt_winner = new DisplayObject(0, 1, this._winner);
        txt_winner.x = utils.getCenteredX(txt_winner, this);
        this.addChild(txt_winner);

        var txt_has_won = new DisplayObject(0, 2, "HAS WON THE GAME");
        txt_has_won.x = utils.getCenteredX(txt_has_won, this);
        this.addChild(txt_has_won);

        var txt_play_again = new DisplayObject(0, txt_has_won.y + 3, "PLAY AGAIN");
        txt_play_again.x = utils.getCenteredX(txt_play_again, this);
        this.addChild(txt_play_again);
        this._txtPlayAgain = txt_play_again;

        var txt_exit = new DisplayObject(0, txt_play_again.y + 1, "EXIT");
        txt_exit.x = utils.getCenteredX(txt_exit, this);
        this.addChild(txt_exit);
        this._txtExit = txt_exit;

        this._txtLeftSelectMarker = new DisplayObject(0, 0, ">");
        this.addChild(this._txtLeftSelectMarker);

        this._txtRightSelectMarker = new DisplayObject(0, 0, "<");
        this.addChild(this._txtRightSelectMarker);
    };

    /**
     * Selects a menu item
     * @param {MenuItem} item
     */
    p._selectMenuItem = function(item) {
        var items = [
            this._txtPlayAgain,
            this._txtExit
        ];

        if (item > 0 && item <= items.length) {
            var item_obj = items[item - 1];
            this._txtLeftSelectMarker.x = item_obj.x - this._txtLeftSelectMarker.width - 1;
            this._txtLeftSelectMarker.y = item_obj.y;
            this._txtRightSelectMarker.x = item_obj.x + item_obj.width + 1;
            this._txtRightSelectMarker.y = item_obj.y;
            this._selectedMenuItem = item;
        }
    };

    pingaspongas.GameOverScreen = GameOverScreen;
}());
