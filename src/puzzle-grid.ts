import { ActionsComponent, Actor, Color, EasingFunctions, FontUnit, IsometricEntityComponent, IsometricMap, IsometricTile, Label, Random, Scene, Sprite, TextAlign, Vector, vec } from "excalibur";
import Config from "./config";
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

type GroundTilePair = {default: Sprite, highlighted: Sprite};

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

    private random: Random;

    public groundTiles: GroundTilePair[];
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

    public goalFont = Resources.Font.toFont({
        size: 16,
        family: "PressStart2P",
        unit: FontUnit.Px,
        color: Color.White,
        textAlign: TextAlign.Center,
        quality: 4
    });

    // housekeeping data structure for lighting up the ground blocks
    public tileRandNumberMap: Map<IsometricTile, number> = new Map();

    public highlight: Actor;

    constructor(private scene: Scene, options: PuzzleGridOptions) {
        this.random = new Random();

        const { dimension, pos, goals } = options;
        this.iso = new IsometricMap({
            rows: dimension,
            columns: dimension,
            pos,
            tileWidth: 64,
            tileHeight: 64 / 2
        });

        this.groundTiles = [
            {default: TilesSpriteSheet.getSprite(0, 0), highlighted: TilesSpriteSheet.getSprite(0, 1)},
            {default: TilesSpriteSheet.getSprite(7, 0), highlighted: TilesSpriteSheet.getSprite(7, 1)},
            {default: TilesSpriteSheet.getSprite(8, 0), highlighted: TilesSpriteSheet.getSprite(8, 1)},
            {default: TilesSpriteSheet.getSprite(9, 0), highlighted: TilesSpriteSheet.getSprite(9, 1)},
            {default: TilesSpriteSheet.getSprite(10, 0), highlighted: TilesSpriteSheet.getSprite(10, 1)},
        ];
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
            const randGroundTileIndex = this.random.integer(0, this.groundTiles.length - 1);
            tile.addGraphic(this.groundTiles[randGroundTileIndex].default);
            this.tileRandNumberMap.set(tile, randGroundTileIndex);
            this.createGroundTileFloatEffect(tile);
        }

        scene.add(this.iso);

        // Draw totals
        for (let [index, columnGoal] of this.goals.columns.entries()) {
            const pos = this.iso.tileToWorld(vec(dimension, index));
            const label = new Label({
                text: columnGoal.toString(),
                font: this.goalFont
            });

            label.addComponent(new IsometricEntityComponent(this.iso));
            label.get(IsometricEntityComponent).elevation = 5;

            label.pos = pos.add(vec(-16, -16));
            scene.add(label);
            this.columnLabels.push(label);
        }

        for (let [index, rowGoal] of this.goals.rows.entries()) {
            const pos = this.iso.tileToWorld(vec(index, dimension));
            const label = new Label({
                text: rowGoal.toString(),
                font: this.goalFont
            });

            label.addComponent(new IsometricEntityComponent(this.iso));
            label.get(IsometricEntityComponent).elevation = 5;

            label.pos = pos.add(vec(16, -16));
            scene.add(label);
            this.rowLabels.push(label);
        }
    }

    createGroundTileFloatEffect(tile: IsometricTile) {
      const actions = new ActionsComponent();
  
      tile.addComponent(actions);
  
      tile.on("initialize", () => {
        const delay = this.random.range(1, 20, 80)[0];
        const float = this.random.range(1, 2, 5)[0];
  
        actions.delay(delay);
        actions.repeatForever((repeatBuilder) => {
          repeatBuilder
            .easeBy(0, float, 4500, EasingFunctions.EaseInCubic)
            .easeBy(0, -float, 5000, EasingFunctions.EaseOutCubic);
        });
      });
    }

    isFixed(x: number, y: number) {
        return !!this.grid[x + y * this.dimension]?.config.fixed;
    }

    getType(x: number, y: number) {
        return this.grid[x + y * this.dimension]?.config.type;
    }

    showHighlight(pos: Vector) {
        if (Config.showBoardHighlights) {
            this.removeHighlightFromAllCells();
        }
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
            if (Config.showBoardHighlights) {
                this.highlightRowAndColumn(tile.x, tile.y);
            }
        } else {
            this.hideHighlight();
        }
    }
    showHighlightByCoordinate(x: number, y: number) {
        if (Config.showBoardHighlights) {
            this.removeHighlightFromAllCells();
        }
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

            if (Config.showBoardHighlights) {
                this.highlightRowAndColumn(tile.x, tile.y);
            }
        } else {
            this.hideHighlight();
        }
    }

    validTile(pos: Vector) {
        const tile = this.iso.getTileByPoint(pos.add(vec(0, 32)));
        return !!tile;
    }

    getTileCoord(pos: Vector): { x: number, y: number } | null {
        const tile = this.iso.getTileByPoint(pos.add(vec(0, 32)));
        if (tile) {
            return { x: tile.x, y: tile.y };
        }
        return null;
    }

    private adjustHighlightTilesInRowAndColumn(highlightTiles: boolean, rowIndex: number, columnIndex: number) {
        const newSpriteType = highlightTiles ? 'highlighted' : 'default';
        const currentSpriteType = highlightTiles ? 'default' : 'highlighted';
        
        for (let i=0; i < this.dimension; i++) {
            const tile = this.iso.getTile(rowIndex, i)
            const tileType = this.getType(rowIndex, i);
            if (tile && tileType !== 'pit') {
                const randNumberKey = this.tileRandNumberMap.get(tile) || 0;
                tile.addGraphic(this.groundTiles[randNumberKey][newSpriteType]);
                tile.removeGraphic(this.groundTiles[randNumberKey][currentSpriteType]);
            }
        }
        for (let i=0; i < this.dimension; i++) {
            const tile = this.iso.getTile(i, columnIndex)
            const tileType = this.getType(i, columnIndex);
            if (tile && tileType !== 'pit') {
                const randNumberKey = this.tileRandNumberMap.get(tile) || 0;
                tile.addGraphic(this.groundTiles[randNumberKey][newSpriteType]);
                tile.removeGraphic(this.groundTiles[randNumberKey][currentSpriteType]);
            }
        }
    }

    highlightRowAndColumn(rowIndex: number, columnIndex: number) {
        this.adjustHighlightTilesInRowAndColumn(true, rowIndex, columnIndex);
    }

    removeHighlightFromAllCells() {
        for (let i=0; i < this.dimension; i++) {
            this.adjustHighlightTilesInRowAndColumn(false, i, 0);
        }
        
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
        if (unit) {
            unit.kill();
        }
        this.grid[x + y * this.dimension] = null;
        let valueHint = this.hintGrid[x + y * this.dimension];
        if (valueHint) {
            valueHint.graphics.visible = false;
        }
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
            hint.graphics.opacity = Config.valueHint.opacity;
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