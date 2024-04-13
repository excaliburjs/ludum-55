import { DisplayMode, Engine, FadeInOut } from "excalibur";
import { loader } from "./resources";
import { SoundManager } from "./sound-manager";
import { loadPreferences } from "./preferences";
import { Level } from "./levels/intro-level";

import './inventory';

const game = new Engine({
    width: 800,
    height: 600,
    canvasElementId: 'game',
    displayMode: DisplayMode.FitScreen,
    pixelArt: true,
    pixelRatio: 2,
    scenes: {
        'introLevel': Level
    }
});

game.start('introLevel', { inTransition: new FadeInOut({direction: 'in',duration: 200 }), loader});

loadPreferences();
SoundManager.init();