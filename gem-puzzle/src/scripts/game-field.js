import create from './create';
import PuzzlePiece from './puzzle-piece';

function createGrid(fieldSize, element) {
    const cells = fieldSize ** 2;
    const side = Math.floor(1000 / fieldSize) / 10;
    for(let i = 0; i < cells; i++) {
        const cell = create('puzzle-piece puzzle-piece__frame');
        cell.style.width = `${side}%`;
        cell.style.height = `${side}%`;
        cell.style.top = `${ Math.floor(i / fieldSize) * side }%`;
        cell.style.left = `${ (i % fieldSize) * side }%`;
        element.append(cell);
    }
}

class GameField {
    constructor() {
        // DOM
        const gameLayer = create('game-layer');
        const fieldElement = create('puzzle-field');
        const fieldFrame = create('puzzle-field__frame');
        gameLayer.append(fieldElement);

        // private fields
        let pieces;
        // private methods
        const updatePieces = (updater) => {
            if(typeof pieces !== 'object' || typeof updater !== 'function') return;
            for(let p in pieces) {
                updater(pieces[p]);
            }
        };

        // PUBLIC METHODS
        this.clear = () => {
            pieces = {};
            fieldElement.innerHTML = '';
            fieldElement.classList.remove('active');
            fieldElement.append(fieldFrame);
        };
        
        this.newField = (piecesArray, movablePieces = []) => {
            if(!Array.isArray(piecesArray)) return;

            const fieldSize = Math.sqrt(piecesArray.length);
            this.clear();
            createGrid(fieldSize, fieldElement);

            piecesArray.forEach((piece, index) => {
                pieces[piece] = new PuzzlePiece(piece, index, fieldSize);
                fieldElement.prepend(pieces[piece].element);
            });
            movablePieces.forEach((piece) => pieces[piece].canMove = true);
        };

        this.updatePositions = (piecesArray, movablePieces = [], delay = 500) => {
            return new Promise((resolve, reject) => {
                if (!Array.isArray(piecesArray) || typeof pieces !== 'object') {
                    reject(Error('Invalid arguments or field is empty.'));
                }
                piecesArray.forEach((piece, index) => {
                    pieces[piece].position = index;
                    pieces[piece].canMove = false;
                });
                setTimeout(() => {
                    movablePieces.forEach((piece) => pieces[piece].canMove = true);
                    resolve();
                }, delay);
            });
        };

        this.removeNumbers = () => updatePieces((piece) => piece.showNumber = false);
        this.restoreNumbers = () => updatePieces((piece) => piece.showNumber = true);

        this.setState_Active = () => {
            fieldElement.classList.add('active');
        };
        this.setState_Default = () => {
            fieldElement.classList.remove('active');
        };

        Object.defineProperties(this, {
            element: { value: gameLayer, },
        });
    }
}
export default GameField;
