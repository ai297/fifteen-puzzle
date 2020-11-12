import Settings from './game-settings';
import Puzzle from './puzzle';
import GameField from './game-field';
import GameMenu from './game-menu';

class SlidePuzzle {
    constructor() {
        const gameField = new GameField();
        const gameMenu = new GameMenu();
        let puzzle;

        // private methods
        const createPuzzle = (size) => {
            if (size < 3) siz = 3;
            else if (size > 16) size = 16;
            puzzle = new Puzzle(size);
            gameField.newField(puzzle.getField());
        };

        // PUBLIC METHODS
        this.appendTo = (el) => {
            if(typeof el !== 'object' || el.style === undefined || typeof el.append !== 'function') return;
            el.style.position = 'relative';

            el.append(gameField.element);
            el.append(gameMenu.element);
        };

        // init
        createPuzzle(Settings.fieldSize);
    }
}
export default SlidePuzzle;
