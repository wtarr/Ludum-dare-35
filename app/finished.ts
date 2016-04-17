module LD35 {
    export class Finish extends Phaser.State {

        create() {
            // todo ...
            var style = { font: "12px Arial", fontSize: 15, fill: "#DB9D4B", strokeThickness: 6, stroke: "", align: "center" };

            var text = this.game.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, 'You have finished!\n\n Thank you for playing.', style);
            text.anchor.set(0.5);

        }

    }
}