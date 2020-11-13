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
        let onMoveHandler = (num) => console.log('move', num);

        const element = createPuzzlePieceElement(pieceNumber);
        element.style.width = `${baseSize}%`;
        element.style.height = `${baseSize}%`;
        const front = create('puzzle-piece__side puzzle-piece__side--front');
        if (pieceNumber === 0) element.classList.add('puzzle-piece--empty');
        element.prepend(front);

        element.addEventListener('mouseup', (evt) => {
            evt.preventDefault();
            if (!canMove) return;
            onMoveHandler(pieceNumber);
        });

        // public properties
        Object.defineProperties(this, {
            element: {
                value: element,
            },
            showNumber: {
                get: () => showNumber,
                set: (val) => {
                    if (val) {
                        if (pieceNumber !== 0) front.innerHTML = `<span>${pieceNumber}</span>`;
                        else front.innerHTML = `<span>${fieldSize ** 2}</span>`;
                    }
                    else front.innerHTML = ` `;
                    showNumber = val;
                },
            },
            canMove: {
                get: () => canMove,
                set: (val) => {
                    element.dataset.canMove = val;
                    canMove = val;
                },
            },
            position: {
                get: () => positionIndex,
                set: (index) => {
                    element.style.left = `${baseSize * (index % fieldSize)}%`;
                    element.style.top = `${baseSize * Math.floor(index / fieldSize)}%`;
                    positionIndex = index;
                    if (index === pieceNumber - 1) element.classList.add('puzzle-piece--completed');
                    else element.classList.remove('puzzle-piece--completed');
                },
            },
            onMove: {
                get: () => onMoveHandler,
                set: (handler) => {
                    if (typeof handler === 'function') onMoveHandler = handler;
                },
            },
        });

        this.position = positionIndex;
        this.showNumber = true;
    }
}
export default PuzzlePiece;
