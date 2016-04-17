/// <reference path="references.ts"/>

module LD35 {
    export class Level extends Phaser.State {
        gateOpen = false;

        platformCollidableTileGroup: Phaser.Group; // collidable tiles lets say ...
        platformNonCollidableTileGroup: Phaser.Group;

        platformGateTileGroup: Phaser.Group;

        platformGuessTileGroup: Phaser.Group;

        platformMovableBlock: Phaser.Group;

        platformL3ClueCollidable: Phaser.Group;

        platformL3SwitchGroup: Phaser.Group;

        exit: Phaser.Sprite;

        guessArray: {};

        spawnPoint: Phaser.Point;

        shooterBlock: Array<Phaser.Sprite>;

        fireballGroup: Phaser.Group;
        
        createFireballGroup(game : Phaser.Game) {
            // fire ball group
            this.fireballGroup = game.add.group();
            this.fireballGroup.enableBody = true;
            this.fireballGroup.physicsBodyType = Phaser.Physics.ARCADE;
            this.fireballGroup.createMultiple(20, 'tiles', 51, false);
            this.fireballGroup.setAll('outOfBoundsKill', true);
            this.fireballGroup.setAll('checkWorldBounds', true);
        }

        sceneSetup(json: any, level: number) {
            // magic ensues
            var tileWidth = json.tilewidth;
            var tileHeight = json.tileheight;

            var width = json.layers[level].width;
            var height = json.layers[level].height;

            var row = -1;
            var col = -1;

            var guessId = 0;

            var switchId = 0;
            var moveableBlockId = 0;

            var tempBlockRef: Phaser.Sprite;

            this.spawnPoint = new Phaser.Point();

            this.shooterBlock = [];

            for (var i = 0; i < json.layers[level].data.length; i++) {

                col = i % width;
                // use the mod to wrap around to next row
                if (i % width === 0) {
                    row++;
                }

                if (json.layers[level].data[i] === 36) {
                    // set level spawn point
                    this.spawnPoint.x = col * tileWidth;
                    this.spawnPoint.y = row * tileHeight;
                }
                else if (json.layers[level].data[i] === 1) {
                    var temp = this.platformCollidableTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 0);
                    temp.body.immovable = true;
                } else if (json.layers[level].data[i] === 17) { // red triangle
                    if (level === 0) {
                        var non = this.platformNonCollidableTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 16);
                        non.body.immovable = true;
                    }
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
                else if (json.layers[level].data[i] === 18) { // clue level 2
                    tempBlockRef = this.platformCollidableTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 17);
                    tempBlockRef.body.immovable = true;
                }
                else if (json.layers[level].data[i] === 34) { // clue level 2 
                    tempBlockRef = this.platformCollidableTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 33);
                    tempBlockRef.body.immovable = true;
                }
                else if (json.layers[level].data[i] === 42) { // clue level 3
                    tempBlockRef = this.platformCollidableTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 41); // todo make collidable
                    tempBlockRef.body.immovable = true;
                }
                else if (json.layers[level].data[i] === 26) {
                    tempBlockRef = this.platformCollidableTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 25); // todo make collidable
                    tempBlockRef.body.immovable = true;
                }
                else if (json.layers[level].data[i] === 12) { // non - exitable gate
                    var nonExit = this.platformCollidableTileGroup.create(col * tileWidth, row * tileHeight, "tiles", 11);
                    nonExit.body.immovable = true;
                }
                else if (json.layers[level].data[i] === 20) { // non - exitable block doesnt need collision
                    this.game.add.sprite(col * tileWidth, row * tileHeight, "tiles", 19);
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
                else if (json.layers[level].data[i] === 44) { // switch block
                    var sw = this.platformL3SwitchGroup.create(col * tileWidth, row * tileHeight, "tiles", 43);
                    sw.body.immovable = true;
                    sw.name = switchId;
                    switchId += 1;
                }
                else if (json.layers[level].data[i] === 45) // movable block
                {

                    var block = this.platformMovableBlock.create(col * tileWidth, row * tileHeight, "tiles", 44);
                    block.body.immovable = false;
                    //block.body.checkCollision.right = false;
                    block.body.checkCollision.top = false;
                    block.body.gravity.y = 150;

                    block.name = moveableBlockId;
                    moveableBlockId += 1;

                }
                else if (json.layers[level].data[i] === 60) // shooter block
                {
                    tempBlockRef = this.game.add.sprite(col * tileWidth, row * tileHeight, "tiles", 59);

                    //tempBlockRef.anchor.x = 0.5;
                    //tempBlockRef.anchor.y = 0.5;

                    this.shooterBlock.push(tempBlockRef);
                }
            }
        }

    }
}