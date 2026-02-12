/*
Created by: Jackie Sanchez
Date: 2/10/2026
Description:  Plant prefab for creating plant objects that can be placed on the grid.
*/

export default class Plant {
    constructor(scene, tileData, plantData) {
        this.scene = scene;
        this.tileData = tileData;
        if (!plantData || !plantData.frames || !Array.isArray(plantData.frames)) {
            console.error("Invalid plant data provided:", plantData);
            return;
        }

        this.key = plantData.key;
        this.frames = plantData.frames;
        this.daysPerStage = plantData.daysPerStage;
        this.currentStage = 0;
        this.dayCounter = 0;
        this.maxStage = this.frames.length - 1;

        this.sprite = tileData.tile.scene.add.sprite(
            tileData.tile.x + scene.tileSize / 2,
            tileData.tile.y + scene.tileSize / 2,
            this.key,
            this.frames[0]
        )
        .setOrigin(0.5)
        .setDepth(5);
    }

    //advances plant growth stageif the tile is watered
    onNewDay() {
        //no water no growth
        if (!this.tileData.isWatered) return;

        this.dayCounter++;

        if (this.dayCounter >= this.daysPerStage) {
            this.dayCounter = 0;
            this.advanceGrowth();
        }
    }

    //updates plant sprite to next growth stage
    advanceGrowth() {
        if (this.currentStage >= this.maxStage) return;
        this.currentStage++;
        console.log(`Plant advanced to stage ${this.currentStage} with frame ${this.frames[this.currentStage]}`);
        this.sprite.setFrame(this.frames[this.currentStage]);
    }

    //returns true if plant is fully grown and ready to harvest
    isFullyGrown() {
        return this.currentStage === this.maxStage;
    }

    destroy() {
        this.sprite.destroy();
    }
}