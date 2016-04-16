/// <reference path="references.ts"/>

module LD35 {


    export class Level extends Phaser.State {

        platformTileGroup: Phaser.Group; // collidable tiles lets say ...

        sceneSetup(json: any) {
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
                    //this.game.world.add(s);
                }

            }
        }

    }

    export class MainGame extends Level {

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

            this.platformTileGroup = this.game.add.group();
            this.platformTileGroup.enableBody = true;
            this.platformTileGroup.physicsBodyType = Phaser.Physics.ARCADE;

            var json = this.game.cache.getJSON('map1');

            this.sceneSetup(json);

            this.hero = new Hero(this.game, 100, 860, "shapes", 0);

            // console.log();

        }


        update() {

            // Do collision checks between player and platform
            this.game.physics.arcade.collide(this.hero, this.platformTileGroup);

        }

        render() {

        }
    }
}
