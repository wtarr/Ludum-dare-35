var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="references.ts"/>
var LD35;
(function (LD35) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, { width: 640, height: 480, renderer: Phaser.AUTO, parent: 'content', state: null });
            this.state.add("boot", LD35.Boot);
            this.state.add('level1', LD35.Level1);
            this.state.add('level2', LD35.Level2);
            this.state.start('boot');
        }
        return Game;
    }(Phaser.Game));
    LD35.Game = Game;
})(LD35 || (LD35 = {}));
window.onload = function () {
    var game = new LD35.Game();
};
/// <reference path="references.ts"/>
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
            this.body.gravity.y = 220;
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
                    this.body.velocity.y = -220;
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
var LD35;
(function (LD35) {
    var GuessBlock = (function () {
        function GuessBlock() {
        }
        return GuessBlock;
    }());
    LD35.GuessBlock = GuessBlock;
})(LD35 || (LD35 = {}));
/// <reference path="references.ts"/>
var LD35;
(function (LD35) {
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level() {
            _super.apply(this, arguments);
            this.gateOpen = false;
        }
        Level.prototype.sceneSetup = function (json, level) {
            // magic ensues
            var tileWidth = json.tilewidth;
            var tileHeight = json.tileheight;
            var width = json.layers[level].width;
            var height = json.layers[level].height;
            var row = -1;
            var col = -1;
            var guessId = 0;
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
                else if (json.layers[level].data[i] === 17) {
                    var non = this.platformNonCollidableTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 16);
                    non.body.immovable = true;
                }
                else if (json.layers[level].data[i] === 11) {
                    var gate = this.platformGateTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 10);
                    gate.body.immovable = true;
                }
                else if (json.layers[level].data[i] === 19) {
                    //var gate = this.platformGateTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 10);
                    //gate.body.immovable = true;
                    this.exit = this.game.add.sprite(col * tileWidth, row * tileHeight, "tiles", 18);
                    this.game.physics.arcade.enable(this.exit);
                    this.exit.body.immovable = true;
                }
                else if (json.layers[level].data[i] === 49) {
                    if (this.guessArray == null) {
                        this.guessArray = new Array();
                    }
                    var guess = this.platformGuessTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 48);
                    guess.body.immovable = true;
                    guess.name = guessId;
                    this.guessArray[guessId] = new LD35.GuessBlock();
                    this.guessArray[guessId].spriteRef = guess;
                    guessId += 1;
                }
            }
        };
        return Level;
    }(Phaser.State));
    LD35.Level = Level;
})(LD35 || (LD35 = {}));
/// <reference path="references.ts"/>
/// <reference path="level.ts"/>
var LD35;
(function (LD35) {
    /// Intended as a training level
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.apply(this, arguments);
        }
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
                this.platformNonCollidableTileGroup.setAll("frame", 17);
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
                //alert("go to next ->");
                this.game.state.start('level2', true, false);
            }
        };
        return Level1;
    }(LD35.Level));
    LD35.Level1 = Level1;
})(LD35 || (LD35 = {}));
/// <reference path="references.ts"/>
/// <reference path="level.ts"/>
var LD35;
(function (LD35) {
    var Level2 = (function (_super) {
        __extends(Level2, _super);
        function Level2() {
            _super.apply(this, arguments);
        }
        Level2.prototype.preload = function () {
            //this.game.load.spritesheet("shapes", "assets/spritebasic.png", 32, 32, 4);
            //this.game.load.spritesheet("tiles", "assets/leveltiles.png", 32, 32, 64);
            //this.game.load.json('map1', 'assets/map1.json');
        };
        Level2.prototype.create = function () {
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
            this.platformGuessTileGroup = this.game.add.group();
            this.platformGuessTileGroup.enableBody = true;
            this.platformGuessTileGroup.physicsBodyType = Phaser.Physics.ARCADE;
            var json = this.game.cache.getJSON('map1');
            this.sceneSetup(json, 1);
            // this.hero = new Hero(this.game, 100, 860, "shapes", 0);
            this.hero = new LD35.Hero(this.game, 100, 100, "shapes", 0);
            this.unlocked = false;
        };
        Level2.prototype.update = function () {
            // Do collision checks between player and platform
            this.game.physics.arcade.collide(this.hero, this.platformCollidableTileGroup);
            //this.game.physics.arcade.collide(this.hero, this.platformNonCollidableTileGroup, this.collide, null, this);
            this.game.physics.arcade.collide(this.hero, this.platformGateTileGroup);
            this.game.physics.arcade.collide(this.hero, this.exit, this.exitCollide, null, this);
            this.game.physics.arcade.collide(this.hero, this.platformGuessTileGroup, this.guessIsBeingTouched, null, this);
        };
        Level2.prototype.render = function () {
        };
        Level2.prototype.removeCollide = function () {
            this.platformGateTileGroup.setAll("body.enable", false);
            this.gateOpen = true;
        };
        Level2.prototype.exitCollide = function (a, b) {
            if (this.gateOpen) {
                //alert("go to next ->");
                this.game.state.start('level2', true, false);
            }
        };
        Level2.prototype.guessIsBeingTouched = function (player, block) {
            var _this = this;
            // set in lock position with current shape
            // when all three are in lock
            // we check if matches code
            // if yes (unlock the gate) and set all frames to green
            // else set to red with a timer
            // when timer expires go reset back to original and await next guess
            if (this.unlocked)
                return;
            var guessBlockRef = this.guessArray[block.name];
            if (!guessBlockRef.isSet) {
                block.frame = 56;
                guessBlockRef.shape = this.hero.shapeindex;
                guessBlockRef.isSet = true;
                console.log();
            }
            if (this.guessArray[0].isSet && this.guessArray[1].isSet && this.guessArray[2].isSet) {
                console.log("proceed to check");
                // yes, lets embed the answer in the code, there was a clue in the level too ...
                if (this.guessArray[0].shape === LD35.Shape.Triangle && this.guessArray[1].shape === LD35.Shape.Star && this.guessArray[2].shape === LD35.Shape.Circle) {
                    console.log("we have match, show green and unlock the gate");
                    this.unlocked = true;
                    // reveal!!!!
                    this.guessArray[0].spriteRef.frame = 17;
                    this.guessArray[1].spriteRef.frame = 33;
                    this.guessArray[2].spriteRef.frame = 41;
                    // todo unlock the gate
                    this.game.add.tween(this.platformGateTileGroup).to({ alpha: 0 }, 2000, "Linear", true, 0, 0, false).onComplete.add(this.removeCollide, this);
                }
                else {
                    // display red
                    this.guessArray[0].spriteRef.frame = 57;
                    this.guessArray[1].spriteRef.frame = 57;
                    this.guessArray[2].spriteRef.frame = 57;
                    // todo timer !!! to reset
                    this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
                        // reset
                        _this.guessArray[0].isSet = false;
                        _this.guessArray[1].isSet = false;
                        _this.guessArray[2].isSet = false;
                        _this.guessArray[0].spriteRef.frame = 48;
                        _this.guessArray[1].spriteRef.frame = 48;
                        _this.guessArray[2].spriteRef.frame = 48;
                    }, this);
                }
            }
        };
        return Level2;
    }(LD35.Level));
    LD35.Level2 = Level2;
})(LD35 || (LD35 = {}));
/// <reference path="../lib/ts/phaser.comments.d.ts"/>
/// <reference path="game.ts"/>
/// <reference path="hero.ts"/>
/// <reference path="guessblock.ts"/>
/// <reference path="level.ts"/>
/// <reference path="level1.ts"/>
/// <reference path="level2.ts"/> 
/// <reference path="references.ts"/>
var LD35;
(function (LD35) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.game.load.spritesheet("shapes", "assets/spritebasic.png", 32, 32, 4);
            this.game.load.spritesheet("tiles", "assets/leveltiles.png", 32, 32, 64);
            this.game.load.json('map1', 'assets/map1.json');
        };
        Boot.prototype.create = function () {
            // called after preload so go to next
            this.game.state.start("level2");
        };
        return Boot;
    }(Phaser.State));
    LD35.Boot = Boot;
})(LD35 || (LD35 = {}));
//# sourceMappingURL=ld35.js.map