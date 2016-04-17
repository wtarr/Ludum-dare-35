/// <reference path="references.ts"/>
/// <reference path="level.ts"/>

module LD35 {

    export class Level2 extends Level {

        hero: Hero;

        json: any;

        unlocked: boolean;

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

            this.platformGuessTileGroup = this.game.add.group();
            this.platformGuessTileGroup.enableBody = true;
            this.platformGuessTileGroup.physicsBodyType = Phaser.Physics.ARCADE;

            var json = this.game.cache.getJSON('map1');

            this.sceneSetup(json, 1);

            // this.hero = new Hero(this.game, 100, 860, "shapes", 0);
            this.hero = new Hero(this.game, 100, 100, "shapes", 0);

            this.unlocked = false;
        }

        update() {
            // Do collision checks between player and platform
            this.game.physics.arcade.collide(this.hero, this.platformCollidableTileGroup);

            //this.game.physics.arcade.collide(this.hero, this.platformNonCollidableTileGroup, this.collide, null, this);

            this.game.physics.arcade.collide(this.hero, this.platformGateTileGroup);

            this.game.physics.arcade.collide(this.hero, this.exit, this.exitCollide, null, this);

            this.game.physics.arcade.collide(this.hero, this.platformGuessTileGroup, this.guessIsBeingTouched, null, this);
        }

        render() {

        }
        
        removeCollide() {
            this.platformGateTileGroup.setAll("body.enable", false);

            this.gateOpen = true;
        }

        exitCollide(a: any, b: any) {
            if (this.gateOpen) {
                //alert("go to next ->");

                this.game.state.start('level2', true, false);
            }
        }



        guessIsBeingTouched(player: any, block: any) {
            // set in lock position with current shape
            // when all three are in lock
            // we check if matches code
            // if yes (unlock the gate) and set all frames to green
            // else set to red with a timer
            // when timer expires go reset back to original and await next guess
            if (this.unlocked) return;

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
                if (this.guessArray[0].shape === Shape.Triangle && this.guessArray[1].shape === Shape.Star && this.guessArray[2].shape === Shape.Circle) {
                    console.log("we have match, show green and unlock the gate");

                    this.unlocked = true;

                    // reveal!!!!
                    this.guessArray[0].spriteRef.frame = 17;
                    this.guessArray[1].spriteRef.frame = 33;
                    this.guessArray[2].spriteRef.frame = 41;

                    // todo unlock the gate
                    this.game.add.tween(this.platformGateTileGroup).to({ alpha: 0 }, 2000, "Linear", true, 0, 0, false).onComplete.add(this.removeCollide, this);
                    //this.platformGuessTileGroup.setAll({"frame": });
                } else {
                    // display red
                    this.guessArray[0].spriteRef.frame = 57;
                    this.guessArray[1].spriteRef.frame = 57;
                    this.guessArray[2].spriteRef.frame = 57;
                    // todo timer !!! to reset

                    this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
                        // reset
                        this.guessArray[0].isSet = false;
                        this.guessArray[1].isSet = false;
                        this.guessArray[2].isSet = false;

                        this.guessArray[0].spriteRef.frame = 48;
                        this.guessArray[1].spriteRef.frame = 48;
                        this.guessArray[2].spriteRef.frame = 48;

                    }, this);
                }
            }
        }
    }
}