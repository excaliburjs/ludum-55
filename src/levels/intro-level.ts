import { Engine, IsometricEntityComponent, Scene, vec, PointerEvent, KeyEvent, Keys, clamp } from "excalibur";
import { PuzzleGrid } from "../puzzle-grid";
import { Unit } from "../unit";
import { Inventory } from "../inventory";
import { buildPuzzle } from "../puzzle-builder";


export class Level extends Scene {
    // TODO take puzzle config and generate grid
    puzzleGrid: PuzzleGrid;

    currentSelection: Unit | null = null;
    inventory!: Inventory;
    currentSelectedCoordinate: { x: number; y: number; } = { x: 0, y: 0 };

    constructor(private level: number) {
        super();
        this.puzzleGrid = buildPuzzle(level, this);

        this.camera.zoom = 2;
        this.camera.pos = this.puzzleGrid.iso.transform.pos;
    }

    moveSelection = (evt: PointerEvent) => {
        if (this.currentSelection) {
            this.currentSelection.pos = evt.worldPos;
        }
        this.puzzleGrid.showHighlight(evt.worldPos);
        const tile = this.puzzleGrid.getTileCoord(evt.worldPos);
        if (tile) {
            this.currentSelectedCoordinate = {x: tile.x, y: tile.y };
        }
    }

    placeSelection = (evt: PointerEvent) => {
        if (this.currentSelection && this.puzzleGrid.validTile(evt.worldPos)) {
            const tileCoord = this.puzzleGrid.getTileCoord(evt.worldPos);
            if (tileCoord) {
                const success = this.puzzleGrid.addUnit(this.currentSelection, tileCoord.x, tileCoord.y);
                if (success) {
                    this.currentSelection = null;
                } else {
                    const previousUnit = this.puzzleGrid.getUnit(tileCoord.x, tileCoord.y)!;
                    this.puzzleGrid.clearCell(tileCoord.x, tileCoord.y);
                    this.puzzleGrid.addUnit(this.currentSelection, tileCoord.x, tileCoord.y);
                    const counts = this.inventory.getInventoryConfig();
                    counts[previousUnit.config.type]++;
                    this.inventory.setInventoryConfig(counts);
                    this.currentSelection = null;
                }
            }
        }
        if(this.puzzleGrid.checkSolved()) { 
            const nextLevel = this.level + 1;
            console.log(nextLevel)
            const sceneKey = `level ${nextLevel}`;
            this.engine.addScene(sceneKey, new Level(nextLevel));
            this.engine.goToScene(sceneKey);
        }
    }

    keyboardDown = (evt: KeyEvent) => {

        // Move cursor
        switch (evt.key) {
            case Keys.A:
            case Keys.ArrowLeft: { 
                this.currentSelectedCoordinate.x = clamp(this.currentSelectedCoordinate.x - 1, 0, this.puzzleGrid.dimension - 1);
                break;
            }
            case Keys.D:
            case Keys.ArrowRight: {
                this.currentSelectedCoordinate.x = clamp(this.currentSelectedCoordinate.x + 1, 0, this.puzzleGrid.dimension - 1);
                break;
            }
            case Keys.W:
            case Keys.ArrowUp: { 
                this.currentSelectedCoordinate.y = clamp(this.currentSelectedCoordinate.y - 1, 0, this.puzzleGrid.dimension - 1);
                break;
            }
            case Keys.S:
            case Keys.ArrowDown: {
                this.currentSelectedCoordinate.y = clamp(this.currentSelectedCoordinate.y + 1, 0, this.puzzleGrid.dimension - 1);
                break;
            }
        }
        this.puzzleGrid.showHighlightByCoordinate(this.currentSelectedCoordinate.x, this.currentSelectedCoordinate.y);

        // Place unit

        const placeUnitWithKeyboard = () => {
            if (this.currentSelection) {
                const success = this.puzzleGrid.addUnit(this.currentSelection, this.currentSelectedCoordinate.x, this.currentSelectedCoordinate.y);
                if (success) {
                    this.currentSelection = null;
                }
            }
        }

        switch (evt.key) {
            case Keys.Digit1:
            case Keys.Numpad1: {
                this.inventory.onSelection('rat')();
                placeUnitWithKeyboard();
                break;
            }
            case Keys.Digit2:
            case Keys.Numpad2: {
                this.inventory.onSelection('kobold')();
                placeUnitWithKeyboard();
                break;
            }
            case Keys.Digit3:
            case Keys.Numpad3: {
                this.inventory.onSelection('goblin')();
                placeUnitWithKeyboard();
                break;
            }
            case Keys.Digit5:
            case Keys.Numpad5: {
                this.inventory.onSelection('orc')();
                placeUnitWithKeyboard();
                break;
            }
            case Keys.Digit9:
            case Keys.Numpad9: {
                this.inventory.onSelection('dragon')();
                placeUnitWithKeyboard();
                break;
            }

            case Keys.Esc: {
                this.cancelSelection();
                break;
            }
        }
    }

    onInitialize(engine: Engine<any>): void {
        this.inventory = document.getElementsByTagName('app-inventory')[0]! as Inventory;
        this.inventory.setLevel(this);
        this.inventory.setInventoryConfig({
            dragon: 2,
            orc: 4,
            goblin: 2,
            kobold: 1,
            rat: 1,
            knight: 0,
            archer: 0
        })
        this.input.pointers.on('move', this.moveSelection);
        this.input.pointers.on('down', this.placeSelection);
        this.input.keyboard.on('press', this.keyboardDown);
    }

    selectUnit(unit: Unit) {
        if (this.currentSelection) {
            this.remove(this.currentSelection);
            this.currentSelection = null;
        }
        unit.addComponent(new IsometricEntityComponent(this.puzzleGrid.iso));
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