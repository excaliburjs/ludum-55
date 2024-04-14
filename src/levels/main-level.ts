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
  SceneActivationContext,
  Color,
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
    this.backgroundColor = Color.Black;
    this.inventory = document.getElementsByTagName(
      "app-inventory"
    )[0]! as Inventory;
    this.inventory.setLevel(this);
    let inventory = calculateInventory(this.level, this);
    this.inventory.setInventoryConfig(inventory);
    
    this.input.pointers.on("move", this.moveSelection);
    this.input.pointers.on("down", this.placeUnitWithPointer);
    this.input.keyboard.on("press", this.keyboardDown);
  }
  onActivate(context: SceneActivationContext<unknown>): void {
    this.inventory.toggleVisible(true);
  }
  onDeactivate(context: SceneActivationContext<undefined>): void {
    this.inventory.toggleVisible(false);
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

  placeSelectionOnTile = (x: number, y: number) => {
    if (this.currentSelection) {
        const success = this.puzzleGrid.addUnit(
          this.currentSelection, x, y);
        if (success) {
          this.currentSelection = null;
          this.checkSolution();
          const unit = this.puzzleGrid.getUnit(x, y);
          // TODO play the summoning animation (separate from, but added to each of the creatures?)
          const valueHint = this.puzzleGrid.getValueHint(x,y)
          if (valueHint) {
            valueHint.graphics.visible = true;
          }
        //   unit?.actions.
        //   unit?.actions.fade(0.4, 500).callMethod(() => {
        //     this.puzzleGrid.valueHint.graphics.visible = true;
        //   });
          SfxrSounds.place.play();
        }
      }
  }

  placeUnitWithPointer = (evt: PointerEvent) => {
    if (this.puzzleGrid.validTile(evt.worldPos)) {
      const tileCoord = this.puzzleGrid.getTileCoord(evt.worldPos);
      // TODO unify this logic so you can do it with keyboard also
      if (tileCoord) {
        const previousUnit = this.puzzleGrid.getUnit(tileCoord.x, tileCoord.y);
        if (!!previousUnit && !previousUnit.config.fixed) {
          this.puzzleGrid.clearCell(tileCoord.x, tileCoord.y);
          SfxrSounds.remove.play();
        }
        this.placeSelectionOnTile(tileCoord.x, tileCoord.y);
        if (!!previousUnit) {
          this.selectUnit(previousUnit);
        }
      }
    } else {
      this.cancelSelection();
      SfxrSounds.remove.play();
    }
  };

  placeUnitWithKeyboard = () => {
    this.placeSelectionOnTile(this.currentSelectedCoordinate.x, this.currentSelectedCoordinate.y)
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

    switch (evt.key) {
      case Keys.Digit1:
      case Keys.Numpad1: {
        this.inventory.onSelection("rat")();
        this.placeUnitWithKeyboard();
        break;
      }
      case Keys.Digit2:
      case Keys.Numpad2: {
        this.inventory.onSelection("goblin")();
        this.placeUnitWithKeyboard();
        break;
      }
      case Keys.Digit3:
      case Keys.Numpad3: {
        this.inventory.onSelection("orc")();
        this.placeUnitWithKeyboard();
        break;
      }
      case Keys.Digit5:
      case Keys.Numpad5: {
        this.inventory.onSelection("dragon")();
        this.placeUnitWithKeyboard();
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
