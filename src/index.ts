import * as Phaser from "phaser";
import { Scene } from "./scene.ts";

var currentWidth = 1280;
var currentHeight = 720;
currentWidth = currentHeight * (innerWidth / innerHeight);

console.log("Original Width: " + innerWidth + " Current Game Width: " + currentWidth);
console.log("Original Height: " + innerHeight + " Current Game Height: " + currentHeight);

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: 'white',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'container',
        width: currentWidth,
        height: currentHeight,
    },
    scene: [new Scene({ currentWidth, currentHeight })],
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300, x: 0 },
            debug: false
        }
    },
};

document.addEventListener("DOMContentLoaded", () => {
    var game = new Phaser.Game(config);
});


