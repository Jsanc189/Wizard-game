/*
Created by Jackie Sanchez
Date: 1/27/2026
Description:  imports all necessary scenes and initializes the Phaser game with the provided configuration.
*/

import { config } from './config.js';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import FarmScene from './scenes/FarmScene.js';
import UIScene from './scenes/UIScene.js';


console.log("Game is starting...");
config.scene = [BootScene, PreloadScene, FarmScene, UIScene];

new Phaser.Game(config);

