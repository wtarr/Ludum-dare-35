/// <reference path="references.ts"/>

module LD35 {

    export class Level2 extends Level {

        hero: Hero;

        json: any;

        preload() {
            //this.game.load.spritesheet("shapes", "assets/spritebasic.png", 32, 32, 4);

            //this.game.load.spritesheet("tiles", "assets/leveltiles.png", 32, 32, 64);

            //this.game.load.json('map1', 'assets/map1.json');
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

            this.sceneSetup(json, 1);

            this.hero = new Hero(this.game, 100, 860, "shapes", 0);
        }

        update() {
            // Do collision checks between player and platform
            this.game.physics.arcade.collide(this.hero, this.platformCollidableTileGroup);

            //this.game.physics.arcade.collide(this.hero, this.platformNonCollidableTileGroup, this.collide, null, this);

           // this.game.physics.arcade.collide(this.hero, this.platformGateTileGroup);

            //this.game.physics.arcade.collide(this.hero, this.exit, this.exitCollide, null, this);
        }

        render() {
            
        }
    }
}