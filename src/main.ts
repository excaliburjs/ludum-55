import { DisplayMode, Engine } from "excalibur";
import { loader } from "./resources";
import { Player } from "./player";
import { SoundManager } from "./sound-manager";
import { loadPreferences } from "./preferences";

const game = new Engine({
    width: 800,
    height: 600,
    canvasElementId: 'game',
    displayMode: DisplayMode.FitScreen,
    pixelArt: true
});

const player = new Player(game.screen.center);
game.add(player);

game.start(loader);

loadPreferences();
SoundManager.init();