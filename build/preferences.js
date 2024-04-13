"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPreferences = exports.savePreferences = exports.resetPreferences = exports.Preferences = void 0;
const store_1 = __importDefault(require("store"));
exports.Preferences = {
    muteBackgroundMusic: false,
    muteAll: false,
};
let _origPreferences = { ...exports.Preferences };
function resetPreferences() {
    exports.Preferences = { ..._origPreferences };
}
exports.resetPreferences = resetPreferences;
function savePreferences() {
    store_1.default.set("pref", exports.Preferences);
}
exports.savePreferences = savePreferences;
function loadPreferences() {
    // overwrite but allow new properties
    exports.Preferences = { ...exports.Preferences, ...store_1.default.get("pref") };
}
exports.loadPreferences = loadPreferences;
