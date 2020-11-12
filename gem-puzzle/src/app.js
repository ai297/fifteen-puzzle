import './style.scss';
import SlidePuzzle from './scripts/game';

window.game = new SlidePuzzle();
const gameElement = document.getElementById('game');
window.game.appendTo(gameElement);
