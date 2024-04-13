"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = exports.UnitsConfig = void 0;
const excalibur_1 = require("excalibur");
const resources_1 = require("./resources");
exports.UnitsConfig = {
    dragon: {
        value: 9,
        graphic: resources_1.MonsterSpriteSheet.getSprite(3, 0)
    },
    orc: {
        value: 5,
        graphic: resources_1.MonsterSpriteSheet.getSprite(2, 0)
    },
    goblin: {
        value: 3,
        graphic: resources_1.MonsterSpriteSheet.getSprite(1, 0)
    },
    kobold: {
        value: 2,
        graphic: resources_1.MonsterSpriteSheet.getSprite(4, 0)
    },
    rat: {
        value: 1,
        graphic: resources_1.MonsterSpriteSheet.getSprite(0, 0)
    },
    knight: {
        value: -5,
        graphic: resources_1.MonsterSpriteSheet.getSprite(0, 1)
    },
    archer: {
        value: -2,
        graphic: resources_1.MonsterSpriteSheet.getSprite(1, 1)
    }
};
class Unit extends excalibur_1.Actor {
    constructor(options) {
        super({
            width: 64,
            height: 64,
            anchor: (0, excalibur_1.vec)(.5, 1)
        });
        this.config = exports.UnitsConfig[options.type];
        this.graphics.use(this.config.graphic);
    }
}
exports.Unit = Unit;
