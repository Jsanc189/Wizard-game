/*
Created by: Jackie Sanchez
Date: 1/27/2026
Description:  Main game scene where the farming gameplay takes place.
Art assets are made by cup Nooble https://cupnooble.itch.io/
*/

export default class FarmScene extends Phaser.Scene {
    constructor() {
        super("FarmScene");
    }

    create() {
        console.log("FarmScene started...");
        this.tileSize = 16;
        this.gridWidth = 30;
        this.gridHeight = 50;

        this.createGrid();

        this.input.on("pointerdown", pointer =>{
            const x = Math.floor(pointer.x / this.tileSize);
            const y = Math.floor(pointer.y / this.tileSize);

            if (this.isInBounds(x,y)) {
                this.plantAt(x,y);
            }
        });
    }

    //creates grid of tiles with random grass tile frames
    createGrid() {
        this.grid = [];
        const allowedFrames = [55,56,57,58,59,60];
        for(let y = 0; y < this.gridHeight; y++) {
            this.grid[y] = [];
            for(let x = 0; x < this.gridWidth; x++) {
                const frame = allowedFrames[Phaser.Math.Between(0, allowedFrames.length - 1)];
                console.log(frame);
                const tile = this.add.image(
                    x * this.tileSize,
                    y * this.tileSize,
                    "grass",
                    frame
                );
                tile.setOrigin(0);
                this.grid[y][x] = {
                    tile,
                    plant: null // No plant initially
                }
            }
        }
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

