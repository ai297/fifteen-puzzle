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

class PuzzleField {
    constructor() {
        // DOM
        const gameLayer = create('game-layer');
        const fieldElement = create('puzzle-field');
        const fieldFrame = create('puzzle-field__frame');
        gameLayer.append(fieldElement);

        // private fields
        let pieces;

        // PUBLIC METHODS
        this.clear = () => {
            fieldElement.innerHTML = '';
            fieldElement.classList.remove('active');
            fieldElement.append(fieldFrame);
        };
        
        this.newField = (piecesArray, movablePieces = []) => {
            if(!Array.isArray(piecesArray)) return;
            pieces = {};
            const fieldSize = Math.sqrt(piecesArray.length);

            this.clear();
            createGrid(fieldSize, fieldElement);

            piecesArray.forEach((piece, index) => {
                pieces[piece] = new PuzzlePiece(piece, index, fieldSize);
                fieldElement.prepend(pieces[piece].element);
            });
            movablePieces.forEach((piece) => pieces[piece].canMove = true);
        };

        this.update = (piecesArray, movablePieces = [], delay = 500) => {
            if(!Array.isArray(piecesArray)) return;
            piecesArray.forEach((piece, index) => {
                pieces[piece].position = index;
                pieces[piece].canMove = false;
            });
            setTimeout(() => {
                movablePieces.forEach((piece) => pieces[piece].canMove = true);
            }, delay);
        };

        this.setState_Active = () => {
            fieldElement.classList.add('active');
        };
        this.setState_Default = () => {
            fieldElement.classList.remove('active');
        };

        Object.defineProperty(this, 'element', {
            get: () => gameLayer,
        });
    }
}
export default PuzzleField;
