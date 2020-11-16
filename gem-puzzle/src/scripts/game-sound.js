import Settings from './game-settings';

const SOUNDS = {
    hover: './assets/sounds/button-hover.mp3',
    click: './assets/sounds/click.wav',
    select: './assets/sounds/select.wav',
    newGame: './assets/sounds/intro.wav',
    popup: './assets/sounds/popup-up.wav',
    move: './assets/sounds/move.wav',
    win: './assets/sounds/victory.mp3',
}
const ALTs = {};

let player;

function playSound(name, alternate = false) {
    if (typeof SOUNDS[name] === 'undefined' || !Settings.soundEnabled) return;
    if (alternate && ALTs[name] === undefined) ALTs[name] = new Audio();
    if (player === undefined) player = new Audio();
    let p = alternate ? ALTs[name] : player;
    p.src = SOUNDS[name];
    p.load();
    p.play();
}
export default playSound;
