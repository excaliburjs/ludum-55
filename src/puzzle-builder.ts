import { vec } from "excalibur";
import { PuzzleGrid } from "./puzzle-grid";
import { Unit, UnitNumberToUnitType } from "./unit";
import { Level } from "./levels/main-level";
import Config from "./config";


function calculatePuzzleGoals(puzzleIndex: number) {
    const puzzleArray = (Config.puzzles as any)[puzzleIndex].grid;

    const solutionRows: number[] = puzzleArray.map((row: number[]) => row.reduce((a, b) => a + b));
    const solutionColumns: number[] = puzzleArray.reduce((a: number[], b: number[]) => a.map((x, i) => x + b[i]));

    return {
        columns: solutionColumns,
        rows: solutionRows,
    }
}

function placeEnemies(puzzleIndex: number, puzzleGrid: PuzzleGrid) {
    const puzzleArray = (Config.puzzles as any)[puzzleIndex].grid;
    console.log({puzzleArray});

    for(let i=0; i < puzzleArray.length; i++) {
        let row = puzzleArray[i];
        for(let j=0; j < row.length; j++) {
            const cellValue = row[j];
            if (cellValue < 0) {
                const unitType = UnitNumberToUnitType.get(cellValue);
                if (unitType) {
                    puzzleGrid.addUnit(new Unit({type: unitType}), j, i)
                } else {
                    console.error(`No unit type matches the number ${cellValue}`);
                }
            } else if (cellValue === 0) {
                // TODO add to list of empty spaces to place
            }
        }
    }
}

export function buildPuzzle(puzzleIndex: number, level: Level): PuzzleGrid {
    console.log({puzzleIndex});
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

    placeEnemies(puzzleIndex, puzzleGrid)
    // puzzleGrid.addUnit(new Unit({type: 'dragon'}), 0, 0)
    // puzzleGrid.addUnit(new Unit({type: 'kobold'}), 2, 0)


    return puzzleGrid;
}
  