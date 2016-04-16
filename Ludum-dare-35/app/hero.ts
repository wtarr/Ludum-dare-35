﻿
module LD35 {
    export class Hero extends Phaser.Sprite {

        game: Phaser.Game;
        shapeindex: number;
        maxShapes: number;
        shapeshifttimer: number;

        heroJumptimer: number;

        constructor(gameReference: Phaser.Game, x: number, y: number, key: string, frame: number) {

            super(gameReference, x, y, key, frame);

            this.game = gameReference;

            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.anchor.setTo(0.5, 0.5);
            this.body.gravity.y = 200;
            this.body.collideWorldBounds = true;
            this.maxShapes = 4;
            this.shapeindex = 0;
            this.frame = this.shapeindex;
            this.shapeshifttimer = 0;
            this.heroJumptimer = 0;

            this.game.add.existing(this);

            this.game.camera.follow(this);

        }

        update() {
            // zero out the velocity every loop
            this.body.velocity.x = 0;

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.D) || this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.velocity.x = 150;
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.A) || this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.velocity.x -= 150;
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.W) || this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                if (this.body.touching.down && this.game.time.now > this.heroJumptimer) {

                    this.body.velocity.y = -150;

                    this.heroJumptimer = this.game.time.now + 150;
                }

            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.game.time.now > this.shapeshifttimer) {

                this.shapeindex = (this.shapeindex + 1) % this.maxShapes; // use modulus to wrap

                this.frame = this.shapeindex;

                this.shapeshifttimer = this.game.time.now + 250;
            }
        }


    }
}
