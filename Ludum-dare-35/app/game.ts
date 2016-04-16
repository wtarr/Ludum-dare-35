/// <reference path="../lib/ts/phaser.comments.d.ts"/>

module LD35 {

    export class Game extends Phaser.Game
    {
        constructor() {
            super({ width: 640, height: 480, renderer: Phaser.AUTO, parent: 'content', state: null });

            this.state.add('Main', LD35.MainGame);

            this.state.start('Main');

        }

        
    }
}

window.onload = () => {
    var game = new LD35.Game();
}



