/**
 * Paddle
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    var KeyboardKey = pingaspongas.KeyboardKey;
    var DisplayObject = pingaspongas.DisplayObject;

    var MenuItem = {
        RESUME: 1,
        INSTRUCTIONS: 2,
        QUIT: 3
    };

    /**
     * @class PauseScreen
     * @constructor
     * @param {GameScreen} game_screen
     */
    var PauseScreen = function(game_screen) {
        pingaspongas.BaseScreen.call(this, 0, 0, 23, 5);
        this._border = DisplayObject.Border.ALL_SIDES;

        // Used to reference the game screen that created this screen
        this._gameScreen = game_screen;

        this._txtResume = null;
        this._txtInstructions = null;
        this._txtQuit = null;
        this._txtLeftSelectMarker = null;
        this._txtRightSelectMarker = null;

        // Currently selected menu item
        this._selectedMenuItem = 0;

        this._initUI();
        this._selectMenuItem(MenuItem.RESUME);
    };
    var p = pingaspongas.inherit(PauseScreen, pingaspongas.BaseScreen);

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
                    case MenuItem.RESUME:
                        this._gameScreen.paused = false;
                        this._parent.removeScreen(this);
                        break;
                    case MenuItem.INSTRUCTIONS:
                        this._parent.showInstructionsScreen();
                        break;
                    case MenuItem.QUIT:
                        this._parent.showTitleScreen();
                }
        }
    };

    /**
     * UI initializer
     */
    p._initUI = function() {
        var txt_resume = new DisplayObject(0, 1, "Resume");
        txt_resume.x = pingaspongas.utils.getCenteredX(txt_resume, this);
        this.addChild(txt_resume);
        this._txtResume = txt_resume;

        var txt_instructions = new DisplayObject(0, txt_resume.y + 1, "Instructions");
        txt_instructions.x = pingaspongas.utils.getCenteredX(txt_instructions, this);
        this.addChild(txt_instructions);
        this._txtInstructions = txt_instructions;

        var txt_quit = new DisplayObject(0, txt_instructions.y + 1, "Quit");
        txt_quit.x = pingaspongas.utils.getCenteredX(txt_quit, this);
        this.addChild(txt_quit);
        this._txtQuit = txt_quit;

        var txt_left_marker = new DisplayObject(0, 0, ">");
        this.addChild(txt_left_marker);
        this._txtLeftSelectMarker = txt_left_marker;

        var txt_right_marker = new DisplayObject(0, 0, "<");
        this.addChild(txt_right_marker);
        this._txtRightSelectMarker = txt_right_marker;
    };

    /**
     * Select menu item
     * @param {number} item
     */
    p._selectMenuItem = function(item) {
        var items = [
            this._txtResume,
            this._txtInstructions,
            this._txtQuit
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

    pingaspongas.PauseScreen = PauseScreen;
}());