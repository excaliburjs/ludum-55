import { Actor, Vector } from "excalibur";
import { Resources } from "./resources";

export class Player extends Actor {
    constructor(pos: Vector) {
        super({
            pos,
            width: 100,
            height: 100
        })
        this.graphics.use(Resources.Sword.toSprite());
    }
}