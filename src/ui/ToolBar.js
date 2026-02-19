/*
Created by Jackie Sanchez
Date: 1/29/2026
Description:  ToolBar UI component for the farming game. This will allow for a toolbar of items that can be arranged horizontally or vertically with customizable spacing.
*/

export default class ToolBar {
    constructor(scene, x, y, buttons, options = {}) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.direction = options.direction || "horizontal";
        this.spacing = options.spacing || 16;
        this.buttonsList = [];
        this.activeButton = null;

        this.createButtons(buttons);
    }

    createButtons(buttonConfigs) {
        buttonConfigs.forEach((config, index) => {
            let x = this.x;
            let y = this.y;

            //position buttons based on direction and spacing
            if (this.direction === "horizontal") {
                x += index * (config.width + this.spacing);
            } else {
                y += index * (config.width + this.spacing);
            }
            


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

                container.on("pointerdown", (pointer) => {
                    console.log(`${config.tool} button clicked`);
                    pointer.event.stopPropagation();
                    this.setActive(container);
                    this.scene.events.emit("tool-changed",{
                         tool: config.tool,
                         energyCost: config.energyCost
                });
            });

            this.buttonsList.push(container);
        });
    }

    setActive(activeContainer) {
        this.buttonsList.forEach(btn => btn.list[0].clearTint());
        activeContainer.list[0].setTint(0xffff00);
        this.activeButton = activeContainer;
    }   

    destroy() {
        this.buttonsList.forEach(btn => btn.destroy());
        this.buttonsList = [];
    }
}