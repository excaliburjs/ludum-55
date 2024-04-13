import { Scene, vec } from "excalibur";
import { PuzzleGrid } from "../puzzle-grid";
import { Unit } from "../unit";


export class IntroLevel extends Scene {
    puzzleGrid: PuzzleGrid;
    // TODO take puzzle config and generate grid

    constructor() {
        super();
        this.puzzleGrid = new PuzzleGrid(this, {
            pos: vec(400, 100),
            dimension: 3
        });

        this.puzzleGrid.addUnit(new Unit({type: 'dragon'}), 0, 0)
        this.puzzleGrid.addUnit(new Unit({type: 'kobold'}), 2, 0)

        this.camera.zoom = 2;
        this.camera.pos = this.puzzleGrid.iso.transform.pos;
    }
}