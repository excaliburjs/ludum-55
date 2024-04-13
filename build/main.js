"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const excalibur_1 = require("excalibur");
const resources_1 = require("./resources");
const sound_manager_1 = require("./sound-manager");
const preferences_1 = require("./preferences");
const intro_level_1 = require("./levels/intro-level");
const game = new excalibur_1.Engine({
    width: 800,
    height: 600,
    canvasElementId: 'game',
    displayMode: excalibur_1.DisplayMode.FitScreen,
    pixelArt: true,
    pixelRatio: 2,
    scenes: {
        'introLevel': intro_level_1.IntroLevel
    }
});
game.start('introLevel', { inTransition: new excalibur_1.FadeInOut({ direction: 'in', duration: 200 }), loader: resources_1.loader });
(0, preferences_1.loadPreferences)();
sound_manager_1.SoundManager.init();
