/// <reference path="references.ts"/>

module LD35 {

    
    export class Level extends Phaser.State {

        platformCollidableTileGroup: Phaser.Group; // collidable tiles lets say ...
        platformNonCollidableTileGroup: Phaser.Group;

        platformGateTileGroup: Phaser.Group;

        exit: Phaser.Sprite;

        sceneSetup(json: any, level : number) {
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
                } else if (json.layers[level].data[i] === 9) {
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
                    //this.exit.physicsType = Phaser.Physics.ARCADE;
                    
                }
            }
        }

    }

    /// Intended as a training level
    export class Level1 extends Level {

        hero: Hero;

        json: any;
        
        preload() {
            this.game.load.spritesheet("shapes", "assets/spritebasic.png", 32, 32, 4);

            this.game.load.spritesheet("tiles", "assets/leveltiles.png", 32, 32, 16);

            this.game.load.json('map1', 'assets/map1.json');
        }

        create() {
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

            this.hero = new Hero(this.game, 100, 860, "shapes", 0);

            // console.log();

        }


        update() {

            // Do collision checks between player and platform
            this.game.physics.arcade.collide(this.hero, this.platformCollidableTileGroup);

            this.game.physics.arcade.collide(this.hero, this.platformNonCollidableTileGroup, this.collide, null, this);

            this.game.physics.arcade.collide(this.hero, this.platformGateTileGroup);

            this.game.physics.arcade.collide(this.hero, this.exit, this.exitCollide, null, this);
        }

        render() {

        }

        collide(a: any, b: any) {

            // if hero shape matches ...
            var shape = this.hero.getCurrentShape();

            if (shape === Shape.Triangle) {

                this.platformNonCollidableTileGroup.setAll("frame", 9);
                // open the gate to go to next level

                this.game.add.tween(this.platformGateTileGroup).to({ alpha: 0 }, 2000, "Linear", true, 0, 0, false).onComplete.add(this.removeCollide, this);

            }
        }

        gateOpen : boolean = false;

        removeCollide() {
            this.platformGateTileGroup.setAll("body.enable", false);

            this.gateOpen = true;
        }

        exitCollide(a: any, b: any) {
            if (this.gateOpen === true) {
                alert("go to next ->");
            }
        }
    }
}
