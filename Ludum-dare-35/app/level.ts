/// <reference path="references.ts"/>

module LD35 {
    export class Level extends Phaser.State {
        gateOpen = false;

        platformCollidableTileGroup: Phaser.Group; // collidable tiles lets say ...
        platformNonCollidableTileGroup: Phaser.Group;

        platformGateTileGroup: Phaser.Group;

        platformGuessTileGroup: Phaser.Group;

        exit: Phaser.Sprite;

        guessArray: {};

        sceneSetup(json: any, level: number) {
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
                } else if (json.layers[level].data[i] === 17) { // red triangle
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
                    //this.exit.physicsType = Phaser.Physics.ARCADE;

                }
                else if (json.layers[level].data[i] === 49) {
                    if (this.guessArray == null) {
                        this.guessArray = new Array<Phaser.Sprite>();
                    }

                    var guess = this.platformGuessTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 48);
                    guess.body.immovable = true;
                    guess.name = guessId;

                    this.guessArray[guessId] = new GuessBlock();

                    this.guessArray[guessId].spriteRef = guess;

                    guessId += 1;
                    //guess.body.checkCollision.left = false;
                    //guess.body.checkCollision.right = false;
                    //guess.body.checkCollision.bottom = false;

                    
                }
            }
        }

    }
}