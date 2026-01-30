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
            const x = this.x + index * (config.width + 16);
            const y = this.y;

            const bg = this.scene.add.image(0, 0, config.bgTexture, config.bgFrame)
            .setOrigin(0.5)
            .setScale(1.3);

            const icon = this.scene.add.image(
                config.width / 20,
                config.width / 16,
                config.textureKey,
                config.frame
            ).setOrigin(0.5)
             .setScale(1.5);

            const container = this.scene.add.container(x, y, [bg, icon])
                .setSize(config.width, config.width)
                .setDepth(1000)
                .setScrollFactor(0)
                .setInteractive(
                    new Phaser.Geom.Rectangle(0, 0, config.width, config.width),
                    Phaser.Geom.Rectangle.Contains
                );

                container.on("pointerdown", () => {
                    console.log(`${config.tool} button clicked`);
                    this.setActive(container);
                    this.scene.events.emit("tool-changed", config.tool);
                }
            );

            this.buttonsList.push(container);
        });
    }

    setActive(activeContainer) {
        this.buttonsList.forEach(btn => btn.list[0].clearTint());
        activeContainer.list[0].setTint(0xffff00);
    }   
}