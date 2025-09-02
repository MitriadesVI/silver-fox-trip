// js/scenes/GameOver.js
class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    init(data) {
        // Recibimos la puntuación desde la GameScene
        this.finalScore = data.score;
    }

    create() {
        this.add.text(this.sys.game.config.width / 2, 250, '¡GAME OVER!', {
            fontSize: '48px', fill: '#FF0000', align: 'center'
        }).setOrigin(0.5);

        this.add.text(this.sys.game.config.width / 2, 350, 'Puntuación Final: ' + this.finalScore, {
            fontSize: '32px', fill: '#FFFFFF', align: 'center'
        }).setOrigin(0.5);

        const retryButton = this.add.text(this.sys.game.config.width / 2, 500, 'Jugar de Nuevo', {
            fontSize: '32px', fill: '#00FF00', backgroundColor: '#333333', padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        retryButton.on('pointerdown', () => {
            this.scene.start('GameScene'); // Reinicia el juego volviendo a la GameScene
        });
    }
}