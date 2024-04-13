import { Actor, Graphic, IsometricEntityComponent, Vector, vec } from "excalibur";
import { MonsterSpriteSheet } from "./resources";

export type UnitType = 'dragon' | 'orc' | 'goblin' | 'kobold' | 'rat' | 'knight' | 'archer'

export interface UnitConfig {
    type: UnitType;
    value: number;
    graphic: Graphic;
}

export const UnitsConfig: Record<UnitType, UnitConfig> = {
    dragon: {
        type: 'dragon',
        value: 9,
        graphic: MonsterSpriteSheet.getSprite(3, 0)
    },
    orc: {
        type: 'orc',
        value: 5,
        graphic: MonsterSpriteSheet.getSprite(2, 0)
    },
    goblin: {
        type: 'goblin',
        value: 3,
        graphic: MonsterSpriteSheet.getSprite(1, 0)
    },
    kobold: {
        type: 'kobold',
        value: 2,
        graphic: MonsterSpriteSheet.getSprite(4, 0)
    },
    rat: {
        type: 'rat',
        value: 1,
        graphic: MonsterSpriteSheet.getSprite(0, 0)
    },
    knight: {
        type: 'knight',
        value: -5,
        graphic: MonsterSpriteSheet.getSprite(0, 1)
    },
    archer: {
        type: 'archer',
        value: -2,
        graphic: MonsterSpriteSheet.getSprite(1, 1)
    }
}

export class Unit extends Actor {
    config: UnitConfig;
    
    constructor(options: { type: UnitType })  {
        super({
            width: 64,
            height: 64,
            anchor: vec(.5, 1)
        })

        this.config = UnitsConfig[options.type];
        this.graphics.use(this.config.graphic);
    }
}