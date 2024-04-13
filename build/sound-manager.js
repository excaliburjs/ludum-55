"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundManager = void 0;
const excalibur_1 = require("excalibur");
const classnames_1 = __importDefault(require("classnames"));
const resources_1 = require("./resources");
const preferences_1 = require("./preferences");
const config_1 = __importDefault(require("./config"));
class SoundManager {
    static setSoundSpecificVolume() {
        // Example
        // Resources.Clank.volume = 0.5;
    }
    static init() {
        SoundManager.setSoundSpecificVolume();
        if (preferences_1.Preferences.muteBackgroundMusic) {
            SoundManager.muteBackgroundMusic();
        }
        if (preferences_1.Preferences.muteAll) {
            SoundManager.muteAll();
        }
        $("#mute-music").on("click", () => {
            if (preferences_1.Preferences.muteBackgroundMusic) {
                SoundManager.unmuteBackgroundMusic();
            }
            else {
                SoundManager.muteBackgroundMusic();
            }
            (0, preferences_1.savePreferences)();
            return false;
        });
        $("#mute-all").on("click", () => {
            if (preferences_1.Preferences.muteAll) {
                SoundManager.unmuteAll();
            }
            else {
                SoundManager.muteAll();
            }
            (0, preferences_1.savePreferences)();
            return false;
        });
    }
    static muteAll() {
        preferences_1.Preferences.muteAll = true;
        preferences_1.Preferences.muteBackgroundMusic = true;
        for (let r in resources_1.Resources) {
            let snd = resources_1.Resources[r];
            if (snd instanceof excalibur_1.Sound) {
                snd.volume = 0;
            }
        }
        SoundManager.muteBackgroundMusic();
        SoundManager._updateMuteAllButton();
    }
    static unmuteAll() {
        preferences_1.Preferences.muteAll = false;
        preferences_1.Preferences.muteBackgroundMusic = false;
        for (var r in resources_1.Resources) {
            let snd = resources_1.Resources[r];
            if (snd instanceof excalibur_1.Sound) {
                snd.volume = config_1.default.SoundVolume;
            }
        }
        SoundManager.setSoundSpecificVolume();
        SoundManager.unmuteBackgroundMusic();
        SoundManager._updateMuteAllButton();
    }
    static startBackgroundMusic() {
        // start bg music
    }
    static stopBackgroundMusic() {
        // stop bg music
    }
    static muteBackgroundMusic() {
        preferences_1.Preferences.muteBackgroundMusic = true;
        // mute bg music
        SoundManager._updateMusicButton();
    }
    static unmuteBackgroundMusic() {
        preferences_1.Preferences.muteBackgroundMusic = false;
        // unmute bg music
        SoundManager._updateMusicButton();
    }
    static _updateMusicButton() {
        $("#mute-music i").get(0).className = (0, classnames_1.default)("fa", {
            "fa-music": !preferences_1.Preferences.muteBackgroundMusic,
            "fa-play": preferences_1.Preferences.muteBackgroundMusic,
        });
    }
    static _updateMuteAllButton() {
        $("#mute-all i").get(0).className = (0, classnames_1.default)("fa", {
            "fa-volume-up": !preferences_1.Preferences.muteAll,
            "fa-volume-off": preferences_1.Preferences.muteAll,
        });
    }
}
exports.SoundManager = SoundManager;
