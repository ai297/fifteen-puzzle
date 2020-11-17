import './style.scss';
import SlidePuzzle from './scripts/game';

const game = new SlidePuzzle();
const gameElement = document.getElementById('game');
game.appendTo(gameElement);