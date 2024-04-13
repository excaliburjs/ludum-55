"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuzzleGrid = void 0;
const excalibur_1 = require("excalibur");
const resources_1 = require("./resources");
class PuzzleGrid {
    constructor(scene, options) {
        this.scene = scene;
        this.goalFont = new excalibur_1.Font({
            family: 'sans-serif',
            size: 24,
            unit: excalibur_1.FontUnit.Px
        });
        const { dimension, pos, goals } = options;
        this.iso = new excalibur_1.IsometricMap({
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
        this.grassTile = resources_1.Resources.GrassTile.toSprite();
        for (let tile of this.iso.tiles) {
            tile.addGraphic(this.grassTile);
        }
        scene.add(this.iso);
        for (let [index, columnGoal] of this.goals.columns.entries()) {
            const rightMostTile = this.iso.getTile(dimension - 1, index);
            if (rightMostTile) {
                const label = new excalibur_1.Label({
                    text: columnGoal.toString(),
                    font: this.goalFont
                });
                label.pos = rightMostTile.pos.add((0, excalibur_1.vec)(32, 32));
                scene.add(label);
            }
        }
        for (let [index, rowGoal] of this.goals.rows.entries()) {
            const bottomMostTile = this.iso.getTile(index, dimension - 1);
            if (bottomMostTile) {
                const label = new excalibur_1.Label({
                    text: rowGoal.toString(),
                    font: this.goalFont
                });
                label.pos = bottomMostTile.pos.add((0, excalibur_1.vec)(-32, 32));
                scene.add(label);
            }
        }
    }
    addUnit(unit, x, y) {
        const tile = this.iso.getTile(x, y);
        if (tile) {
            unit.pos = tile.pos;
            unit.addComponent(new excalibur_1.IsometricEntityComponent(this.iso));
            this.scene.add(unit);
            this.grid[x + y * this.dimension] = unit;
        }
    }
    checkSolved() {
        var _a, _b, _c, _d;
        for (let x = 0; x < this.dimension; x++) {
            let colSum = 0;
            for (let y = 0; y < this.dimension; y++) {
                colSum += (_b = (_a = this.grid[x + y * this.dimension]) === null || _a === void 0 ? void 0 : _a.config.value) !== null && _b !== void 0 ? _b : 0;
            }
            if (colSum != this.goals.columns[x])
                return false;
        }
        for (let y = 0; y < this.dimension; y++) {
            let rowSum = 0;
            for (let x = 0; x < this.dimension; x++) {
                rowSum += (_d = (_c = this.grid[x + y * this.dimension]) === null || _c === void 0 ? void 0 : _c.config.value) !== null && _d !== void 0 ? _d : 0;
            }
            if (rowSum != this.goals.rows[y])
                return false;
        }
        return true;
    }
}
exports.PuzzleGrid = PuzzleGrid;
