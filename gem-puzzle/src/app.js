import './style.scss';
import SlidePuzzle from './scripts/game';

window.game = new SlidePuzzle();
window.game.appendTo(document.body);
