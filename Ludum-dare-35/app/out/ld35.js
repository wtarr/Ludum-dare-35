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
            this.game = gameReference;
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.anchor.setTo(0.5, 0.5);
            this.body.gravity.y = 200;
            this.body.collideWorldBounds = true;
            this.maxShapes = 4;
            this.shapeindex = 0;
            this.frame = this.shapeindex;
            this.shapeshifttimer = 0;
            this.heroJumptimer = 0;
            this.game.add.existing(this);
            this.game.camera.follow(this);
        }
        Hero.prototype.update = function () {
            // zero out the velocity every loop
            this.body.velocity.x = 0;
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.D) || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.velocity.x = 150;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.A) || this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.velocity.x -= 150;
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.W) || this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                if (this.body.touching.down && this.game.time.now > this.heroJumptimer) {
                    this.body.velocity.y = -150;
                    this.heroJumptimer = this.game.time.now + 150;
                }
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.game.time.now > this.shapeshifttimer) {
                this.shapeindex = (this.shapeindex + 1) % this.maxShapes; // use modulus to wrap
                this.frame = this.shapeindex;
                this.shapeshifttimer = this.game.time.now + 250;
            }
        };
        return Hero;
    }(Phaser.Sprite));
    LD35.Hero = Hero;
})(LD35 || (LD35 = {}));
/// <reference path="references.ts"/>
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
/// <reference path="game.ts"/>
/// <reference path="hero.ts"/>
/// <reference path="maingame.ts"/> 
/// <reference path="../lib/ts/phaser.comments.d.ts"/>
/// <reference path="references.ts"/>
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
//# sourceMappingURL=ld35.js.map