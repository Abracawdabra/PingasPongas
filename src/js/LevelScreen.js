/**
 * Level Screen
 * @author Cawdabra
 * @license MIT
 */

(function() {
    "use strict";

    /**
     * @class LevelScreen
     * @constructor
     * @param {boolean} multiplayer
     */
    var LevelScreen = function(multiplayer) {
        pingaspongas.BaseScreen.call(this, 0, 0, pingaspongas.Game.SCREEN_WIDTH, pingaspongas.Game.SCREEN_HEIGHT);
    };
    var p = pingaspongas.inherit(LevelScreen, pingaspongas.BaseScreen);

    pingaspongas.LevelScreen = LevelScreen;
}());
