/// <reference path="references.ts"/>
module LD35 {
    export class StartScreen extends Phaser.Sprite {

        start: boolean; // 

        create() {

            this.start = false;

            this.game.add.sprite(0, 0, 'start');



            this.game.input.keyboard.onDownCallback = () => {
                if (!this.start) {

                    this.start = true;

                    this.game.state.start('level1', true, false);

                }
            }
        }


    }
}