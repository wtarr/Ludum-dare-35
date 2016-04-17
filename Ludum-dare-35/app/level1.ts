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

            this.hero = new Hero(this.game, this.spawnPoint.x, this.spawnPoint.y, "shapes", 0);

            this.createFireballGroup(this.game);

            this.game.time.events.add(Phaser.Timer.SECOND * 1, this.fireProjectile, this);

            var style = { font: "12px Arial", fontSize: 15, fill: "#DB9D4B", strokeThickness: 6, stroke: "", align: "center" };

            // console.log();
            this.game.add.text(70, 750, 'WASD or arrow keys for movement', style);

            this.game.add.text(680, 750, 'Space to shape shift', style);

            var music = this.game.add.audio("ldmp3", 1, true);
            music.loop = true;
            music.play();


        }


        update() {

            // Do collision checks between player and platform
            this.game.physics.arcade.collide(this.hero, this.platformCollidableTileGroup);

            this.game.physics.arcade.collide(this.hero, this.platformNonCollidableTileGroup, this.collide, null, this);

            this.game.physics.arcade.collide(this.hero, this.platformGateTileGroup);

            this.game.physics.arcade.collide(this.hero, this.exit, this.exitCollide, null, this);

            this.game.physics.arcade.collide(this.hero, this.fireballGroup, this.heroFireBallContact, null, this);
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

        heroFireBallContact(a, b) {
            b.kill();
            this.hero.body.x = this.spawnPoint.x;
            this.hero.body.y = this.spawnPoint.y;
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

        fireProjectile() {

            var block = this.shooterBlock[0];

            var fb = this.fireballGroup.getFirstExists(false);

            fb.reset(block.x, block.y + 40);

            fb.rotation = 270 * Math.PI / 180;

            fb.body.velocity.y = this.game.rnd.integerInRange(200, 250);

            this.game.time.events.add(Phaser.Timer.SECOND * 1, this.fireProjectile, this);
        }
    }
}
