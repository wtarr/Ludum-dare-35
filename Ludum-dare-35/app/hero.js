var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LD35;
(function (LD35) {
    var Hero = (function (_super) {
        __extends(Hero, _super);
        function Hero(gameReference, x, y, key, frame) {
            _super.call(this, gameReference, x, y, key, frame);
        }
        Hero.prototype.update = function () {
        };
        return Hero;
    }(Phaser.Sprite));
    LD35.Hero = Hero;
})(LD35 || (LD35 = {}));
//# sourceMappingURL=hero.js.map