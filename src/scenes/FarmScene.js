/*
Created by: Jackie Sanchez
Date: 1/27/2026
Description:  Main game scene where the farming gameplay takes place.
Art assets are made by cup Nooble https://cupnooble.itch.io/
*/

import Grid from "./prefabs/Grid.js";
import ToolBar from "../ui/ToolBar.js";
import Plant from "./prefabs/Plant.js";

export default class FarmScene extends Phaser.Scene {
    constructor() {
        super("FarmScene");
    }

    create() {
        console.log("FarmScene started...");
        //creates toolbar
        this.currentTool = "water";
        const toolBarHorizontalX = 50;
        const toolbarHorizontalY = this.scale.height - 48;
        const toolBarVerticalX = 325;
        const toolBarVerticalY = 75;
        const toolBar = new ToolBar(this, toolBarHorizontalX, toolbarHorizontalY, [
            {bgTexture: "buttons", bgFrame: 6, tool: "water", textureKey: "ui", frame: 0, width: 32, energyCost: 5},
            {bgTexture: "buttons", bgFrame: 6, tool: "hoe", textureKey: "ui", frame: 2 , width: 32, energyCost: 10},
            {bgTexture: "buttons", bgFrame: 6, tool: "axe", textureKey: "ui", frame: 1, width: 32, energyCost: 15}
        ], {direction: "horizontal", spacing: 0});
        this.events.on("tool-changed", (data) => {
            this.currentTool = data.tool;
            this.currentToolEnergyCost = data.energyCost;
            console.log("Tool changed to:", data.tool, "with energy cost:", data.energyCost);
        });

        //creates tilemap and grid
        this.input.setPollAlways();
        this.tileSize = 32;
        this.gridWidth = 29;
        this.gridHeight = 100;
        const allowedGrassFrames = [55,56,57,58,59];
        const allowedDirtFrames = [55,56,57,58,59];
        const allowedWateredDirtFrames = [55,56,57,58,59];
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
            let harvestResult = false;
            const harvestedCrop = this.grid.harvestTile(col, row);

            if(harvestedCrop) {
                harvestResult = true;

                if (!this.harvestedCrops[harvestedCrop]) {
                    this.harvestedCrops[harvestedCrop] = 0;
                }
                this.harvestedCrops[harvestedCrop]++;
                this.checkCropProgression(harvestedCrop, toolBarVerticalX, toolBarVerticalY);
                console.log(`Harvested ${harvestedCrop}. Total harvested: ${this.harvestedCrops[harvestedCrop]}`);
                this.createHarvestDisplay(toolBarVerticalX - 50, toolBarVerticalY);
            } else {
                switch(this.currentTool) {
                    case "hoe":
                        success = this.grid.hoeTile(col, row);
                        break; 
                    case "water":
                        success = this.grid.waterTile(col, row);
                        break;
                    default:
                        if (this.unlockedSeeds.includes(this.currentTool)) {
                            success = this.grid.plantTile(col, row, this.PLANT_DATA[this.currentTool]);
                        }
                }
            }

            if(success) {
                this.energy -= this.currentToolEnergyCost || this.PLANT_DATA[this.currentTool]?.seeds?.energyCost || 0;
                this.drawEnergyBar();
            }
            if(harvestResult) {
                this.energy -= this.currentToolEnergyCost || 0;
                this.drawEnergyBar();
            }

        });

        //plant seeding logic, growth, and harvesting
        this.harvestedCrops = {};
        this.unlockedSeeds = ["carrot"];
        this.selectedSeed = null;
        this.PLANT_DATA = {
            carrot: {
                key: "crops",
                cropType: "carrot",
                frames: [10, 11, 12, 13],
                daysPerStage: 1,
                seeds:{bgTexture: "buttons", bgFrame: 6, tool: "carrot", textureKey: "seeds_crops", frame: 4, width: 32, energyCost: 5}
             },
             cauliflower: {
                key: "crops",
                cropType: "cauliflower",
                frames: [15, 16, 17, 18],
                daysPerStage: 1,
                seeds:{bgTexture: "buttons", bgFrame: 6, tool: "cauliflower", textureKey: "seeds_crops", frame: 6, width: 32, energyCost: 5}
            },
            tomato: {
                key: "crops",
                cropType: "tomato",
                frames: [20, 21, 22, 23],
                daysPerStage: 3,
                seeds:{bgTexture: "buttons", bgFrame: 6, tool: "tomato", textureKey: "seeds_crops", frame: 8, width: 32, energyCost: 5}
             },
            eggplant: {
                key: "crops",
                cropType: "eggplant",
                frames: [25, 26, 27, 28],
                daysPerStage: 4,
                seeds:{bgTexture: "buttons", bgFrame: 6, tool: "eggplant", textureKey: "seeds_crops", frame: 10, width: 32, energyCost: 5}
            },
            tulip:{
                key: "crops",
                cropType: "tulip",
                frames: [30, 31, 32, 33],
                daysPerStage: 2,
                seeds:{bgTexture: "buttons", bgFrame: 6, tool: "tulip", textureKey: "seeds_crops", frame: 12, width: 32, energyCost: 5}
            },
            lettuce: {
                key: "crops",
                cropType: "lettuce",
                frames: [35, 36, 37, 38],
                daysPerStage: 3,
                seeds:{bgTexture: "buttons", bgFrame: 6, tool: "lettuce", textureKey: "seeds_crops", frame: 14, width: 32, energyCost: 5}
            },
            wheat: {
                key: "crops",
                cropType: "wheat",
                frames: [40, 41, 42, 43],
                daysPerStage: 4,
                seeds:{bgTexture: "buttons", bgFrame: 6, tool: "wheat", textureKey: "seeds_crops", frame: 16, width: 32, energyCost: 5}
            },
            pumpkin: {
                key: "crops",
                cropType: "pumpkin",
                frames: [45, 46, 47, 48],
                daysPerStage: 5,
                seeds:{bgTexture: "buttons", bgFrame: 6, tool: "pumpkin", textureKey: "seeds_crops", frame: 18, width: 32, energyCost: 5}
            },
            parsnip: {
                key: "crops",
                cropType: "parsnip",
                frames: [50, 51, 52, 53],
                daysPerStage: 2,
                seeds:{bgTexture: "buttons", bgFrame: 6, tool: "parsnip", textureKey: "seeds_crops", frame: 20, width: 32, energyCost: 5}
            },
            red_cabbage: {
                key: "crops",
                cropType: "red_cabbage",
                frames: [55, 56, 57, 58],
                daysPerStage: 3,
                seeds:{bgTexture: "buttons", bgFrame: 6, tool: "red_cabbage", textureKey: "seeds_crops", frame: 22, width: 32, energyCost: 5}
            },
            purple_yam: {
                key: "crops",
                cropType: "purple_yam",
                frames: [60, 61, 62, 63],
                daysPerStage: 4,
                seeds:{bgTexture: "buttons", bgFrame: 6, tool: "purple_yam", textureKey: "seeds_crops", frame: 24, width: 32, energyCost: 5}
            }
        };
        this.createSeedBar(toolBarVerticalX, toolBarVerticalY);
        this.createHarvestDisplay(toolBarVerticalX - 50, toolBarVerticalY);
         

        //UI buttons
        this.endDayButton = this.add.image(
            this.scale.width - 15,
            toolBarVerticalY - 60,
            "large_buttons",
            0
        )
        .setOrigin(1,0)
        .setScrollFactor(0)
        .setDepth(1001)
        .setInteractive({useHandCursor: true});
        
        this.endDayButton.on("pointerdown", (pointer) => {
            pointer.event.stopPropagation();
            this.endDay();
        });
        
        //Creates Energy bar system
        this.maxEnergy = 100;
        this.energy = 100;
        this.energyBarBG = this.add.graphics().setDepth(1000);
        this.energyBarFill = this.add.graphics().setDepth(1000);
        this.energyBarOutline = this.add.graphics().setDepth(1000);
        this.energyBarX = 20;
        this.energyBarY = 20;
        this.energyBarWidth = 200;
        this.energyBarHeight = 20;
        this.drawEnergyBar();

        //Day/Night cycle
        this.currentDay = 1;
        
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

    endDay() {
        console.log("Day ended. Advancing plant growth stages...");
        this.grid.onNewDay();
        this.currentDay++;
        this.energy = this.maxEnergy;
        this.drawEnergyBar();
        console.log("Current Day:", this.currentDay);
    }

    createSeedBar(x,y) {
        const seedConfigs = this.unlockedSeeds.map(seedKey => {
            return this.PLANT_DATA[seedKey].seeds;

       });
        
        if (this.seedBar) this.seedBar.destroy();

        this.seedBar = new ToolBar(this, x, y, seedConfigs, {direction: "vertical", spacing: 0});

        //listen for seed selection
        this.events.on("tool-changed", (data) => {
            if (this.unlockedSeeds.includes(data.tool)) {
                this.selectedSeed = data.tool;
                console.log("Selected seed:", this.selectedSeed);
            }
        });
    }

    createHarvestDisplay(x, y) {
        const cropKeys = Object.keys(this.harvestedCrops);
        const harvestConfigs = cropKeys.map((cropKey, index) => {
            const z = index + 1; // ✅ first crop = 1, second = 2, etc
            const baseFrame = this.PLANT_DATA[cropKey].frames[0];
            const displayFrame = baseFrame - (2 + 3 * z);

            return {
                bgTexture: "buttons",
                bgFrame: 6,
                tool: cropKey,
                textureKey: "seeds_crops",
                frame: displayFrame,
                width: 32,
                energyCost: 0,
                amount: this.harvestedCrops[cropKey]
            };
        });

        if (this.harvestDisplay) this.harvestDisplay.destroy();

        this.harvestDisplay = new ToolBar(this, x, y, harvestConfigs, {direction: "vertical", spacing: 0, interactive: false});

        this.harvestDisplay.buttonsList.forEach((container, index) => { 
            const cropKey = Object.keys(this.harvestedCrops)[index];
            const amount = this.harvestedCrops[cropKey];
            const text = this.add.text(
                container.width - 70,
                container.height / 10, 
                `x${amount}`, 
                { fontSize: '16px', fill: '#fff' })
                .setOrigin(0, 0.5)
                .setDepth(1001);
            container.add(text);
        });
    }

    //unlocks new seeds
    unlockSeed(seedKey, x, y) {
        if (!this.unlockedSeeds.includes(seedKey)) {
            this.unlockedSeeds.push(seedKey);
            this.createSeedBar(x, y);
            console.log('current seeds: ', this.unlockedSeeds);
        }
    }

    //check if has met requirements to unluck new seeds
    checkCropProgression(cropKey, x, y) {
        const harvestedAmount = this.harvestedCrops[cropKey];

        if (harvestedAmount < 2) return;

        const plantKeys = Object.keys(this.PLANT_DATA);
        const currentIndex = plantKeys.indexOf(cropKey);

        console.log(`Checking crop progression for ${cropKey}. Harvested amount: ${harvestedAmount}. Current index: ${currentIndex}`);

        //last crop or not found, no more seeds to unlock
        if (currentIndex === -1 || currentIndex === plantKeys.length - 1) return;

        const nextSeedKey = plantKeys[currentIndex + 1];
        console.log(`Unlocking new seed: ${nextSeedKey}`);
        this.unlockSeed(nextSeedKey, x, y);
    }
}

