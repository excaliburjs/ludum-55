"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const excalibur_1 = require("excalibur");
const puzzle_grid_1 = require("../../src/puzzle-grid");
describe('a puzzle grid', () => {
    let grid;
    let scene;
    beforeEach(() => {
        scene = new excalibur_1.Scene();
        grid = new puzzle_grid_1.PuzzleGrid(scene, {
            pos: (0, excalibur_1.vec)(400, 100),
            dimension: 3,
            goals: {
                columns: [1, 2, 3],
                rows: [1, 2, 3]
            }
        });
    });
    it('checkSolved should return true when solved', () => {
        grid.goals = {
            columns: [1, 2, 3],
            rows: [1, 2, 3]
        };
        expect(grid.checkSolved()).toBeTrue();
    });
});
