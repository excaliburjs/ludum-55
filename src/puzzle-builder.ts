import { vec } from "excalibur";
import { PuzzleGrid } from "./puzzle-grid";
import { Unit } from "./unit";
import { Level } from "./levels/intro-level";
import Config from "./config";


function calculatePuzzleGoals(puzzleIndex: number) {
    const puzzleGrid = (Config.puzzles as any)[puzzleIndex].grid;

    const solutionRows: number[] = puzzleGrid.map((row: number[]) => row.reduce((a, b) => a + b));
    const solutionColumns: number[] = puzzleGrid.reduce((a: number[], b: number[]) => a.map((x, i) => x + b[i]));

    return {
        columns: solutionColumns,
        rows: solutionRows,
    }
}

export function buildPuzzle(puzzleIndex: number, level: Level): PuzzleGrid {
    const puzzleGoals = calculatePuzzleGoals(puzzleIndex);

    const puzzleGrid = new PuzzleGrid(level, {
        pos: vec(400, 100),
        dimension: puzzleGoals.columns.length,
        goals: {
            // the tilemap is in column-major order, but the config puzzle data structure is in row-major order, so we flip them here to make them line up in the game correctly
            columns: puzzleGoals.rows, 
            rows: puzzleGoals.columns
        }
    });

    // puzzleGrid.addUnit(new Unit({type: 'dragon'}), 0, 0)
    // puzzleGrid.addUnit(new Unit({type: 'kobold'}), 2, 0)


    return puzzleGrid;
}
  