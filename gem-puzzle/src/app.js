import './style.scss';
import SlidePuzzle from './scripts/game';
import Puzzle from './scripts/puzzle';

const game = new SlidePuzzle(document.body);
window.game = game;
window.puzzle = new Puzzle(3);
