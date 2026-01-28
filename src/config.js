/*
Created by Jackie Sanchez
Date: 1/27/2026
Description:  Configuration file for game settings in phaser game.  Sized for baseline of mobile devices.  Touch enabled.
*/

export const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    backgroundColor: '#72c3ff',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    input: {
        activePointers: 2,
    },
    scene: []
};