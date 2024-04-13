import { Scene, vec } from "excalibur";
import { PuzzleGrid } from "../puzzle-grid";


export class IntroLevel extends Scene {
    puzzleGrid: PuzzleGrid;
    // TODO take puzzle config and generate grid

    constructor() {
        super();
        this.puzzleGrid = new PuzzleGrid(this, {
            pos: vec(400, 100),
            dimension: 4
        });
        this.camera.zoom = 2;
        this.camera.pos = this.puzzleGrid.iso.transform.pos;
    }
}