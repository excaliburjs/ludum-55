"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = exports.MonsterSpriteSheet = exports.Resources = void 0;
const excalibur_1 = require("excalibur");
const template_sample_image_sword_png_1 = __importDefault(require("./images/template-sample-image-sword.png"));
const isometric_tiles_png_1 = __importDefault(require("./images/isometric-tiles.png"));
const monsters_png_1 = __importDefault(require("./images/monsters.png"));
const template_sample_sound_projectile_mp3_1 = __importDefault(require("./sounds/template-sample-sound-projectile.mp3"));
exports.Resources = {
    Sword: new excalibur_1.ImageSource(template_sample_image_sword_png_1.default),
    GrassTile: new excalibur_1.ImageSource(isometric_tiles_png_1.default),
    MonsterSheetImage: new excalibur_1.ImageSource(monsters_png_1.default),
    ProjectileSound: new excalibur_1.Sound(template_sample_sound_projectile_mp3_1.default)
};
exports.MonsterSpriteSheet = excalibur_1.SpriteSheet.fromImageSource({
    image: exports.Resources.MonsterSheetImage,
    grid: {
        rows: 10,
        columns: 10,
        spriteWidth: 32,
        spriteHeight: 32
    }
});
exports.loader = new excalibur_1.Loader();
for (let res of Object.values(exports.Resources)) {
    exports.loader.addResource(res);
}
