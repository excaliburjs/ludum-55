import { IsometricMap, Scene, Sprite, Vector } from "excalibur";
import { Resources } from "./resources";


export class PuzzleGrid {

    private grassTile: Sprite;
    public iso: IsometricMap;

    constructor(scene: Scene, options: {pos: Vector, dimension: number}) {
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

}