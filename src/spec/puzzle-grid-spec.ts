import { Scene, vec } from "excalibur";
import { PuzzleGrid } from "../../src/puzzle-grid";

describe ('a puzzle grid', () => {
    let grid : PuzzleGrid;
    let scene : Scene;

    beforeEach(() => {
        scene = new Scene();
        grid = new PuzzleGrid(scene,{
            pos: vec(400, 100),
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
        }
        expect(grid.checkSolved()).toBeTrue();
    });

});