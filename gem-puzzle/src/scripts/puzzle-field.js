import create from './create';
import PuzzlePiece from './puzzle-piece';
import Settings from './game-settings';

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
        let gameLayerPosition = 0;

        // DOM
        const gameLayer = create('game-layer');
        const fieldElement = create('puzzle-field');
        const fieldFrame = create('puzzle-field__frame');
        gameLayer.append(fieldElement);

        // private fields
        let pieces;
        let movePieceHandler;
        let backImage = Settings.backgroundImage;

        // private methods
        const switch3dStyle = (use3dStyle) => {
            if (use3dStyle) gameLayer.classList.remove('game-layer--flat');
            else gameLayer.classList.add('game-layer--flat');
        };

        const updatePieces = (updater) => {
            if(typeof pieces !== 'object' || typeof updater !== 'function') return;
            for(let p in pieces) {
                updater(pieces[p], p);
            }
        };

        // PUBLIC METHODS
        this.clear = () => {
            pieces = {};
            fieldElement.innerHTML = '';
            fieldElement.classList.remove('active');
            fieldElement.classList.remove('completed');
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
                pieces[piece].onMove = (num) => {
                    if (typeof movePieceHandler === 'function') movePieceHandler(num);
                };
                pieces[piece].setBackgroundMode(Settings.puzzleStyle, backImage);
            });
            movablePieces.forEach((piece) => pieces[piece].canMove = true);
        };

        this.updatePositions = (piecesArray, movablePieces = []) => {
            piecesArray.forEach((piece, index) => {
                pieces[piece].position = index;
                pieces[piece].canMove = false;
            });
            movablePieces.forEach((piece) => pieces[piece].canMove = true);
        };

        this.removeNumbers = () => updatePieces((piece) => piece.showNumber = false);
        this.restoreNumbers = () => updatePieces((piece) => piece.showNumber = true);
        this.updatePuzzleStyle = () =>  updatePieces((piece) => piece.setBackgroundMode(Settings.puzzleStyle, backImage));
        this.updateBackImage = (image) => backImage = image || Settings.backgroundImage;

        this.setState_Active = () => {
            fieldElement.classList.add('active');
            fieldElement.classList.remove('completed');
        };
        this.setState_Default = () => {
            fieldElement.classList.remove('solving');
            fieldElement.classList.remove('active');
            fieldElement.classList.remove('completed');
        };
        this.setState_Completed = () => {
            fieldElement.classList.remove('solving');
            fieldElement.classList.remove('active');
            fieldElement.classList.add('completed');
        };
        this.setState_Solving = () => {
            fieldElement.classList.add('solving');
        };

        this.selectPieces = (...numbers) => updatePieces((piece, pieceValue) => {
            if (numbers.indexOf(pieceValue * 1) < 0) piece.selected = false;
            else piece.selected = true;
        });

        Object.defineProperties(this, {
            element: { value: gameLayer, },
            moveHandler: {
                get: () => movePieceHandler,
                set: (handler) => {
                    if (typeof handler === 'function') movePieceHandler = handler;
                },
            },
            backImage: {
                get: () => backImage,
            },
        });

        gameLayer.addEventListener('wheel', (event) => {
            event.preventDefault();
            gameLayerPosition += event.deltaY;
            if (gameLayerPosition > 300) gameLayerPosition = 300;
            if (gameLayerPosition < - 500) gameLayerPosition = -500;
            gameLayer.style.transform = `translateZ(${gameLayerPosition}px)`;
        });

        Settings.addListener('use3dStyle', switch3dStyle);

        switch3dStyle(Settings.use3dStyle);
    }
}
export default PuzzleField;
