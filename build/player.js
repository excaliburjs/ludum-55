"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const excalibur_1 = require("excalibur");
const resources_1 = require("./resources");
class Player extends excalibur_1.Actor {
    constructor(pos) {
        super({
            pos,
            width: 100,
            height: 100
        });
        this.graphics.use(resources_1.Resources.Sword.toSprite());
    }
}
exports.Player = Player;
