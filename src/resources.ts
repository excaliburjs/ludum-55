import { ImageSource, Loader, Sound, SpriteSheet } from "excalibur";
import { SoundConfig } from "@excaliburjs/plugin-jsfxr";

import swordPng from "./images/template-sample-image-sword.png";
import tilesPng from "./images/isometric-tiles.png";
import monsterPng from "./images/monsters.png";
import projectileMp3 from "./sounds/template-sample-sound-projectile.mp3";
import backgroundMusicMp3 from "./sounds/background.mp3";

interface PlayableSfxrSoundConfig extends SoundConfig {
  play?(): void;
}

export const Resources = {
  Sword: new ImageSource(swordPng),
  TilesSheetImage: new ImageSource(tilesPng),
  MonsterSheetImage: new ImageSource(monsterPng),
  ProjectileSound: new Sound(projectileMp3),
  BackgroundMusic: new Sound(backgroundMusicMp3),
} as const;

export const SfxrSounds: Record<string, PlayableSfxrSoundConfig> = {
  place: {
    oldParams: true,
    wave_type: 1,
    p_env_attack: 0.05780509070663309,
    p_env_sustain: 0.282,
    p_env_punch: 0.168,
    p_env_decay: 0.395,
    p_base_freq: 0.191,
    p_freq_limit: 0,
    p_freq_ramp: 0,
    p_freq_dramp: 0,
    p_vib_strength: 0,
    p_vib_speed: 0,
    p_arp_mod: 0.033,
    p_arp_speed: 0.4674561746824588,
    p_duty: 0.214,
    p_duty_ramp: 0.734,
    p_repeat_speed: 0,
    p_pha_offset: 0,
    p_pha_ramp: 0,
    p_lpf_freq: 1,
    p_lpf_ramp: 0.211,
    p_lpf_resonance: 0.24772115873303813,
    p_hpf_freq: 0.545696061417478,
    p_hpf_ramp: 0,
    sound_vol: 0.25,
    sample_rate: 44100,
    sample_size: 8,
  },
};

export const TilesSpriteSheet = SpriteSheet.fromImageSource({
  image: Resources.TilesSheetImage,
  grid: {
    rows: 1,
    columns: 10,
    spriteHeight: 64,
    spriteWidth: 64,
  },
});

export const MonsterSpriteSheet = SpriteSheet.fromImageSource({
  image: Resources.MonsterSheetImage,
  grid: {
    rows: 10,
    columns: 10,
    spriteWidth: 32,
    spriteHeight: 32,
  },
});

export const loader = new Loader();

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
