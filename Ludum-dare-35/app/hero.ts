module LD35 {

    export class Hero extends Phaser.Sprite {

        game: Phaser.Game;

        constructor(gameReference: Phaser.Game, x: number, y: number, key: string, frame: number) {
            super(gameReference, x, y, key, frame);
        }

        update() {
            
        }



    }
}