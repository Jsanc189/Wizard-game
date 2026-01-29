/* Art assets are made by cup Nooble https://cupnooble.itch.io/
Code created by Jackie Sanchez
Date: 1/27/2026
Description:  PreloadScene loads all game assets before starting the main game scene.
*/

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        console.log("PreloadScene started...");
        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();
            loadingBar.fillStyle(0xffffff, 1);
            loadingBar.fillRect(0, 0, value * 800, 1);
        });

        this.load.on('complete', () => {
            loadingBar.destroy();
        });

        this.load.spritesheet("grass", "./assets/tiles/Grass_Tile_layers2.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("dirt", "./assets/tiles/Soil_Ground_Tiles.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("watered_dirt", "./assets/tiles/Watered_Soil.png", {
            frameWidth: 16,
            frameHeight: 16
        });


    }

    create() {
        this.scene.start("FarmScene");
        this.scene.launch("UIScene");
    }
}