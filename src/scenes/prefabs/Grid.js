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
        
        this.grid = [];
        this.createGrid();
    }

    createGrid() {
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.cols; j++) {
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

    getTile(col,row) {
        if(row < 0 || row >= this.rows ||col < 0 || col >= this.cols) {
            return null;
        }
        return this.grid[col][row];
    }

    highlightTile(col,row, color = 0x000000) {
        const tileData = this.getTile(col,row);
        if(!tileData) return;
        tileData.tile.setTint(color);
    }

    clearHighlight() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x].tile.clearTint();
            }
        }
    }
}