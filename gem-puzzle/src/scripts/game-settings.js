const DEFAULT_FIELD_SIZE = 'ai297-puzzle_field-size';
const PUZZLE_STYLE = 'ai297-puzzle_background-style';
const SOUND_DISABLED = 'ai297-puzzle_sound-disabled';
const USE_3D_STYLE = 'ai297-puzzle_use-3d-style';
const LAST_IMAGE_USED = 'ai297-puzzle_last-image-used'

class Settings {
    constructor() {
        const listeners = {};

        const propertyChanged = (propertyName, value) => {
            if (typeof listeners[propertyName] === 'undefined') return;
            listeners[propertyName].forEach(listener => listener(value));
        };
        const getRandom = (from, to) => Math.round(Math.random() * (to - from)) + from;

        this.addListener = (propertyName, listener) => {
            if (typeof listener !== 'function') return;
            if (typeof listeners[propertyName] === 'undefined') listeners[propertyName] = [];
            listeners[propertyName].push(listener);
        };

        this.removeListener = (propertyName, listener) => {
            if (typeof listeners[propertyName] === 'undefined') return;
            let index = listeners[propertyName].indexOf(listener);
            if (index >= 0) listeners[propertyName].splice(index, 1);
        };

        Object.defineProperties(this, {
            fieldSize: {
                get: () => localStorage.getItem(DEFAULT_FIELD_SIZE) || 4,
                set: (value) => {
                    if (value === 4) localStorage.removeItem(DEFAULT_FIELD_SIZE);
                    else localStorage.setItem(DEFAULT_FIELD_SIZE, value);
                    propertyChanged('fieldSize', value);
                },
            },
            use3dStyle: {
                get: () =>{
                    let use3d = localStorage.getItem(USE_3D_STYLE);
                    if (use3d === undefined) return true;
                    else return use3d;
                },
                set: (value) => {
                    if (value) localStorage.removeItem(USE_3D_STYLE);
                    else localStorage.setItem(USE_3D_STYLE, value);
                    propertyChanged('use3dStyle', value);
                },
            },
            puzzleStyle: {
                get: () => localStorage.getItem(PUZZLE_STYLE) || 1,
                set: (value) => {
                    if (value === 1) localStorage.removeItem(PUZZLE_STYLE);
                    else localStorage.setItem(PUZZLE_STYLE, value);
                    propertyChanged('puzzleStyle', value);
                },
            },
            soundEnabled: {
                get: () => !localStorage.getItem(SOUND_DISABLED),
                set: (value) => {
                    if (value) localStorage.removeItem(SOUND_DISABLED);
                    else localStorage.setItem(SOUND_DISABLED, true);
                    propertyChanged('soundEnabled', value);
                },
            },
            backgroundImage: {
                get: () => {
                    let lastImageNumber = localStorage.getItem(LAST_IMAGE_USED) || 0;
                    let imageNumber;
                    do {
                        imageNumber = getRandom(1, 60);
                    } while (imageNumber == lastImageNumber);
                    return `./assets/backgrounds/${imageNumber}.jpg`;
                },
            },
        });
    }
}

const APP_SETTINGS = new Settings();

export default APP_SETTINGS;
