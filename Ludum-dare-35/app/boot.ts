/// <reference path="references.ts"/>
module LD35 {
    export class Boot extends  Phaser.State {
        
        preload() {
            this.game.load.spritesheet("shapes", "assets/spritebasic.png", 32, 32, 4);

            this.game.load.spritesheet("tiles", "assets/leveltiles.png", 32, 32, 64);

            this.game.load.json('map1', 'assets/map1.json');
        }

        create() {
            // called after preload so go to next
            
            this.game.state.start("level2");
        }
    }
}