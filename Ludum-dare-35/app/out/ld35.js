var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LD35;
(function (LD35) {
    (function (Shape) {
        Shape[Shape["Circle"] = 0] = "Circle";
        Shape[Shape["Square"] = 1] = "Square";
        Shape[Shape["Triangle"] = 2] = "Triangle";
        Shape[Shape["Star"] = 3] = "Star";
    })(LD35.Shape || (LD35.Shape = {}));
    var Shape = LD35.Shape;
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
            this.shapeindex = Shape.Circle;
            this.frame = this.shapeindex;
            this.shapeshifttimer = 0;
            this.heroJumptimer = 0;
            this.game.add.existing(this);
            this.game.camera.follow(this);
        }
        Hero.prototype.getCurrentShape = function () {
            return this.shapeindex;
        };
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
        Level.prototype.sceneSetup = function (json, level) {
            // magic ensues
            var tileWidth = json.tilewidth;
            var tileHeight = json.tileheight;
            var width = json.layers[level].width;
            var height = json.layers[level].height;
            var row = -1;
            var col = -1;
            for (var i = 0; i < json.layers[level].data.length; i++) {
                col = i % width;
                // use the mod to wrap around to next row
                if (i % width === 0) {
                    row++;
                }
                if (json.layers[level].data[i] === 1) {
                    var temp = this.platformCollidableTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 0);
                    temp.body.immovable = true;
                }
                else if (json.layers[level].data[i] === 9) {
                    var non = this.platformNonCollidableTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 8);
                    non.body.immovable = true;
                }
                else if (json.layers[level].data[i] === 7) {
                    var gate = this.platformGateTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 6);
                    gate.body.immovable = true;
                }
                else if (json.layers[level].data[i] === 11) {
                    //var gate = this.platformGateTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 10);
                    //gate.body.immovable = true;
                    this.exit = this.game.add.sprite(col * tileWidth, row * tileHeight, "tiles", 10);
                    this.game.physics.arcade.enable(this.exit);
                    this.exit.body.immovable = true;
                }
            }
        };
        return Level;
    }(Phaser.State));
    LD35.Level = Level;
    /// Intended as a training level
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.apply(this, arguments);
            this.gateOpen = false;
        }
        Level1.prototype.preload = function () {
            this.game.load.spritesheet("shapes", "assets/spritebasic.png", 32, 32, 4);
            this.game.load.spritesheet("tiles", "assets/leveltiles.png", 32, 32, 16);
            this.game.load.json('map1', 'assets/map1.json');
        };
        Level1.prototype.create = function () {
            // enable physics on the game
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.world.setBounds(0, 0, 1280, 960);
            this.platformCollidableTileGroup = this.game.add.group();
            this.platformCollidableTileGroup.enableBody = true;
            this.platformCollidableTileGroup.physicsBodyType = Phaser.Physics.ARCADE;
            this.platformNonCollidableTileGroup = this.game.add.group();
            this.platformNonCollidableTileGroup.enableBody = true;
            this.platformNonCollidableTileGroup.physicsBodyType = Phaser.Physics.ARCADE;
            this.platformGateTileGroup = this.game.add.group();
            this.platformGateTileGroup.enableBody = true;
            this.platformGateTileGroup.physicsBodyType = Phaser.Physics.ARCADE;
            var json = this.game.cache.getJSON('map1');
            this.sceneSetup(json, 0);
            this.hero = new LD35.Hero(this.game, 100, 860, "shapes", 0);
            // console.log();
        };
        Level1.prototype.update = function () {
            // Do collision checks between player and platform
            this.game.physics.arcade.collide(this.hero, this.platformCollidableTileGroup);
            this.game.physics.arcade.collide(this.hero, this.platformNonCollidableTileGroup, this.collide, null, this);
            this.game.physics.arcade.collide(this.hero, this.platformGateTileGroup);
            this.game.physics.arcade.collide(this.hero, this.exit, this.exitCollide, null, this);
        };
        Level1.prototype.render = function () {
        };
        Level1.prototype.collide = function (a, b) {
            // if hero shape matches ...
            var shape = this.hero.getCurrentShape();
            if (shape === LD35.Shape.Triangle) {
                this.platformNonCollidableTileGroup.setAll("frame", 9);
                // open the gate to go to next level
                this.game.add.tween(this.platformGateTileGroup).to({ alpha: 0 }, 2000, "Linear", true, 0, 0, false).onComplete.add(this.removeCollide, this);
            }
        };
        Level1.prototype.removeCollide = function () {
            this.platformGateTileGroup.setAll("body.enable", false);
            this.gateOpen = true;
        };
        Level1.prototype.exitCollide = function (a, b) {
            if (this.gateOpen === true) {
                alert("go to next ->");
            }
        };
        return Level1;
    }(Level));
    LD35.Level1 = Level1;
})(LD35 || (LD35 = {}));
/// <reference path="../lib/ts/phaser.comments.d.ts"/>
/// <reference path="game.ts"/>
/// <reference path="hero.ts"/>
/// <reference path="level1.ts"/> 
/// <reference path="references.ts"/>
var LD35;
(function (LD35) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, { width: 640, height: 480, renderer: Phaser.AUTO, parent: 'content', state: null });
            this.state.add('level1', LD35.Level1);
            this.state.start('level1');
        }
        return Game;
    }(Phaser.Game));
    LD35.Game = Game;
})(LD35 || (LD35 = {}));
window.onload = function () {
    var game = new LD35.Game();
};
//# sourceMappingURL=ld35.js.map