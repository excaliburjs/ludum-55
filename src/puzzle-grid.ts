import { Actor, Color, Font, FontUnit, IsometricEntityComponent, IsometricMap, Label, Scene, Sprite, Vector, vec } from "excalibur";
import { MonsterSpriteSheet, Resources, TilesSpriteSheet } from "./resources";
import { Unit, UnitType } from "./unit";


export interface PuzzleGridOptions {
    pos: Vector; 
    dimension: number;
    goals: {
        rows: number[]; // length dimension
        columns: number[];
    }
}

export const ValueHintSprite: Record<UnitType, Sprite> = {
    dragon: MonsterSpriteSheet.getSprite(3, 2),
    orc: MonsterSpriteSheet.getSprite(2, 2),
    goblin: MonsterSpriteSheet.getSprite(1, 2),
    rat: MonsterSpriteSheet.getSprite(0, 2),
    knight: MonsterSpriteSheet.getSprite(0, 3),
    archer: MonsterSpriteSheet.getSprite(1, 3),
    wall: MonsterSpriteSheet.getSprite(2, 3),
    pit: MonsterSpriteSheet.getSprite(2, 3),
    rubble: MonsterSpriteSheet.getSprite(2, 3),
} as const;

export class PuzzleGrid {

    private grassTile: Sprite;
    private highlightSprite: Sprite;
    private unplaceableHighlightSprite: Sprite;

    public hintGrid: (Actor | null)[];

    public iso: IsometricMap;


    public goals: {
        rows: number[]; // length dimension
        columns: number[];
    };

    public grid: (Unit | null)[];
    public dimension: number;

    private columnLabels: Label[] = [];
    private rowLabels: Label[] = [];

    public goalFont = new Font({
        family: 'sans-serif',
        size: 24,
        unit: FontUnit.Px,
        color: Color.White
    });

    public highlight: Actor;

    constructor(private scene: Scene, options: PuzzleGridOptions) {
        const {dimension, pos, goals} = options;
        this.iso = new IsometricMap({
            rows: dimension,
            columns: dimension,
            pos,
            tileWidth: 64,
            tileHeight: 64 / 2 
        });

        this.grassTile = TilesSpriteSheet.getSprite(0, 0);
        this.highlightSprite = TilesSpriteSheet.getSprite(1, 0);
        this.unplaceableHighlightSprite = TilesSpriteSheet.getSprite(2, 0);

        this.highlight = new Actor({
            width: 64,
            height: 64,
            anchor: vec(0.5, 1)
        });
        this.highlight.addComponent(new IsometricEntityComponent(this.iso));
        this.highlight.get(IsometricEntityComponent).elevation = 2;
        this.highlight.graphics.use(this.highlightSprite);
        this.highlight.graphics.visible = false;
        scene.add(this.highlight);

        if (goals.columns.length !== dimension) {
            throw new Error(`Goals for columns length [${goals.columns.length}] need to match dimension [${dimension}]`);
        }
        if (goals.rows.length !== dimension) {
            throw new Error(`Goals for rows length [${goals.columns.length}] need to match dimension [${dimension}]`);
        }

        this.goals = goals;

        this.dimension = dimension;
        this.grid = new Array(dimension * dimension).fill(null);
        this.hintGrid = new Array(dimension * dimension).fill(null);

        for (let tile of this.iso.tiles) {
            tile.addGraphic(this.grassTile);
        }

        scene.add(this.iso);

        // Draw totals
        for (let [index, columnGoal] of this.goals.columns.entries()) {
            
            const rightMostTile = this.iso.getTile(dimension - 1, index);
            if (rightMostTile) {
                const label = new Label({
                    text: columnGoal.toString(),
                    font: this.goalFont
                });
                label.pos = rightMostTile.pos.add(vec(32, 32));
                scene.add(label);
                this.columnLabels.push(label);
            }
        }

        for (let [index, rowGoal] of this.goals.rows.entries()) {
            
            const bottomMostTile = this.iso.getTile(index, dimension - 1);
            if (bottomMostTile) {
                const label = new Label({
                    text: rowGoal.toString(),
                    font: this.goalFont
                });
                label.pos = bottomMostTile.pos.add(vec(-32, 32));
                scene.add(label);
                this.rowLabels.push(label);
            }
        }
    }

    isFixed(x: number, y: number) {
        return !!this.grid[x + y * this.dimension]?.config.fixed;
    }

    getType(x: number, y: number) {
        return this.grid[x + y * this.dimension]?.config.type;
    }

    showHighlight(pos: Vector) {
        const tile = this.iso.getTileByPoint(pos.add(vec(0, 32)));
        if (tile) {
            if (this.isFixed(tile.x, tile.y)) {
                this.highlight.graphics.use(this.unplaceableHighlightSprite);
            } else {
                this.highlight.graphics.use(this.highlightSprite);
            }
            this.highlight.graphics.visible = true;
            this.highlight.pos = tile.pos;
            this.highlight.graphics.offset = vec(0, 32);
        } else {
            this.hideHighlight();
        }
    }
    showHighlightByCoordinate(x: number, y: number) {
        const tile = this.iso.getTile(x, y);
        if (tile) {
            if (this.isFixed(tile.x, tile.y)) {
                this.highlight.graphics.use(this.unplaceableHighlightSprite);
            } else {
                this.highlight.graphics.use(this.highlightSprite);
            }
            this.highlight.graphics.visible = true;
            this.highlight.pos = tile.pos;
            this.highlight.graphics.offset = vec(0, 32);
        } else {
            this.hideHighlight();
        }
    }

    validTile(pos: Vector) {
        const tile = this.iso.getTileByPoint(pos.add(vec(0, 32)));
        return !!tile;
    }

    getTileCoord(pos: Vector): {x: number, y: number} | null {
        const tile = this.iso.getTileByPoint(pos.add(vec(0, 32)));
        if (tile) {
            return { x: tile.x, y: tile.y };
        }
        return null;
    }

    hideHighlight() {
        this.highlight.graphics.visible = false;
    }

    /**
     * Get the unit at a current cell
     * @param x 
     * @param y 
     * @returns Unit or null
     */
    getUnit(x: number, y: number): Unit | null {
        return this.grid[x + y * this.dimension];
    }

    /**
     * Clears the current cell of any units
     * @param x 
     * @param y 
     */
    clearCell(x: number, y: number): void {
        let unit = this.grid[x + y * this.dimension];
        if(unit) {
            unit.kill();
        }
        this.grid[x + y * this.dimension] = null;
    }

    /**
     * Adds a unit to a grid cell, returns true is place, false if unsuccessful and currently occupied
     * @param unit
     * @param x 
     * @param y 
     */
    addUnit(unit: Unit, x: number, y: number): boolean {
        const tile = this.iso.getTile(x, y);

        if (tile && this.grid[x + y * this.dimension]?.config.fixed) {
            return false;
        }

        // TODO kind of bad but certain units also influence the tile below
        if (tile && unit.config.type === 'pit') {
            tile.clearGraphics();
            tile.addGraphic(TilesSpriteSheet.getSprite(5, 0))
        }

        if (tile && !this.grid[x + y * this.dimension]) {
            unit.pos = tile.pos;
            if (unit.config.value !== 0) {
                unit.graphics.offset = vec(0, -8);
            }
            unit.addComponent(new IsometricEntityComponent(this.iso));
            unit.get(IsometricEntityComponent).elevation = 3;
            this.scene.add(unit);
            this.grid[x + y * this.dimension] = unit;
            return true;
        }
        return false;
    }

    /**
     * Get the valueHint at a current cell
     * @param x 
     * @param y 
     * @returns Actor or null
     */
    getValueHint(x: number, y: number): Actor | null {
        return this.hintGrid[x + y * this.dimension];
    }

    /**
     * Adds a value hint to a grid cell, returns true if placed, false if unsuccessful (value hint already placed)
     * @param x 
     * @param y 
     */
    addValueHint(x: number, y: number): boolean {
        const hint = new Actor({
            width: 64,
            height: 64,
            anchor: vec(0.5, 1)
        });

        const tile = this.iso.getTile(x, y);

        if (tile && this.hintGrid[x + y * this.dimension]) {
            return false;
        }

        if (tile && !this.hintGrid[x + y * this.dimension]) {
            hint.pos = tile.pos;
            hint.addComponent(new IsometricEntityComponent(this.iso));
            hint.get(IsometricEntityComponent).elevation = 4;
            hint.graphics.use(ValueHintSprite['rat']); // TODO
            hint.graphics.offset = vec(0, -8);
            hint.graphics.visible = false;
            this.scene.add(hint);
            this.hintGrid[x + y * this.dimension] = hint;
            return true;
        }
        return false;
    }

    /**
     * Checks whether the board state is solved
     * Also updates row/column numbers...yes, it should probably be done elsewhere
     * @returns whether or not the board state is solved
     */
    checkSolved(): boolean {
        let solved: boolean = true;
        for (let x = 0; x < this.dimension; x++) {
            let rowSum = 0;
            for (let y = 0; y < this.dimension; y++) {
                rowSum += this.grid[x + y * this.dimension]?.config.value ?? 0
            }
            //this.rowLabels[x].text = (this.goals.rows[x] - rowSum).toString();

            if (rowSum !== this.goals.rows[x]) {
                solved = solved && false;
            } 
        }
        for (let y = 0; y < this.dimension; y++) {
            let colSum = 0;
            for (let x = 0; x < this.dimension; x++) {
                colSum += this.grid[x + y * this.dimension]?.config.value ?? 0
            }
            //this.columnLabels[y].text = (this.goals.columns[y] - colSum).toString();
            if (colSum != this.goals.columns[y]) {
                solved = solved && false;
            }
        }
        return solved;
    }

}