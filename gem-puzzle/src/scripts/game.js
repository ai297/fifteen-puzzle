import PuzzleField from './puzzle-field';
import Puzzle from './puzzle';

class SlidePuzzle {
    constructor() {
        this._puzzleField = new PuzzleField();
        this._currentPuzzle;

        this.appendTo = (el) => {
            el.style.position = 'relative';
            el.append(this._puzzleField.element);
        };

        this.startNewGame = (size) => {
            this._currentPuzzle = new Puzzle(size);
            this._puzzleField.newField(this._currentPuzzle.getField(), this._currentPuzzle.getMovablePieces());
        };
    }
}
export default SlidePuzzle;
