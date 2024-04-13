"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntroLevel = void 0;
const excalibur_1 = require("excalibur");
const puzzle_grid_1 = require("../puzzle-grid");
const unit_1 = require("../unit");
class IntroLevel extends excalibur_1.Scene {
    // TODO take puzzle config and generate grid
    constructor() {
        super();
        this.puzzleGrid = new puzzle_grid_1.PuzzleGrid(this, {
            pos: (0, excalibur_1.vec)(400, 100),
            dimension: 3,
            goals: {
                columns: [1, 2, 3],
                rows: [1, 2, 3]
            }
        });
        this.puzzleGrid.addUnit(new unit_1.Unit({ type: 'dragon' }), 0, 0);
        this.puzzleGrid.addUnit(new unit_1.Unit({ type: 'kobold' }), 2, 0);
        this.camera.zoom = 2;
        this.camera.pos = this.puzzleGrid.iso.transform.pos;
    }
}
exports.IntroLevel = IntroLevel;
