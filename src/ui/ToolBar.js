/*
Created by Jackie Sanchez
Date: 1/29/2026
Description:  ToolBar UI component for the farming game.
*/

export default class ToolBar {
    constructor(scene, x, y, buttons) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.buttonsList = [];
        this.activeButton = null;

        this.createButtons(buttons);
    }

    createButtons(buttonConfigs) {
        buttonConfigs.forEach((config, index) => {
            const button = this.scene.add.image(
                this.x + index * 40,
                this.y,
                config.textureKey,
                config.frame
            )
            .setOrigin(0)
            .setInteractive({ useHandCursor: true });
            button.setScrollFactor(0);
            button.setDepth(1000);
            button.on("pointerdown", () => {
                this.setActive(button);
                this.scene.events.emit("tool-changed", config.tool);
            });
            this.buttonsList.push(button);
        });
    }

    setActive(button) {
        if (this.activeButton) {
            this.activeButton.clearTint();
        }

        this.activeButton = button;
        this.activeButton.setTint(0xaaaaaa);
    }
}