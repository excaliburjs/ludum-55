import { ImageSource, Loader, Sound, SpriteSheet } from "excalibur";

import swordPng from './images/template-sample-image-sword.png';
import tilesPng from './images/isometric-tiles.png';
import monsterPng from './images/monsters.png';
import projectileMp3 from './sounds/template-sample-sound-projectile.mp3';

export const Resources = {
    Sword: new ImageSource(swordPng),
    TilesSheetImage: new ImageSource(tilesPng),
    MonsterSheetImage: new ImageSource(monsterPng),
    ProjectileSound: new Sound(projectileMp3)
} as const;

export const TilesSpriteSheet = SpriteSheet.fromImageSource({
    image: Resources.TilesSheetImage,
    grid: {
        rows: 1,
        columns: 5,
        spriteHeight: 64,
        spriteWidth: 64
    }
})

export const MonsterSpriteSheet = SpriteSheet.fromImageSource({
    image: Resources.MonsterSheetImage,
    grid: {
        rows: 10,
        columns: 10,
        spriteWidth: 32,
        spriteHeight: 32
    }
});

export const loader = new Loader();

for (let res of Object.values(Resources)) {
    loader.addResource(res);
}


