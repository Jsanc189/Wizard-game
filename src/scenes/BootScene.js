/*
Created by Jackie Sanchez
Date: 1/27/2026
Description:  Loads initial assets required for the game to start.
*/

export default class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        console.log("BootScene started...");
        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();
            loadingBar.fillStyle(0xffffff, 1);
            loadingBar.fillRect(0, 0, value * 800, 1);
        });

        this.load.on('complete', () => {
            loadingBar.destroy();
        });
    }

    create() {
        
        this.input.mouse.disableContextMenu();

        this.game.events.on(
            Phaser.Core.Events.BLUR,
            () => {
                this.scene.pause("FarmScene");
            }
        );

        this.game.events.on(
            Phaser.Core.Events.FOCUS,
            () => {
                this.scene.resume("FarmScene");
            }
        );

        this.scene.start("PreloadScene");
    }

    update() {
        this.scene.start('PreloadScene');
    }
}