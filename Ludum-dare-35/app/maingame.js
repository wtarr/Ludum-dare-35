var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LD35;
(function (LD35) {
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
            //this.platformTileGroup.
            this.platformTileGroup.physicsBodyType = Phaser.Physics.ARCADE;
            var json = this.game.cache.getJSON('map1');
            this.sceneSetup(json);
            // enable physics on the player
            this.hero = this.game.add.sprite(100, 864, "shapes");
            this.game.physics.enable(this.hero, Phaser.Physics.ARCADE);
            this.hero.anchor.setTo(0.5, 0.5);
            this.hero.body.gravity.y = 100;
            this.hero.body.collideWorldBounds = true;
            this.hero.body.velocity.dr;
            this.maxShapes = 4;
            this.shapeindex = 0;
            this.hero.frame = this.shapeindex;
            this.shapeshifttimer = 0;
            // console.log();
            this.game.camera.follow(this.hero);
        };
        MainGame.prototype.sceneSetup = function (json) {
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
            //debugger;
        };
        MainGame.prototype.update = function () {
            this.game.physics.arcade.collide(this.hero, this.platformTileGroup);
            // zero out the velocity every loop
            this.hero.body.velocity.x = 0;
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.D) || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.hero.body.velocity.x = 150;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.A) || this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.hero.body.velocity.x -= 150;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.game.time.now > this.shapeshifttimer) {
                this.shapeindex = (this.shapeindex + 1) % this.maxShapes; // use modulus to wrap
                this.hero.frame = this.shapeindex;
                this.shapeshifttimer = this.game.time.now + 250;
            }
        };
        MainGame.prototype.render = function () {
        };
        return MainGame;
    }(Phaser.State));
    LD35.MainGame = MainGame;
})(LD35 || (LD35 = {}));
//# sourceMappingURL=maingame.js.map