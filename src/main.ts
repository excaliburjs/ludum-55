import { DisplayMode, Engine, FadeInOut } from "excalibur";
import { loader } from "./resources";
import { SoundManager } from "./sound-manager";
import { loadPreferences } from "./preferences";
import { Level } from "./levels/main-level";

import "./inventory";

loadPreferences();

const game = new Engine({
  width: 800,
  height: 600,
  canvasElementId: "game",
  displayMode: DisplayMode.FitScreen,
  pixelArt: true,
  pixelRatio: 2,
  scenes: {
    introLevel: new Level(0),
  },
});

game
  .start("introLevel", {
    inTransition: new FadeInOut({ direction: "in", duration: 2000 }),
    loader,
  })
  .then(() => {
    SoundManager.init();
  });
