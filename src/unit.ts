import { Actor, Graphic, IsometricEntityComponent, Vector, vec } from "excalibur";
import { MonsterSpriteSheet, TilesSpriteSheet } from "./resources";

export type UnitType = 'dragon' | 'orc' | 'goblin' | 'kobold' | 'rat' | 'knight' | 'archer' | 'wall' | 'pit' | 'rubble'

export interface UnitConfig {
    type: UnitType;
    value: number;
    graphic: Graphic;
    fixed?: boolean;
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
        fixed: true,
        value: -5,
        graphic: MonsterSpriteSheet.getSprite(0, 1)
    },
    archer: {
        type: 'archer',
        fixed: true,
        value: -2,
        graphic: MonsterSpriteSheet.getSprite(1, 1)
    },
    wall: {
        type: 'wall',
        fixed: true,
        value: 0,
        graphic: TilesSpriteSheet.getSprite(4, 0)
    },
    pit: {
        type: 'pit',
        fixed: true,
        value: 0,
        graphic: TilesSpriteSheet.getSprite(7, 0)
    },
    rubble: {
        type: 'rubble',
        fixed: true,
        value: 0,
        graphic: TilesSpriteSheet.getSprite(3, 0)
    }
}

function unitNumberToUnitType(): Map<number, UnitType> {
    let mapping = new Map<number, UnitType>();
    for (const key in UnitsConfig) {
        mapping.set((UnitsConfig as any)[key].value, key as UnitType )
    }
    return mapping;
}

export const UnitNumberToUnitType = unitNumberToUnitType();

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