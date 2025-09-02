// js/scenes/GameScene.js
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        this.player = null;
        this.cursors = null;
        this.playerSpeed = 250;
        this.life = 100;
        this.score = 0;
    }

    preload() {
        this.load.image('player', 'assets/images/march.png');
        this.load.image('beer', 'assets/images/beer.png');
        this.load.image('whisky', 'assets/images/whisky.png');
        this.load.image('police', 'assets/images/police.png');
        this.load.image('powerup', 'assets/images/powerup.png');
        this.load.image('road', 'assets/images/road.png');
    }

    create() {
        const road = this.add.image(0, 0, 'road').setOrigin(0, 0);
        road.displayWidth = this.sys.game.config.width;
        road.displayHeight = this.sys.game.config.height;
        road.setDepth(-1);

        this.player = this.physics.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height - 100, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.5); // <<--- TAMAÑO DEL CARRO CORREGIDO

        this.cursors = this.input.keyboard.createCursorKeys();
        this.beerGroup = this.physics.add.group();
        this.whiskyGroup = this.physics.add.group();
        this.policeGroup = this.physics.add.group();
        this.powerUpGroup = this.physics.add.group();

        this.time.addEvent({ delay: 1800, callback: this.spawnBeer, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 5500, callback: this.spawnWhisky, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 12000, callback: this.spawnPolice, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 10000, callback: this.spawnPowerUp, callbackScope: this, loop: true });

        this.physics.add.overlap(this.player, this.beerGroup, this.handleHit, null, this);
        this.physics.add.overlap(this.player, this.whiskyGroup, this.handleHit, null, this);
        this.physics.add.overlap(this.player, this.policeGroup, this.handleHit, null, this);
        this.physics.add.overlap(this.player, this.powerUpGroup, this.handleCollectPowerUp, null, this);

        this.lifeText = this.add.text(16, 16, 'Vida: 100', { fontSize: '24px', fill: '#FFFFFF', stroke: '#000000', strokeThickness: 4 });
        this.scoreText = this.add.text(16, 50, 'Puntuación: 0', { fontSize: '24px', fill: '#FFFFFF', stroke: '#000000', strokeThickness: 4 });

        this.time.addEvent({ delay: 100, callback: () => { this.score += 1; }, callbackScope: this, loop: true });
    }

    update() {
        this.scoreText.setText('Puntuación: ' + this.score);
        if (this.cursors.left.isDown) { this.player.setVelocityX(-this.playerSpeed); }
        else if (this.cursors.right.isDown) { this.player.setVelocityX(this.playerSpeed); }
        else { this.player.setVelocityX(0); }
    }

    spawnBeer() { this.spawnItem('beer', 200, 0.4); }
    spawnWhisky() { this.spawnItem('whisky', 250, 0.4); }
    spawnPolice() { this.spawnItem('police', 350, 0.6); }
    spawnPowerUp() { this.spawnItem('powerup', 150, 0.6); }

    spawnItem(key, velocity, scale) {
        const x = Phaser.Math.Between(50, this.sys.game.config.width - 50);
        let group;
        if (key === 'beer') group = this.beerGroup;
        if (key === 'whisky') group = this.whiskyGroup;
        if (key === 'police') group = this.policeGroup;
        if (key === 'powerup') group = this.powerUpGroup;
        
        const item = group.create(x, -50, key);
        item.setVelocityY(velocity);
        item.setScale(scale);
        item.setData('damage', this.getDamage(key)); // Guardamos el daño/efecto en el objeto
    }
    
    getDamage(key) {
        if (key === 'beer') return { life: -10, speed: 0.95 };
        if (key === 'whisky') return { life: -25 };
        if (key === 'police') return { life: -40 };
        return { life: 0 };
    }

    handleHit(player, item) {
        const data = item.getData('damage');
        item.destroy();
        this.life += data.life;
        if (data.speed) this.playerSpeed *= data.speed;
        this.cameras.main.shake(100, 0.01);
        this.updateLifeText();
    }

    handleCollectPowerUp(player, powerup) {
        powerup.destroy();
        this.life = Math.min(100, this.life + 20);
        this.playerSpeed += 20;
        this.score += 100;
        this.updateLifeText();
    }

    updateLifeText() {
        this.lifeText.setText('Vida: ' + Math.max(0, this.life));
        if (this.life <= 0) {
            // En lugar de reiniciar, vamos a la escena de GameOver y le pasamos la puntuación
            this.scene.start('GameOver', { score: this.score });
        }
    }
}