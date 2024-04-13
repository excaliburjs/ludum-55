import { Engine, IsometricEntityComponent, Scene, vec, PointerEvent } from "excalibur";
import { PuzzleGrid } from "../puzzle-grid";
import { Unit } from "../unit";
import { Inventory } from "../inventory";
import { buildPuzzle } from "../puzzle-builder";


export class Level extends Scene {
    // TODO take puzzle config and generate grid
    puzzleGrid: PuzzleGrid;

    currentSelection: Unit | null = null;
    inventory!: Inventory;

    constructor() {
        super();
        this.puzzleGrid = buildPuzzle(0, this);

        this.camera.zoom = 2;
        this.camera.pos = this.puzzleGrid.iso.transform.pos;
    }

    moveSelection = (evt: PointerEvent) => {
        if (this.currentSelection) {
            this.currentSelection.pos = evt.worldPos;
        }
        this.puzzleGrid.showHighlight(evt.worldPos);
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