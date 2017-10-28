/**
 * Title Screen
 * @author Cawdabra
 * @license MIT
 */

(function() {
    var utils = pingaspongas.utils;
    var BaseScreen = pingaspongas.BaseScreen;
    var DisplayObject = pingaspongas.DisplayObject;
    var KeyboardKey = pingaspongas.KeyboardKey;

    var MenuItem = {
        START_GAME: 1,
        INSTRUCTIONS: 2
    };

    // Min interval range for creating sperm (milliseconds)
    var SPERM_CREATION_MIN_INTERVAL = 50;
    // Max interval range for creating sperm (milliseconds)
    var SPERM_CREATION_MAX_INTERVAL = 1000;
    // Min speed of sperm (characters per second)
    var SPERM_MIN_SPEED = 7;
    var SPERM_MAX_SPEED = 25;

    var TitleScreen = function() {
        BaseScreen.call(this, 0, 0, pingaspongas.Game.SCREEN_WIDTH, pingaspongas.Game.SCREEN_HEIGHT);

        this._txtTitle = null;
        this._txtStartGame = null;
        this._txtInstructions = null;
        this._txtSelectMarker = null;

        this._spermList = [];
        this._spermCreateTime = 0;

        this._selectedMenuItem = 0;

        this._initUI();
        this._selectMenuItem(MenuItem.START_GAME);
        this._createSperm();
    };
    var p = pingaspongas.inherit(TitleScreen, BaseScreen);

    /**
     * On key state change down handler
     * @override
     * @param {number} key_code
     */
    p.onKeyChangeDown = function(key_code) {
        switch(key_code) {
            case KeyboardKey["ARROWUP"]:
                this._selectMenuItem(this._selectedMenuItem - 1);
                break;
            case KeyboardKey["ARROWDOWN"]:
                this._selectMenuItem(this._selectedMenuItem + 1);
        }
    };

    /**
     * Update logic
     * @override
     * @param {number} delta
     */
    p.update = function(delta) {
        if (utils.getTime() >= this._createSpermTime) {
            this._createSperm();
        }

        var sperm = void 0;
        var _a = 0;
        for (; _a<this._spermList.length; ++_a) {
            sperm = this._spermList[_a];
            if (sperm.x >= pingaspongas.Game.SCREEN_WIDTH) {
                this.removeChild(sperm);
                this._spermList.splice(_a--, 1);
            }
            else {
                sperm.x = sperm.realX + (delta / 1000 * sperm.speed);
            }
        }

        pingaspongas.BaseScreen.prototype.update.call(this, delta);
    };

    p._initUI = function() {
        var txt_title = new DisplayObject(0, 0,
        "  _______  ___  __    _  _______  _______  _______  \n" +
        "  |       ||   ||  |  | ||       ||   _   ||       |\n" +
        "  |    _  ||   ||   |_| ||    ___||  |_|  ||  _____|\n" +
        "  |   |_| ||   ||       ||   | __ |       || |_____ \n" +
        "  |    ___||   ||  _    ||   ||  ||       ||_____  |\n" +
        "  |   |    |   || | |   ||   |_| ||   _   | _____| |\n" +
        "  |___|    |___||_|  |__||_______||__| |__||_______|\n" +
        " _______  _______  __    _  _______  _______  _______ \n" +
        "|       ||       ||  |  | ||       ||   _   ||       |\n" +
        "|    _  ||   _   ||   |_| ||    ___||  |_|  ||  _____|\n" +
        "|   |_| ||  | |  ||       ||   | __ |       || |_____ \n" +
        "|    ___||  |_|  ||  _    ||   ||  ||       ||_____  |\n" +
        "|   |    |       || | |   ||   |_| ||   _   | _____| |\n" +
        "|___|    |_______||_|  |__||_______||__| |__||_______|"
        );
        txt_title.x = utils.getCenteredX(txt_title, this);
        txt_title.y = 1;
        this.addChild(txt_title);
        this._txtTitle = txt_title;

        var txt_start = new DisplayObject(0, 0, "Start Game");
        txt_start.x = utils.getCenteredX(txt_start, this);
        txt_start.y = txt_title.x + txt_title.height + 1;
        this.addChild(txt_start);
        this._txtStartGame = txt_start;

        var txt_instructions = new DisplayObject(0, 0, "Instructions");
        txt_instructions.x = utils.getCenteredX(txt_instructions, this);
        txt_instructions.y = txt_start.y + txt_start.height;
        this.addChild(txt_instructions);
        this._txtInstructions = txt_instructions;

        var txt_select = new DisplayObject(0, 0, ">");
        this.addChild(txt_select);
        this._txtSelectMarker = txt_select;
    };

    /**
     * Selects a menu item
     * @param {MenuItem} item
     */
    p._selectMenuItem = function(item) {
        var items = [
            this._txtStartGame,
            this._txtInstructions
        ];

        if (item > 0 && item <= items.length) {
            var item_obj = items[item - 1];
            this._txtSelectMarker.x = item_obj.x - this._txtSelectMarker.width - 1;
            this._txtSelectMarker.y = item_obj.y;
            this._selectedMenuItem = item;
        }
    };

    p._createSperm = function() {
        var sperm = new DisplayObject(-2, Math.floor(Math.random() * pingaspongas.Game.SCREEN_HEIGHT), Math.round(Math.random()) ? "~o" : "~O");
        sperm.speed = utils.getRandBetween(SPERM_MIN_SPEED, SPERM_MAX_SPEED);
        this.addChildAt(sperm, 0);
        this._spermList.push(sperm);
        this._createSpermTime = utils.getTime() + utils.getRandBetween(SPERM_CREATION_MIN_INTERVAL, SPERM_CREATION_MAX_INTERVAL);
    };

    pingaspongas.TitleScreen = TitleScreen;
}());
