module LD35 {
    export class MainGame extends Phaser.State {

        hero: Phaser.Sprite;
        shapeindex: number;
        maxShapes: number;
        shapeshifttimer: number;

        json: any;

        platformTileGroup: Phaser.Group; // collidable tiles lets say ...

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
            //this.platformTileGroup.
            this.platformTileGroup.physicsBodyType = Phaser.Physics.ARCADE;

            var json = this.game.cache.getJSON('map1');

            this.sceneSetup(json);

            // enable physics on the player
            this.hero = this.game.add.sprite(100, 864, "shapes");
            this.game.physics.enable(this.hero, Phaser.Physics.ARCADE);
            this.hero.anchor.setTo(0.5, 0.5);
            this.hero.body.gravity.y = 100;
            this.hero.body.collideWorldBounds = true;
            this.hero.body.velocity.dr
            this.maxShapes = 4;
            this.shapeindex = 0;
            this.hero.frame = this.shapeindex;
            this.shapeshifttimer = 0;
            

            // console.log();
            this.game.camera.follow(this.hero);
        }

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

            //debugger;


        }

        update() {
            this.game.physics.arcade.collide(this.hero, this.platformTileGroup);

            // zero out the velocity every loop
            this.hero.body.velocity.x = 0;

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.D) || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.hero.body.velocity.x = 150;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.A) || this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.hero.body.velocity.x -= 150;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.game.time.now > this.shapeshifttimer) {

                this.shapeindex = (this.shapeindex + 1) % this.maxShapes; // use modulus to wrap

                this.hero.frame = this.shapeindex;

                this.shapeshifttimer = this.game.time.now + 250;
            }

        }

        render() {

        }
    }
}