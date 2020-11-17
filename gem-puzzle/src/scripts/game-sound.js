import Settings from './game-settings';

const SOUNDS = {
    hover: './assets/sounds/button-hover.mp3',
    click: './assets/sounds/click.wav',
    select: './assets/sounds/select.wav',
    newGame: './assets/sounds/intro.wav',
    popup: './assets/sounds/popup-up.wav',
    move: './assets/sounds/move.wav',
    win: './assets/sounds/victory.mp3',
    solved: './assets/sounds/solved.wav',
    tada: './assets/sounds/tada.mp3',
}

const player = new Audio();
const altPlayer = new Audio();
let interact = false;

function playSound(name, alt = false) {
    if (typeof SOUNDS[name] === 'undefined' || !Settings.soundEnabled) return;
    let p = alt ? altPlayer : player;
    p.src = SOUNDS[name];
    p.load();
    if (interact) p.play();
}

document.addEventListener('click', () => interact = true);

export default playSound;
