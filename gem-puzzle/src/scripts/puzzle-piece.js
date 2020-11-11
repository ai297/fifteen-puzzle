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
        front.innerHTML = `<b>${pieceNumber}</b>`;
        element.prepend(front);

        // public methods
        this.setPosition = (index) => {
            element.style.left = `${baseSize * (index % fieldSize)}%`;
            element.style.top = `${baseSize * Math.floor(index / fieldSize)}%`;
        };

        // public properties
        Object.defineProperty(this, 'element', {
            get: () => element,
        });
        Object.defineProperty(this, 'showNumber', {
            get: () => showNumber,
            set: (val) => {
                if (val) front.innerHTML = `<b>${pieceNumber}</b>`;
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

        this.setPosition(positionIndex);
    }
}
export default PuzzlePiece;
