/*
Created by: Jackie Sanchez
Date: 1/27/2026
Description:  Main game scene where the farming gameplay takes place.
Art assets are made by cup Nooble https://cupnooble.itch.io/
*/

import Grid from "./prefabs/Grid.js";
import ToolBar from "../ui/ToolBar.js";

export default class FarmScene extends Phaser.Scene {
    constructor() {
        super("FarmScene");
    }

    create() {
        console.log("FarmScene started...");
        //creates toolbar
        this.currentTool = "water";
        const toolbarY = this.scale.height - 48;
        const allowedGrassFrames = [55,56,57,58,59];
        const allowedDirtFrames = [55,56,57,58,59];
        const allowedWateredDirtFrames = [55,56,57,58,59];
        const toolBar = new ToolBar(this, 50, toolbarY, [
            {bgTexture: "buttons", bgFrame: 6, tool: "water", textureKey: "ui", frame: 0, width: 32, energyCost: 5},
            {bgTexture: "buttons", bgFrame: 6, tool: "hoe", textureKey: "ui", frame: 2 , width: 32, energyCost: 10},
            {bgTexture: "buttons", bgFrame: 6, tool: "axe", textureKey: "ui", frame: 1, width: 32, energyCost: 15}
        ]);
        this.events.on("tool-changed", (data) => {
            this.currentTool = data.tool;
            this.currentToolEnergyCost = data.energyCost;
            console.log("Tool changed to:", data.tool, "with energy cost:", data.energyCost);
        });

        //creates tilemap and grid
        this.input.setPollAlways();
        this.tileSize = 16;
        this.gridWidth = 29;
        this.gridHeight = 100;
        this.grid = new Grid(
            this,
            0, 0, 
            this.gridHeight, this.gridWidth,
            this.tileSize,
            "grass",
            "dirt",
            "watered_dirt",
            allowedGrassFrames,
            allowedDirtFrames,
            allowedWateredDirtFrames
        )
        this.grid.enableHover();

        this.input.on("pointerup", () => {
            this.grid.clearHighlight();
        });
        
        //ties toolbar to grid interactions
        this.input.on("pointerdown", (pointer, currentlyOver) => {
            //ignore clicks that hit any ui objects
            if(currentlyOver.some(obj => obj.depth >= 1000)) return;
            // Check if a tool is selected and if the player has enough energy
            if (!this.currentTool) return;
            if (this.energy < this.currentToolEnergyCost) return;

            const col = Math.floor(pointer.worldX / this.tileSize);
            const row = Math.floor(pointer.worldY / this.tileSize);

            if(
                col < 0 || col >= this.grid.cols ||
                row < 0 || row >= this.grid.rows
            ) {
                return;
            }

            let success = false;

            switch(this.currentTool) {
                case "hoe":
                    success = this.grid.hoeTile(col, row);
                    break; 
                case "water":
                    success = this.grid.waterTile(col, row);
                    break;
            }

            if(success) {
                this.energy -= this.currentToolEnergyCost;
                this.drawEnergyBar();
            }
        });
        
        //Creates Energy bar system
        this.maxEnergy = 100;
        this.energy = 100;
        this.energyBarBG = this.add.graphics();
        this.energyBarFill = this.add.graphics();
        this.energyBarOutline = this.add.graphics();
        this.energyBarBG.setDepth(1000);
        this.energyBarFill.setDepth(1000);
        this.energyBarOutline.setDepth(1000);
        this.energyBarX = 20;
        this.energyBarY = 20;
        this.energyBarWidth = 200;
        this.energyBarHeight = 20;
        this.drawEnergyBar();

        
    }

    drawEnergyBar() {
        this.energyBarBG.clear();
        this.energyBarFill.clear();
        this.energyBarOutline.clear();

        // Draw background
        this.energyBarBG.fillStyle(0x222222, 1);
        this.energyBarBG.fillRect(
            this.energyBarX, 
            this.energyBarY, 
            this.energyBarWidth, 
            this.energyBarHeight
        );

        //fill energy
        const energyPercentage = Phaser.Math.Clamp(
            this.energy / this.maxEnergy,
            0,
            1
        );

        this.energyBarFill.fillStyle(0x00cc66, 1);
        this.energyBarFill.fillRect(
            this.energyBarX, 
            this.energyBarY, 
            this.energyBarWidth * energyPercentage, 
            this.energyBarHeight
        );

        // outline
        this.energyBarOutline.lineStyle(2, 0xffffff, 1);
        this.energyBarOutline.strokeRect(
            this.energyBarX,
            this.energyBarY,
            this.energyBarWidth,
            this.energyBarHeight
        );
    }
}

