/// <reference path="references.ts"/>
/// <reference path="level.ts"/>

module LD35 {
    

    /// Intended as a training level
    export class Level1 extends Level {

        hero: Hero;

        json: any;
        
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

                this.platformNonCollidableTileGroup.setAll("frame", 17);
                // open the gate to go to next level

                this.game.add.tween(this.platformGateTileGroup).to({ alpha: 0 }, 2000, "Linear", true, 0, 0, false).onComplete.add(this.removeCollide, this);

            }
        }

        

        removeCollide() {
            this.platformGateTileGroup.setAll("body.enable", false);

            this.gateOpen = true;
        }

        exitCollide(a: any, b: any) {
            if (this.gateOpen === true) {
                //alert("go to next ->");

                this.game.state.start('level2', true, false);
            }
        }
    }
}
