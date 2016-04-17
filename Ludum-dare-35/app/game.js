/// <reference path="../lib/ts/phaser.comments.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LD35;
(function (LD35) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, { width: 640, height: 480, renderer: Phaser.AUTO, parent: 'content', state: null });
            this.state.add('Main', LD35.MainGame);
            this.state.start('Main');
        }
        return Game;
    }(Phaser.Game));
    LD35.Game = Game;
})(LD35 || (LD35 = {}));
window.onload = function () {
    var game = new LD35.Game();
};
//# sourceMappingURL=game.js.map