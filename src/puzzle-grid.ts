import { Font, FontUnit, IsometricEntityComponent, IsometricMap, Label, Scene, Sprite, Vector, vec } from "excalibur";
import { Resources } from "./resources";
import { Unit } from "./unit";


export interface PuzzleGridOptions {
    pos: Vector; 
    dimension: number;
    goals: {
        rows: number[]; // length dimension
        columns: number[];
    }
}

export class PuzzleGrid {

    private grassTile: Sprite;
    public iso: IsometricMap;

    public goals: {
        rows: number[]; // length dimension
        columns: number[];
    };

    public grid: (Unit | null)[];
    public dimension: number;

    public goalFont = new Font({
        family: 'sans-serif',
        size: 24,
        unit: FontUnit.Px
    })

    constructor(private scene: Scene, options: PuzzleGridOptions) {
        const {dimension, pos, goals} = options;
        this.iso = new IsometricMap({
            rows: dimension,
            columns: dimension,
            pos,
            tileWidth: 64,
            tileHeight: 64 / 2 
        });

        if (goals.columns.length !== dimension) {
            throw new Error(`Goals for columns length [${goals.columns.length}] need to match dimension [${dimension}]`);
        }
        if (goals.rows.length !== dimension) {
            throw new Error(`Goals for rows length [${goals.columns.length}] need to match dimension [${dimension}]`);
        }

        this.goals = goals;

        this.dimension = dimension;
        this.grid = new Array(dimension * dimension).fill(null);

        this.grassTile = Resources.GrassTile.toSprite();

        for (let tile of this.iso.tiles) {
            tile.addGraphic(this.grassTile);
        }

        scene.add(this.iso);

        for (let [index, columnGoal] of this.goals.columns.entries()) {
            
            const rightMostTile = this.iso.getTile(dimension - 1, index);
            if (rightMostTile) {
                const label = new Label({
                    text: columnGoal.toString(),
                    font: this.goalFont
                });
                label.pos = rightMostTile.pos.add(vec(32, 32));
                scene.add(label);
            }
        }
    }


    addUnit(unit: Unit, x: number, y: number) {
        const tile = this.iso.getTile(x, y);
        if (tile) {
            unit.pos = tile.pos;
            unit.addComponent(new IsometricEntityComponent(this.iso));
            this.scene.add(unit);
            this.grid[x + y * this.dimension] = unit;
        }
    }

    checkSolved() {
        // TODO
    }

}