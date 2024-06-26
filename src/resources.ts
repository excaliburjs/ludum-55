import { Color, FontSource, ImageSource, Loader, Sound, SpriteSheet } from "excalibur";
import { SoundConfig } from "@excaliburjs/plugin-jsfxr";
import { AsepriteResource } from "@excaliburjs/plugin-aseprite";
import Config from "./config";

import pixelFont from './font/PressStart2P-Regular.ttf';

import swordPng from "./images/template-sample-image-sword.png";
import tilesPng from "./images/isometric-tiles.png";
import monsterPng from "./images/monsters.png";
import largeSummonCirclePng from './images/large-summon-circle.png';
import titleTextPng from './images/sum-logo.png';
import playNowTextPng from './images/playnow.png';

import backgroundAseprite from './images/BackgroundTileAnimated.aseprite';
import summonerAseprite from './images/SummonerSpriteAnimations_v2_1.aseprite';

import ratIdleAseprite from './images/RatSpriteAnimated.aseprite';
import goblinIdleAseprite from './images/GoblinSpriteWithSpearAnimated.aseprite';
import orcIdleAseprite from './images/OrcSpriteAnimated.aseprite';
import dragonIdleAseprite from './images/DragonSpriteAnimated.aseprite';
import knightIdleAseprite from './images/HelmetKnightSpriteAnimated.aseprite';
import archerIdleAseprite from './images/ArcherPlusBowSpriteAnimated.aseprite';

import gloveAseprite from './images/glove.aseprite';

import projectileMp3 from "./sounds/template-sample-sound-projectile.mp3";
import backgroundMusicMp3 from "./sounds/background_1_loopable.mp3"

interface PlayableSfxrSoundConfig extends SoundConfig {
  play(): void;
}

export const Resources = {
  Font: new FontSource(pixelFont, "PressStart2P"),
  Sword: new ImageSource(swordPng),
  TilesSheetImage: new ImageSource(tilesPng),
  MonsterSheetImage: new ImageSource(monsterPng),
  LargeSummonCircleImage: new ImageSource(largeSummonCirclePng),
  TitleTextImage: new ImageSource(titleTextPng),
  PlayNowImage: new ImageSource(playNowTextPng),
  Summoner: new AsepriteResource(summonerAseprite),
  Background: new AsepriteResource(backgroundAseprite),

  RatIdle: new AsepriteResource(ratIdleAseprite),
  GoblinIdle: new AsepriteResource(goblinIdleAseprite),
  OrcIdle: new AsepriteResource(orcIdleAseprite),
  DragonIdle: new AsepriteResource(dragonIdleAseprite),
  KnightIdle: new AsepriteResource(knightIdleAseprite),
  ArcherIdle: new AsepriteResource(archerIdleAseprite),

  Glove: new AsepriteResource(gloveAseprite),
  ProjectileSound: new Sound(projectileMp3),
  BackgroundMusic: new Sound(backgroundMusicMp3),
} as const;

/**
 * Sound effects generated with sfxr
 * https://sfxr.me/
 *
 * Copy serialized code
 */
const sounds = {
  place: "place",
  remove: "remove",
  clearPuzzle: "clearPuzzle",
  selectInventory: "selectInventory"
}as const;
type TypeOfSounds = (typeof sounds)[keyof typeof sounds];

export const SfxrSounds: Record<TypeOfSounds, PlayableSfxrSoundConfig> = {
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
    sound_vol: Config.SoundVolume,
    sample_rate: 44100,
    sample_size: 8,
  } as unknown as PlayableSfxrSoundConfig,
  remove: {
    oldParams: true,
    wave_type: 1,
    p_env_attack: 0.19054210860625442,
    p_env_sustain: 0.2329064084519712,
    p_env_punch: 0.42286052849117284,
    p_env_decay: 0.9662406049467178,
    p_base_freq: 0.19255692561524382,
    p_freq_limit: 0,
    p_freq_ramp: 0,
    p_freq_dramp: 0,
    p_vib_strength: 0,
    p_vib_speed: 0,
    p_arp_mod: 0,
    p_arp_speed: 0.5378912044598784,
    p_duty: 0.726883743888366,
    p_duty_ramp: 0,
    p_repeat_speed: 0,
    p_pha_offset: 0,
    p_pha_ramp: 0,
    p_lpf_freq: 1,
    p_lpf_ramp: 0.08829112189578447,
    p_lpf_resonance: 0.6665719860793264,
    p_hpf_freq: 0,
    p_hpf_ramp: 0.8418784889521622,
    sound_vol: Config.SoundVolume,
    sample_rate: 44100,
    sample_size: 8,
  } as unknown as PlayableSfxrSoundConfig,
  clearPuzzle: {
    oldParams: true,
    wave_type: 0,
    p_env_attack: 0,
    p_env_sustain: 0.287,
    p_env_punch: 0.073,
    p_env_decay: 0.701,
    p_base_freq: 0.438,
    p_freq_limit: 0,
    p_freq_ramp: 0.433,
    p_freq_dramp: 0,
    p_vib_strength: 0,
    p_vib_speed: 0,
    p_arp_mod: 0,
    p_arp_speed: 0,
    p_duty: 0.325927808916591,
    p_duty_ramp: 0,
    p_repeat_speed: 0.7089241508794835,
    p_pha_offset: 0,
    p_pha_ramp: 0,
    p_lpf_freq: 1,
    p_lpf_ramp: 0,
    p_lpf_resonance: 0,
    p_hpf_freq: 0,
    p_hpf_ramp: 0,
    sound_vol: Config.SoundVolume,
    sample_rate: 44100,
    sample_size: 8,
  } as unknown as PlayableSfxrSoundConfig,
  selectInventory: {
    oldParams: true,
    p_arp_mod: 0,
    p_arp_speed: 0,
    p_base_freq: 0.36,
    p_duty: 0,
    p_duty_ramp: -0.59,
    p_env_attack: 0,
    p_env_decay: 0.254,
    p_env_punch: 0.873,
    p_env_sustain: 0.072,
    p_freq_dramp: 0,
    p_freq_limit: 0,
    p_freq_ramp: 0,
    p_hpf_freq: 0,
    p_hpf_ramp: 0,
    p_lpf_freq: 1,
    p_lpf_ramp: 0,
    p_lpf_resonance: 0,
    p_pha_offset: 0,
    p_pha_ramp: 0,
    p_repeat_speed: 0,
    p_vib_speed: 0,
    p_vib_strength: 0,
    sample_rate: 44100,
    sample_size: 8,
    sound_vol: Config.SoundVolume,
    wave_type: 0
  } as unknown as PlayableSfxrSoundConfig,
} as const;

export const TilesSpriteSheet = SpriteSheet.fromImageSource({
  image: Resources.TilesSheetImage,
  grid: {
    rows: 2,
    columns: 11,
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
loader.backgroundColor = '#420020';

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
