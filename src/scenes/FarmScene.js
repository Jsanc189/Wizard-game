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
        this.input.setPollAlways();
        this.tileSize = 16;
        this.gridWidth = 29;
        this.gridHeight = 100;
        const allowedGrassFrames = [55,56,57,58,59];
        const allowedDirtFrames = [55,56,57,58,59];
        const allowedWateredDirtFrames = [55,56,57,58,59];
        const toolBar = new ToolBar(this, 50,10, [
            { tool: "hoe", textureKey: "ui", frame: 2 },
            { tool: "water", textureKey: "ui", frame: 0 }
        ]);

        this.events.on("tool-changed", (tool) => {
            this.currentTool = tool;
            console.log("Tool changed to:", tool);
        });

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

        this.grid.enableHoeing();
    }

}

