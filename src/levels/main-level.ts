import {
  Engine,
  IsometricEntityComponent,
  Scene,
  vec,
  PointerEvent,
  KeyEvent,
  Keys,
  clamp,
  FadeInOut,
  Transition,
} from "excalibur";
import { PuzzleGrid } from "../puzzle-grid";
import { Unit } from "../unit";
import { Inventory } from "../inventory";
import { buildPuzzle, calculateInventory } from "../puzzle-builder";
import { SoundManager } from "../sound-manager";
import { SfxrSounds } from "../resources";

export class Level extends Scene {
  puzzleGrid: PuzzleGrid;
  currentSelection: Unit | null = null;
  inventory!: Inventory;
  currentSelectedCoordinate: { x: number; y: number } = { x: 0, y: 0 };

  constructor(private level: number) {
    super();
    this.puzzleGrid = buildPuzzle(level, this);

    this.camera.zoom = 2;
    this.camera.pos = this.puzzleGrid.iso.transform.pos.add(vec(0, 100));
  }

  onInitialize(engine: Engine<any>): void {
    SoundManager.startBackgroundMusic();

    this.inventory = document.getElementsByTagName(
      "app-inventory"
    )[0]! as Inventory;
    this.inventory.setLevel(this);
    let inventory = calculateInventory(this.level, this);
    this.inventory.setInventoryConfig(inventory);
    this.input.pointers.on("move", this.moveSelection);
    this.input.pointers.on("down", this.placeSelection);
    this.input.keyboard.on("press", this.keyboardDown);
  }

  moveSelection = (evt: PointerEvent) => {
    if (this.currentSelection) {
      this.currentSelection.pos = evt.worldPos;
    }
    this.puzzleGrid.showHighlight(evt.worldPos);
    const tile = this.puzzleGrid.getTileCoord(evt.worldPos);
    if (tile) {
      this.currentSelectedCoordinate = { x: tile.x, y: tile.y };
    }
  };

  placeSelection = (evt: PointerEvent) => {
    if (this.puzzleGrid.validTile(evt.worldPos)) {
      const tileCoord = this.puzzleGrid.getTileCoord(evt.worldPos);
      if (tileCoord) {
        const previousUnit = this.puzzleGrid.getUnit(tileCoord.x, tileCoord.y);
        if (!!previousUnit && !previousUnit.config.fixed) {
          this.puzzleGrid.clearCell(tileCoord.x, tileCoord.y);
          this.inventory.addToInventory(previousUnit.config.type);
          this.checkSolution();
          SfxrSounds.remove.play();
        }
        if (this.currentSelection) {
          const success = this.puzzleGrid.addUnit(
            this.currentSelection,
            tileCoord.x,
            tileCoord.y
          );
          if (success) {
            this.currentSelection = null;
            this.checkSolution();
            SfxrSounds.place.play();
          }
        }
      }
    }
  };

  checkSolution() {
    if (this.puzzleGrid.checkSolved()) {
      const nextLevel = this.level + 1;
      const sceneKey = `level ${nextLevel}`;
      SfxrSounds.clearPuzzle.play();
      this.engine.addScene(sceneKey, new Level(nextLevel));
      this.engine.goToScene(sceneKey, {
        destinationIn: new FadeInOut({ direction: "in", duration: 2000 }),
        sourceOut: new FadeInOut({ direction: "out", duration: 2000 }),
      });
    }
  }

  keyboardDown = (evt: KeyEvent) => {
    // Move cursor
    switch (evt.key) {
      case Keys.A:
      case Keys.ArrowLeft: {
        this.currentSelectedCoordinate.x = clamp(
          this.currentSelectedCoordinate.x - 1,
          0,
          this.puzzleGrid.dimension - 1
        );
        break;
      }
      case Keys.D:
      case Keys.ArrowRight: {
        this.currentSelectedCoordinate.x = clamp(
          this.currentSelectedCoordinate.x + 1,
          0,
          this.puzzleGrid.dimension - 1
        );
        break;
      }
      case Keys.W:
      case Keys.ArrowUp: {
        this.currentSelectedCoordinate.y = clamp(
          this.currentSelectedCoordinate.y - 1,
          0,
          this.puzzleGrid.dimension - 1
        );
        break;
      }
      case Keys.S:
      case Keys.ArrowDown: {
        this.currentSelectedCoordinate.y = clamp(
          this.currentSelectedCoordinate.y + 1,
          0,
          this.puzzleGrid.dimension - 1
        );
        break;
      }
    }
    this.puzzleGrid.showHighlightByCoordinate(
      this.currentSelectedCoordinate.x,
      this.currentSelectedCoordinate.y
    );

    // Place unit

    const placeUnitWithKeyboard = () => {
      if (this.currentSelection) {
        const success = this.puzzleGrid.addUnit(
          this.currentSelection,
          this.currentSelectedCoordinate.x,
          this.currentSelectedCoordinate.y
        );
        if (success) {
          this.currentSelection = null;
        }
      }
    };

    switch (evt.key) {
      case Keys.Digit1:
      case Keys.Numpad1: {
        this.inventory.onSelection("rat")();
        placeUnitWithKeyboard();
        break;
      }
      case Keys.Digit2:
      case Keys.Numpad2: {
        this.inventory.onSelection("goblin")();
        placeUnitWithKeyboard();
        break;
      }
      case Keys.Digit3:
      case Keys.Numpad3: {
        this.inventory.onSelection("orc")();
        placeUnitWithKeyboard();
        break;
      }
      case Keys.Digit5:
      case Keys.Numpad5: {
        this.inventory.onSelection("dragon")();
        placeUnitWithKeyboard();
        break;
      }

      case Keys.Esc: {
        this.cancelSelection();
        break;
      }
    }
  };

  selectUnit(unit: Unit) {
    if (this.currentSelection) {
      this.remove(this.currentSelection);
      this.currentSelection = null;
    }
    unit.addComponent(new IsometricEntityComponent(this.puzzleGrid.iso));
    unit.get(IsometricEntityComponent).elevation = 3;
    this.currentSelection = unit;
    this.add(unit);
  }

  cancelSelection() {
    if (this.currentSelection) {
      this.remove(this.currentSelection);
      const type = this.currentSelection.config.type;
      const counts = this.inventory.getInventoryConfig();
      counts[type]++;
      this.inventory.setInventoryConfig(counts);
      this.currentSelection = null;
    }
  }
}
