/* Code created by Jackie Sanchez
Date: 1/28/2026
Description:  Grid prefab for creating a grid layout in the game scene.
*/

export default class Grid {
    constructor(scene, x, y, rows, cols, tileSize, textureKey, allowedFrames) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.rows = rows;
        this.cols = cols;
        this.tileSize = tileSize;
        this.textureKey = textureKey;
        this.allowedFrames = allowedFrames;
        this.highlightGraphics = this.scene.add.graphics();
        this.highlightGraphics.setDepth(10);
        
        this.grid = [];
        this.createGrid();
    }

    //creates the grid of tiles
    createGrid() {
        for (let i = 0; i < this.cols; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.rows; j++) {
                const frame = this.allowedFrames[Phaser.Math.Between(0, this.allowedFrames.length - 1)];
                const tile = this.scene.add.image(
                    this.x + i * this.tileSize,
                    this.y + j * this.tileSize,
                    this.textureKey,
                    frame
                );
                tile.setOrigin(0);
                this.grid[i][j] = {
                    tile,
                    plant:null
                }
            }
        }
    }

    //returns tile data at (col, row)
    getTile(col,row) {
        if(row < 0 || row >= this.rows ||col < 0 || col >= this.cols) {
            return null;
        }
        return this.grid[col][row];
    }

    //highlights a tile at (col, row) with specified color and line width
    highlightTile(col,row, color = 0x000000, lineWidth = 2) {
        const tileData = this.getTile(col,row);
        if(!tileData) return;
        const tile = tileData.tile;

        this.highlightGraphics.clear();
        this.highlightGraphics.lineStyle(lineWidth, color, 1);
        this.highlightGraphics.strokeRect(
            tile.x,
            tile.y,
            this.tileSize,
            this.tileSize
        )
    }

    //clears any existing highlights
    clearHighlight() {
        this.highlightGraphics.clear();
    }

    //enables hover effect to highlight tiles under the pointer
    enableHover() {
        this.scene.input.on("pointermove", pointer => {
            const col = Math.floor(pointer.worldX / this.tileSize);
            const row = Math.floor(pointer.worldY / this.tileSize);

            if(
                col < 0 || col >= this.cols ||
                row < 0 || row >= this.rows
            ) {
                this.clearHighlight();
                return;
            }
            this.highlightTile(col,row, 0xff0000, 1);
        });
    }

    
}