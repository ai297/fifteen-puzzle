const EMPTY_PICE_VALUE = 0;

class Puzzle {

    constructor(size) {
        if(size <= 1) throw Error("size should be from 1 to 8");
        if(size > 8) throw Error("max puzzle size is 8")

        const length = size ** 2;
        const field = Array.from({ length: length - 1 }, (el, index) => index + 1);
        let emptyPieceIndex = length - 1;

        field.push(EMPTY_PICE_VALUE);

        // define public methods
        this.getMovablePieces = () => this.movableIndexes.map(el => field[el]);

        this.moveIndex = index => {
            if(!this.movableIndexes.includes(index)) return;
            
            field[emptyPieceIndex] = field[index];
            field[index] = EMPTY_PICE_VALUE;
            
            const result = emptyPieceIndex;
            emptyPieceIndex = index;
            return result;
        }

        this.move = piece => {
            const pieceIndex = field.indexOf(piece);
            if(!this.movableIndexes.includes(pieceIndex)) return -1;
            
            const newIndexOfPiece = this.moveIndex(pieceIndex);
            
            return newIndexOfPiece;
        }

        this.getState = () => {
            // 5 numbers from field will be serialized to one number;
            const fieldSecions = Math.ceil(length / 5);
            const result = [];
            for(let i = 0; i < fieldSecions; i++) {
                result.push(
                    field.slice(i * 5, (i + 1) * 5)
                    .reduce((acc, val, ind) => acc | val << (ind * 6), 0)
                );
            }
            return result;
        }

        this.loadState = (stateArray) => {
            if(!Array.isArray(stateArray)) throw Error('stateArray must be array');
            if(stateArray.length != Math.ceil(length / 5)) throw Error('invalid state array');
            
            let currentIndex = 0;
            stateArray.forEach(num => {
                for(let i = 0; i < 5; i++) {
                    field[currentIndex] = ((63 << (i * 6)) & num) >> (i * 6);

                    if(field[currentIndex] === EMPTY_PICE_VALUE)
                        emptyPieceIndex = currentIndex;
                    
                    if(++currentIndex >= length) break;
                }
            })
        }


        Object.defineProperty(this, 'movableIndexes', {
            get: () => {
                const col = emptyPieceIndex % size;
                const row = Math.floor(emptyPieceIndex / size);
            
                return [
                    col - 1 + row * size,
                    col + 1 + row * size,
                    col + (row - 1) * size,
                    col + (row + 1) * size
                ]
                .filter(el => el >= 0 && el < length);
            }
        });
        Object.defineProperty(this, 'isComplete', {
            get: () => field.reduce((acc, val, index, arr) => acc && (index == arr.length - 1 ? true : val == index + 1), true)
        });
    }
}

export default Puzzle;
