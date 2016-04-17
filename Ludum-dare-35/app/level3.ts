/// <reference path="references.ts"/>
module LD35 {
    export class Level3 extends Level {

        hero: Hero;

        unlocked: boolean;

        fireballGroup: Phaser.Group;

        switchA: boolean;
        switchB: boolean;

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

            // movable blocks for activating the switches
            this.platformMovableBlock = this.game.add.group();
            this.platformMovableBlock.enableBody = true;
            this.platformMovableBlock.physicsBodyType = Phaser.Physics.ARCADE;

            // the switches themselves
            this.platformL3SwitchGroup = this.game.add.group();
            this.platformL3SwitchGroup.enableBody = true;
            this.platformL3SwitchGroup.physicsBodyType = Phaser.Physics.ARCADE;

            // fire ball group
            this.fireballGroup = this.game.add.group();
            this.fireballGroup.enableBody = true;
            this.fireballGroup.physicsBodyType = Phaser.Physics.ARCADE;
            this.fireballGroup.createMultiple(20, 'tiles', 51, false);
            this.fireballGroup.setAll('outOfBoundsKill', true);
            this.fireballGroup.setAll('checkWorldBounds', true);

            this.game.time.events.add(Phaser.Timer.SECOND * 1, this.fireProjectile, this);

            var json = this.game.cache.getJSON('map1');
            
            this.sceneSetup(json, 2);

            // this.hero = new Hero(this.game, 100, 860, "shapes", 0);
            this.hero = new Hero(this.game, this.spawnPoint.x, this.spawnPoint.y, "shapes", 0);

            this.unlocked = false;

            this.switchA = false;
            this.switchB = false;
        }

        update() {
            // Do collision checks between player and platform
            this.game.physics.arcade.collide(this.hero, this.platformCollidableTileGroup);

            //this.game.physics.arcade.collide(this.hero, this.platformNonCollidableTileGroup, this.collide, null, this);

            this.game.physics.arcade.collide(this.hero, this.platformGateTileGroup);

            this.game.physics.arcade.collide(this.hero, this.exit, this.exitCollide, null, this);

            this.game.physics.arcade.collide(this.hero, this.platformGuessTileGroup, this.guessIsBeingTouched, null, this);

            this.game.physics.arcade.collide(this.hero, this.platformMovableBlock);

            this.game.physics.arcade.collide(this.platformMovableBlock, this.platformCollidableTileGroup);

            this.game.physics.arcade.collide(this.platformMovableBlock, this.platformL3SwitchGroup, this.switchActivated, null, this);

            // collison between player and fireball
            this.game.physics.arcade.collide(this.hero, this.fireballGroup, this.heroFireBallContact, null, this);
        }

        exitCollide() {
            // todo
        }

        heroFireBallContact() {
            this.hero.body.x = this.spawnPoint.x;
            this.hero.body.y = this.spawnPoint.y;
        }

        removeCollide() {
            this.platformGateTileGroup.setAll("body.enable", false);

            this.gateOpen = true;
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

            if (this.guessArray[0].isSet && this.guessArray[1].isSet && this.guessArray[2].isSet && this.guessArray[3].isSet) {
                console.log("proceed to check");
                // yes, lets embed the answer in the code, there was a clue in the level too ...
                if (this.guessArray[0].shape === Shape.Star && this.guessArray[1].shape === Shape.Square && this.guessArray[2].shape === Shape.Star && this.guessArray[3].shape === Shape.Circle) {
                    console.log("we have match, show green and unlock the gate");

                    this.unlocked = true;

                    // reveal!!!!
                    this.guessArray[0].spriteRef.frame = 33;
                    this.guessArray[1].spriteRef.frame = 25;
                    this.guessArray[2].spriteRef.frame = 33;
                    this.guessArray[3].spriteRef.frame = 41;

                    // todo unlock the gate
                    this.game.add.tween(this.platformGateTileGroup).to({ alpha: 0 }, 2000, "Linear", true, 0, 0, false).onComplete.add(this.removeCollide, this);
                    //this.platformGuessTileGroup.setAll({"frame": });
                } else {
                    // display red
                    this.guessArray[0].spriteRef.frame = 57;
                    this.guessArray[1].spriteRef.frame = 57;
                    this.guessArray[2].spriteRef.frame = 57;
                    this.guessArray[3].spriteRef.frame = 57;
                    // todo timer !!! to reset

                    this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
                        // reset
                        this.guessArray[0].isSet = false;
                        this.guessArray[1].isSet = false;
                        this.guessArray[2].isSet = false;
                        this.guessArray[3].isSet = false;


                        this.guessArray[0].spriteRef.frame = 48;
                        this.guessArray[1].spriteRef.frame = 48;
                        this.guessArray[2].spriteRef.frame = 48;
                        this.guessArray[3].spriteRef.frame = 48;

                    }, this);
                }
            }
        }

        fireProjectile() {
            // pick one of the two blocks
            var rand = this.game.rnd.integerInRange(0, 1);

            var block = this.shooterBlock[rand];

            var fb = this.fireballGroup.getFirstExists(false);

            fb.reset(block.x, block.y); 

            fb.body.velocity.x = -1 * this.game.rnd.integerInRange(200, 250);

            if (this.switchA === false || this.switchB === false) {
                
                this.game.time.events.add(Phaser.Timer.SECOND * 1, this.fireProjectile, this);
            }
        }
        
        switchActivated(a: any, b: any) {

            if (this.switchA && this.switchB) return;

            if (a.name === b.name) {
                a.frame = 17; // switch
                b.frame = 17;

                if (a.name === 0)
                    this.switchA = true;

                if (a.name === 1)
                    this.switchB = true;
            }
        }
    }

}