var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LD35;
(function (LD35) {
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level() {
            _super.apply(this, arguments);
        }
        Level.prototype.sceneSetup = function (json) {
            // magic ensues
            var tileWidth = json.tilewidth;
            var tileHeight = json.tileheight;
            var width = json.layers[0].width;
            var height = json.layers[0].height;
            var row = -1;
            var col = -1;
            for (var i = 0; i < json.layers[0].data.length; i++) {
                col = i % width;
                // use the mod to wrap around to next row
                if (i % width === 0) {
                    row++;
                }
                if (json.layers[0].data[i] === 1) {
                    //var s = new Phaser.Sprite(this.game, col * tileWidth, row * tileHeight, "tiles");
                    // s.frame = 0;
                    var temp = this.platformTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 0);
                    temp.body.immovable = true;
                }
            }
        };
        return Level;
    }(Phaser.State));
    LD35.Level = Level;
    var MainGame = (function (_super) {
        __extends(MainGame, _super);
        function MainGame() {
            _super.apply(this, arguments);
        }
        MainGame.prototype.preload = function () {
            this.game.load.spritesheet("shapes", "assets/spritebasic.png", 32, 32, 4);
            this.game.load.spritesheet("tiles", "assets/leveltiles.png", 32, 32, 16);
            this.game.load.json('map1', 'assets/map1.json');
        };
        MainGame.prototype.create = function () {
            // enable physics on the game
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.world.setBounds(0, 0, 1280, 960);
            this.platformTileGroup = this.game.add.group();
            this.platformTileGroup.enableBody = true;
            this.platformTileGroup.physicsBodyType = Phaser.Physics.ARCADE;
            var json = this.game.cache.getJSON('map1');
            this.sceneSetup(json);
            this.hero = new LD35.Hero(this.game, 100, 860, "shapes", 0);
            // console.log();
        };
        MainGame.prototype.update = function () {
            // Do collision checks between player and platform
            this.game.physics.arcade.collide(this.hero, this.platformTileGroup);
        };
        MainGame.prototype.render = function () {
        };
        return MainGame;
    }(Level));
    LD35.MainGame = MainGame;
})(LD35 || (LD35 = {}));
//# sourceMappingURL=maingame.js.map