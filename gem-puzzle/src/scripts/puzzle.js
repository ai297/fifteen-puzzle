const EMPTY_PICE_VALUE = 0;

class Puzzle {
    constructor(size) {
        if (size <= 2) throw Error('size should be from 1 to 8');
        if (size > 16) throw Error('max puzzle size is 16');

        const length = size ** 2;
        const field = new Uint8Array(length).map((el, index) => index + 1);
        let emptyPieceIndex = length - 1;
        field[emptyPieceIndex] = EMPTY_PICE_VALUE;

        const isSolvable = () => {
            let N = 0;
            let E = size;
            field.forEach((piece, index) => {
                if (piece !== EMPTY_PICE_VALUE) {
                    N += field.reduce((acc, val, ind) => (val < piece && ind > index && val !== EMPTY_PICE_VALUE) ? ++acc : acc , 0);
                }
                else E = Math.floor(index / size) + 1;
            });
            if (size % 2 === 0) N += E;
            return N % 2 === 0;
        };

        const shuffle = () => {
            do {
                field.sort(() => Math.random() * 2 - 1 );
            } while (!isSolvable());
            emptyPieceIndex = field.indexOf(EMPTY_PICE_VALUE);
        };


        // define public methods
        this.getMovablePieces = () => this.movableIndexes.map((el) => field[el]);

        this.moveIndex = (index) => {
            if (!this.movableIndexes.includes(index)) return -1;

            field[emptyPieceIndex] = field[index];
            field[index] = EMPTY_PICE_VALUE;

            const result = emptyPieceIndex;
            emptyPieceIndex = index;
            return result;
        };

        this.move = (piece) => {
            const pieceIndex = field.indexOf(piece);
            if (!this.movableIndexes.includes(pieceIndex)) return -1;

            const newIndexOfPiece = this.moveIndex(pieceIndex);

            return newIndexOfPiece;
        };

        this.getField = () => Array.from(field);

        this.saveState = () => {
            const state = this.getField().map((val, index) => val << (index % 4) * 8);
            const result = [];
            state.forEach((val, index) => {
                let i = Math.floor(index / 4);
                if (index % 4 === 0) result[i] = 0;
                result[i] += val;
            });
            return result.map(n => n.toString(36)).join('.');
        };

        this.loadState = (state) => {
            const newState = state.split('.').map(n => Number.parseInt(n, 36));
            const stateArray = [];
            newState.forEach((val, index) => {
                for (let i = 0; i < 4; i++) {
                    stateArray[index * 4 + i] = (val & (255 << (i * 8))) >> (i * 8);
                }
            });
            for (let i = 0; i < length; i++) {
                field[i] = stateArray[i];
                if (stateArray[i] === EMPTY_PICE_VALUE) emptyPieceIndex = i;
            }
        };

        this.moveTop = () => this.moveIndex(emptyPieceIndex % size + (Math.floor(emptyPieceIndex / size) - 1) * size);
        this.moveBottom = () => this.moveIndex(emptyPieceIndex % size + (Math.floor(emptyPieceIndex / size) + 1) * size);
        this.moveLeft = () => this.moveIndex(emptyPieceIndex % size - 1 + Math.floor(emptyPieceIndex / size) * size);
        this.moveRight = () => this.moveIndex(emptyPieceIndex % size + 1 + Math.floor(emptyPieceIndex / size) * size);

        Object.defineProperties(this, {
            emptyIndex: {
                get: () => emptyPieceIndex,
            },
            movableIndexes: {
                get: () => {
                    const col = emptyPieceIndex % size;
                    const row = Math.floor(emptyPieceIndex / size);
    
                    return [
                        (col - 1) >= 0 ? col - 1 + row * size : null,
                        (col + 1) < size ? col + 1 + row * size : null,
                        (row - 1) >= 0 ? col + (row - 1) * size : null,
                        (row + 1) < size ? col + (row + 1) * size : null,
                    ].filter((el) => el !== null);
                },
            },
            isComplete: {
                get: () => field.reduce(
                    (acc, val, index, arr) => acc && (index === arr.length - 1
                        ? true : val === index + 1), true,
                ),
            },
            size: {
                get: () => size * 1,
            },
        });

        shuffle();
    }
}

export default Puzzle;
