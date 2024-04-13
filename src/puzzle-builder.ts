import { vec } from "excalibur";
import { PuzzleGrid } from "./puzzle-grid";
import { Unit, UnitConfig, UnitsConfig, UnitType, UnitNumberToUnitType } from "./unit";
import Config from "./config";
import { Inventory, InventoryConfig } from "./inventory";
import { Level } from "./levels/main-level";


function calculatePuzzleGoals(puzzleIndex: number) {
    const puzzleArray = (Config.puzzles as any)[puzzleIndex].grid;

    const solutionRows: number[] = puzzleArray.map((row: number[]) => row.reduce((a, b) => a + b));
    const solutionColumns: number[] = puzzleArray.reduce((a: number[], b: number[]) => a.map((x, i) => x + b[i]));

    return {
        columns: solutionColumns,
        rows: solutionRows,
    }
}

function populatePuzzle(puzzleIndex: number, puzzleGrid: PuzzleGrid) {
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

export function calculateInventory(puzzleIndex: number, level: Level): InventoryConfig {
    const puzzleArray = (Config.puzzles as any)[puzzleIndex].grid;

    let reverseMap: {[id:number]: UnitType} = {};
    for(let r of Object.keys(UnitsConfig)) {
        let unit = ((UnitsConfig as any)[r] as UnitConfig);
        reverseMap[unit.value] = r as UnitType;
    }
    let counts: Record<UnitType, number> = {
        dragon: 0,
        orc: 0,
        goblin: 0,
        kobold: 0,
        rat: 0,
        knight: 0,
        archer: 0
    };

    for(let i = 0; i < puzzleArray.length; i++){
        for(let j = 0; j < puzzleArray[i].length; j++) {
            counts[
                reverseMap[puzzleArray[j][i]]
            ] ++;
        }
    }
    return counts;
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

    populatePuzzle(puzzleIndex, puzzleGrid)

    return puzzleGrid;
}
  