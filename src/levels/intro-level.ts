import { Engine, IsometricEntityComponent, Scene, vec, PointerEvent } from "excalibur";
import { PuzzleGrid } from "../puzzle-grid";
import { Unit } from "../unit";
import { Inventory } from "../inventory";


export class Level extends Scene {
    // TODO take puzzle config and generate grid
    puzzleGrid: PuzzleGrid;

    currentSelection: Unit | null = null;
    inventory!: Inventory;

    constructor() {
        super();
        this.puzzleGrid = new PuzzleGrid(this, {
            pos: vec(400, 100),
            dimension: 3,
            goals: {
                columns: [1, 2, 3],
                rows: [1, 2, 3]
            }
        });

        this.puzzleGrid.addUnit(new Unit({type: 'dragon'}), 0, 0)
        this.puzzleGrid.addUnit(new Unit({type: 'kobold'}), 2, 0)

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
                }
            }
        }
    }

    onInitialize(engine: Engine<any>): void {
        this.inventory = document.getElementsByTagName('app-inventory')[0]! as Inventory;
        this.inventory.setLevel(this);
        this.input.pointers.on('move', this.moveSelection);
        this.input.pointers.on('down', this.placeSelection);
    }

    selectUnit(unit: Unit) {
        if (this.currentSelection) {
            this.remove(this.currentSelection);
        }
        unit.addComponent(new IsometricEntityComponent(this.puzzleGrid.iso));
        this.currentSelection = unit;
        this.add(unit);
    }
}