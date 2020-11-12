import GameField from './game-field';
import Puzzle from './puzzle';

class SlidePuzzle {
    constructor() {
        const gameField = new GameField();
        let puzzle;

        this.appendTo = (el) => {
            if(typeof el !== 'object' || el.style === undefined || typeof el.append !== 'function') return;
            el.style.position = 'relative';
            el.append(gameField.element);
        };

        // this.startNewGame = (size) => {
        //     if(size < 3 || size > 16) return;
        //     puzzle = new Puzzle(size);
        //     gameField.newField(puzzle.getField(), puzzle.getMovablePieces());
        // };
    }
}
export default SlidePuzzle;
