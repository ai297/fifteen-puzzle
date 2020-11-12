import create from './create';
function createPuzzlePieceElement() {
    const el = create('puzzle-piece');
    el.append(create('puzzle-piece__edge puzzle-piece__edge--left'));
    el.append(create('puzzle-piece__edge puzzle-piece__edge--right'));
    el.append(create('puzzle-piece__edge puzzle-piece__edge--top'));
    el.append(create('puzzle-piece__edge puzzle-piece__edge--bottom'));
    el.append(create('puzzle-piece__side puzzle-piece__side--back'));
    return el;
}

class PuzzlePiece {
    constructor(pieceNumber, positionIndex, fieldSize) {
        const baseSize = Math.floor(1000 / fieldSize) / 10;
        let showNumber = true;
        let canMove = false;

        const element = createPuzzlePieceElement(pieceNumber);
        element.style.width = `${baseSize}%`;
        element.style.height = `${baseSize}%`;
        const front = create('puzzle-piece__side puzzle-piece__side--front');

        if (pieceNumber !== 0) front.innerHTML = `<b>${pieceNumber}</b>`;
        else {
            front.innerHTML = `<b>${fieldSize ** 2}</b>`;
            element.classList.add('puzzle-piece--empty');
        }

        element.prepend(front);

        // public properties
        Object.defineProperty(this, 'element', {
            get: () => element,
        });
        Object.defineProperty(this, 'showNumber', {
            get: () => showNumber,
            set: (val) => {
                if (val) {
                    if(pieceNumber !== 0) front.innerHTML = `<b>${pieceNumber}</b>`;
                    else front.innerHTML = `<b>${fieldSize ** 2}</b>`;
                }
                else front.innerHTML = ` `;
                showNumber = val;
            },
        });
        Object.defineProperty(this, 'canMove', {
            get: () => canMove,
            set: (val) => {
                if (val) element.classList.add('puzzle-piece--can-move');
                else element.classList.remove('puzzle-piece--can-move');
                canMove = val;
            },
        });
        Object.defineProperty(this, 'position', {
            get: () => positionIndex,
            set: (index) => {
                element.style.left = `${baseSize * (index % fieldSize)}%`;
                element.style.top = `${baseSize * Math.floor(index / fieldSize)}%`;
                positionIndex = index;
            },
        });

        this.position = positionIndex;
    }
}
export default PuzzlePiece;
