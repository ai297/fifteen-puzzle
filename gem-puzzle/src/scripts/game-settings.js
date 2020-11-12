const DEFAULT_FIELD_SIZE = 'a297-puzzle_field-size';
const USE_3D_STYLE = 'a297-puzzle_use-3d-style';

const Settings = {};
Object.defineProperties(Settings, {
    fieldSize: {
        get: () => localStorage.getItem(DEFAULT_FIELD_SIZE) | 4,
        set: (value) => {
            if (value === 4) localStorage.removeItem(DEFAULT_FIELD_SIZE);
            else localStorage.setItem(DEFAULT_FIELD_SIZE, value);
        },
    },
    use3dStyle: {
        get: () => localStorage.getItem(USE_3D_STYLE) | true,
        set: (value) => {
            if (value) localStorage.removeItem(USE_3D_STYLE);
            else localStorage.setItem(USE_3D_STYLE, value);
        },
    },
});

export default Settings;
