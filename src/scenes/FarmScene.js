/*
Created by: Jackie Sanchez
Date: 1/27/2026
Description:  Main game scene where the farming gameplay takes place.
Art assets are made by cup Nooble https://cupnooble.itch.io/
*/

import Grid from "./prefabs/Grid.js";

export default class FarmScene extends Phaser.Scene {
    constructor() {
        super("FarmScene");
    }

    create() {
        console.log("FarmScene started...");
        this.input.setPollAlways();
        this.tileSize = 16;
        this.gridWidth = 30;
        this.gridHeight = 100;
        const allowedFrames = [55,56,57,58,59,60];

        this.grid = new Grid(
            this,
            0, 0, 
            this.gridHeight, this.gridWidth,
            this.tileSize,
            "grass",
            allowedFrames
        )

        this.grid.enableHover();



        this.input.on("pointerdown", pointer =>{
            const x = Math.floor(pointer.x / this.tileSize);
            const y = Math.floor(pointer.y / this.tileSize);

            if (this.isInBounds(x,y)) {
                this.plantAt(x,y);
            }
        });
    }

    isInBounds(x,y) {
        return (
            x>=0 && x < this.gridWidth &&
            y>=0 && y < this.gridHeight
        );
    }

    plantAt(x, y) {
        if(this.grid[y][x]) return; // Already a plant here

        const plant = this.add.image(
            x*this.tileSize,
            y*this.tileSize,
            "plant_1_1"
        );
        plant.setOrigin(0);
        this.grid[y][x] = plant;
    }
}

