import { Color, DisplayMode, Engine, FadeInOut, Vector, vec } from "excalibur";
import { loader } from "./resources";
import { SoundManager } from "./sound-manager";
import { loadPreferences } from "./preferences";
import { Level, setWorldPixelConversion } from "./levels/main-level";
import { StartScreen } from "./levels/start-screen";

import "./inventory"; // lit component
import { EndScreen } from "./levels/end-screen";

loadPreferences();
SoundManager.init();

const game = new Engine({
  width: 800,
  height: 600,
  canvasElementId: "game",
  displayMode: DisplayMode.FitScreen,
  pixelArt: true,
  pixelRatio: 2,
  scenes: {
    startScreen: StartScreen,
    introLevel: new Level(0),
    endScreen: EndScreen
  },
});

game.screen.events.on('resize', () => setWorldPixelConversion(game));
game.start("startScreen", {
  inTransition: new FadeInOut({ direction: "in", color: Color.fromHex('#420020'), duration: 1000 }),
  loader,
});
