/**
 * Point Selection Screen
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    var DisplayObject = pingaspongas.DisplayObject;
    var utils = pingaspongas.utils;
    var KeyboardKey = pingaspongas.KeyboardKey;

    var MenuItem = {
        TEN_POINTS: 1,
        TWENTY_POINTS: 2,
        THIRTY_POINTS: 3,
        INFINITE: 4,
        CANCEL: 5
    };

    /**
     * @class PointsSelectionScreen
     * @constructor
     * @param {TitleScreen} title_screen
     */
    var PointsSelectionScreen = function(title_screen) {
        pingaspongas.BaseScreen.call(this, 0, 0, 19, 7);
        this._border = DisplayObject.Border.ALL_SIDES;

        // Reference to the title screen that spawned this
        this._titleScreen = title_screen;

        this._selectedMenuItem = 0;

        this._txtTenPoints = null;
        this._txtTwentyPoints = null;
        this._txtThirtyPoints = null;
        this._txtInfinite = null;
        this._txtCancel = null;
        this._txtLeftSelectMarker = null;
        this._txtRightSelectMarker = null;

        this._initUI();
        this._selectMenuItem(MenuItem.TEN_POINTS);
    };
    var p = pingaspongas.inherit(PointsSelectionScreen, pingaspongas.BaseScreen);

    /**
     * Key state change down handler
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
                if (this._selectedMenuItem === MenuItem.CANCEL) {
                    this._parent.removeScreen(this);
                }
                else {
                    var point_goals = [10, 20, 30, Infinity];
                    this._titleScreen.startGame(point_goals[this._selectedMenuItem - 1]);
                    this._parent.removeScreen(this);
                }
        }
    };

    /**
     * UI initialization
     */
    p._initUI = function() {
        var txt_ten = new DisplayObject(0, 1, "10 POINTS");
        txt_ten.x = utils.getCenteredX(txt_ten, this);
        this.addChild(txt_ten);
        this._txtTenPoints = txt_ten;

        var txt_twenty = new DisplayObject(0, txt_ten.y + 1, "20 POINTS");
        txt_twenty.x = utils.getCenteredX(txt_twenty, this);
        this.addChild(txt_twenty);
        this._txtTwentyPoints = txt_twenty;

        var txt_thirty = new DisplayObject(0, txt_twenty.y + 1, "30 POINTS");
        txt_thirty.x = utils.getCenteredX(txt_thirty, this);
        this.addChild(txt_thirty);
        this._txtThirtyPoints = txt_thirty;

        var txt_infinite = new DisplayObject(0, txt_thirty.y + 1, "INFINITE");
        txt_infinite.x = utils.getCenteredX(txt_infinite, this);
        this.addChild(txt_infinite);
        this._txtInfinite = txt_infinite;

        var txt_cancel = new DisplayObject(0, txt_infinite.y + 1, "CANCEL");
        txt_cancel.x = utils.getCenteredX(txt_cancel, this);
        this.addChild(txt_cancel);
        this._txtCancel = txt_cancel;

        var txt_left_marker = new DisplayObject(0, 0, ">");
        this.addChild(txt_left_marker);
        this._txtLeftSelectMarker = txt_left_marker;

        var txt_right_marker = new DisplayObject(0, 0, "<");
        this.addChild(txt_right_marker);
        this._txtRightSelectMarker = txt_right_marker;
    };

    /**
     * Selects a menu item
     * @param {number} item
     */
    p._selectMenuItem = function(item) {
        var items = [
            this._txtTenPoints,
            this._txtTwentyPoints,
            this._txtThirtyPoints,
            this._txtInfinite,
            this._txtCancel
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

    pingaspongas.PointsSelectionScreen = PointsSelectionScreen;
}());
