import { ImageSource, Loader, Sound, SpriteSheet } from "excalibur";

import swordPng from './images/template-sample-image-sword.png';
import grassTilePng from './images/isometric-tiles.png';
import monsterPng from './images/monsters.png';
import projectileMp3 from './sounds/template-sample-sound-projectile.mp3';

export const Resources = {
    Sword: new ImageSource(swordPng),
    GrassTile: new ImageSource(grassTilePng),
    MonsterSheetImage: new ImageSource(monsterPng),
    ProjectileSound: new Sound(projectileMp3)
} as const;

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


