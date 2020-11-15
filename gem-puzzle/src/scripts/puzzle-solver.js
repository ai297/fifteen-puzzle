class Solver {
    constructor() {
        let currentPuzzle;
        let currentField;
        let currentPiece = 1;
        let selectedPieces = [];
        let solving = false;
        let finishHandler;
        let rejectHandler;

        const nextMove = () => {
            if (currentPuzzle.isComplete) {
                finishHandler();
                solving = false;
                return;
            }
            
            let state = currentPuzzle.getField();
            let currentIndex = state.indexOf(currentPiece);
            let isMoved = false;
            
            if (currentIndex === currentPiece - 1) {
                currentPiece++;
                currentField.selectPieces(currentPiece);
                setTimeout(nextMove, 100);
                return;
            }
            // get coords.
            // x0, y0 - coords of end point for current piece
            // xP, yP - coords of current piece
            // xE, yE - coords of empty piece
            let size = currentPuzzle.size;
            let x0 = (currentPiece - 1) % size;
            let y0 = Math.floor((currentPiece - 1) / size);
            let xP = currentIndex % size;
            let yP = Math.floor(currentIndex / size);
            let xE = currentPuzzle.emptyIndex % size;
            let yE = Math.floor(currentPuzzle.emptyIndex / size);
            // get delta
            let dX0 = xP - x0;
            let dY0 = yP - y0;
            let dXE = xE - xP;
            let dYE = yE - yP;
            
            if (dX0 > 0 && dY0 === 0) {
                if (dYE <= 0 && dXE > 0) currentPuzzle.moveBottom();
                else if (dYE > 0 && dXE >= 0) currentPuzzle.moveLeft();
                else if (dYE > 0 && dXE < 0) currentPuzzle.moveTop();
                else currentPuzzle.moveRight();
                isMoved = true;
            }
            else if (dX0 === 0 && dY0 > 0) {
                if (dYE <= 0 && dXE <= 0 ) currentPuzzle.moveBottom();
                else if (dYE > 0 && dXE <= 0) currentPuzzle.moveRight();
                else if (dYE >= 0 && dXE > 0) currentPuzzle.moveTop();
                else currentPuzzle.moveLeft();
                isMoved = true;
            }
            else {
                if (dXE > 0 && dYE < 0) isMoved = currentPuzzle.moveLeft() >= 0;
                else if (dXE <= 0 && dYE < 0) isMoved = currentPuzzle.moveBottom() >= 0;
                else if (dXE <= 0 && dYE >= 0) isMoved = currentPuzzle.moveRight() >= 0;
                else  isMoved = currentPuzzle.moveTop() >= 0;
            }

            currentField.updatePositions(currentPuzzle.getField());
            if (isMoved) setTimeout(nextMove, 300);
            else rejectHandler(Error('Puzzle did not solve'));
        };


        this.solveIt = (puzzle, field) => new Promise((resolve, reject) => {
            if (solving) {
                reject(Error('Previous solving not finished'));
                return;
            }
            currentPuzzle = puzzle;
            currentField = field;
            currentPiece = 1;
            selectedPieces = [];
            solving = true;
            finishHandler = resolve;
            rejectHandler = reject;

            currentField.selectPieces(currentPiece);
            currentField.setState_Solving();

            nextMove();
        });
    }
}
export default Solver;
