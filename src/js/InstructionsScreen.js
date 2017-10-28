/**
 * Ball
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    var InstructionsScreen = function() {
        pingaspongas.BaseScreen.call(this, 0, 0, 38, 15);
        this._border = pingaspongas.DisplayObject.Border.ALL_SIDES;
        this._initUI();
    }
    var p = pingaspongas.inherit(InstructionsScreen, pingaspongas.BaseScreen);

    /**
     * Key state changed down handler
     * @override
     * @param {number} key_code
     */
    p.onKeyChangeDown = function(key_code) {
        if (key_code === pingaspongas.KeyboardKey["ENTER"]) {
            this._parent.removeScreen(this);
        }
    };

    /**
     * Initializes the UI
     */
    p._initUI = function() {
        var txt_instructions = new pingaspongas.DisplayObject(1, 1, "");
        //                       012345678901234567890123456789012345
        txt_instructions.text = "Use A and D to control the bottom\n" +
                                "paddle (1 player) and the left and\n" +
                                "right arrow keys to control the top\n" +
                                "paddle (2 player).\n\n" +
                                "To win a round, you must get the\n" +
                                "ball into the \"goal hole\" which\n" +
                                "spawns near the end of the round.\n" +
                                "When the ball goes past a paddle,\n" +
                                "that paddle will shrink in size, and\n" +
                                "the opposing paddle will grow. This\n" +
                                "gives it an advantage. First side to\n" +
                                "10 points wins.\n";
        this.addChild(txt_instructions);
    };

    pingaspongas.InstructionsScreen = InstructionsScreen;
}());
