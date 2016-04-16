
/// <reference path="references.ts"/>

module LD35 {
    export class Game extends Phaser.Game {
        constructor() {
            super({ width: 640, height: 480, renderer: Phaser.AUTO, parent: 'content', state: null });

            this.state.add("boot", Boot)
            this.state.add('level1', Level1);
            this.state.add('level2', Level2);

            this.state.start('boot');

        }
    }
}


window.onload = () => {
    var game = new LD35.Game();
}



