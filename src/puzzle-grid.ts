import { IsometricEntityComponent, IsometricMap, Scene, Sprite, Vector } from "excalibur";
import { Resources } from "./resources";
import { Unit } from "./unit";


export class PuzzleGrid {

    private grassTile: Sprite;
    public iso: IsometricMap;

    constructor(private scene: Scene, options: {pos: Vector, dimension: number}) {
        const {dimension, pos} = options;
        this.iso = new IsometricMap({
            rows: dimension,
            columns: dimension,
            pos,
            tileWidth: 64,
            tileHeight: 64 / 2 
        });

        this.grassTile = Resources.GrassTile.toSprite();

        for (let tile of this.iso.tiles) {
            tile.addGraphic(this.grassTile);
        }

        scene.add(this.iso);
    }


    addUnit(unit: Unit, x: number, y: number) {
        const tile = this.iso.getTile(x, y);
        if (tile) {
            unit.pos = tile.pos;
            unit.addComponent(new IsometricEntityComponent(this.iso));
            this.scene.add(unit);
        }
    }

}