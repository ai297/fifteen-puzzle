class Solver {
    constructor() {
        this.moveDelay = 500;

        let currentPuzzle;
        let currentField;
        let currentPiece = 1;
        let solved = [];
        let solving = false;
        let finishHandler;
        let rejectHandler;
        let onMoveHandler;
        let moves = 0;

        const move = (index) => {
            if (index !== null && solved.indexOf(index) < 0) return currentPuzzle.moveIndex(index) >= 0;
            return false;
        }

        const fixLastOfRow = (step = 0) => {
            console.log('go to move last piece in row to its place');
            return new Promise((resolve) => {
                const goNext = () => {
                    if (step > 10) {
                        console.log('end of last of row fixing');
                        resolve();
                        return;
                    }
                    switch (step) {
                        case 0:
                        case 2:
                        case 7:
                        case 9:
                            currentPuzzle.moveLeft();
                            break;
                        case 1:
                        case 3:
                        case 8:
                            currentPuzzle.moveTop();
                            break;
                        case 4:
                        case 5:
                            currentPuzzle.moveRight();
                            break;
                        case 6:
                        case 10:
                            currentPuzzle.moveBottom();
                            break;

                    }
                    step++;
                    moves++;
                    onMoveHandler(moves);
                    currentField.updatePositions(currentPuzzle.getField());
                    setTimeout(goNext, this.moveDelay);
                };
                goNext();
            });
        };

        const switchToTop = (step = 0) => {
            console.log('go to switch to top');
            return new Promise((resolve) => {
                const goNext = () => {
                    if (step > 3) {
                        console.log('end switching');
                        resolve();
                        return;
                    }
                    switch(step) {
                        case 0:
                            currentPuzzle.moveLeft();
                            break;
                        case 1:
                        case 2:
                            currentPuzzle.moveTop();
                            break;
                        case 3:
                            currentPuzzle.moveRight();
                            break;
                    }
                    step++;
                    moves++;
                    onMoveHandler(moves);
                    currentField.updatePositions(currentPuzzle.getField());
                    setTimeout(goNext, this.moveDelay);
                };
                goNext();
            });
        };

        const switchToTopRight = (step = 0) => {
            console.log('go to switch to top and right');
            return new Promise((resolve) => {
                const goNext = () => {
                    if (step > 11) {
                        console.log('end switching');
                        resolve();
                        return;
                    }
                    switch(step) {
                        case 0:
                        case 5:
                        case 9:
                            currentPuzzle.moveTop();
                            break;
                        case 1:
                        case 2:
                        case 6:
                            currentPuzzle.moveRight();
                            break;
                        case 3:
                        case 7:
                        case 11:
                            currentPuzzle.moveBottom();
                            break;
                        case 4:
                        case 8:
                        case 10:
                            currentPuzzle.moveLeft();
                            break;
                    }
                    step++;
                    moves++;
                    onMoveHandler(moves);
                    currentField.updatePositions(currentPuzzle.getField());
                    setTimeout(goNext, this.moveDelay);
                };
                goNext();
            });
        };

        const switchUp = (step = 0, end = 10) => {
            console.log('go to switch up');
            return new Promise((resolve) => {
                const goNext = () => {
                    if (step > end) {
                        console.log('end switching');
                        resolve();
                        return;
                    }
                    switch(step) {
                        case 0:
                        case 4:
                        case 9:
                            currentPuzzle.moveTop();
                            break;
                        case 1:
                        case 3:
                        case 8:
                            currentPuzzle.moveRight();
                            break;
                        case 2:
                        case 7:
                            currentPuzzle.moveBottom();
                            break;
                        case 5:
                        case 6:
                        case 10:
                            currentPuzzle.moveLeft();
                            break;
                    }
                    step++;
                    moves++;
                    onMoveHandler(moves);
                    currentField.updatePositions(currentPuzzle.getField());
                    setTimeout(goNext, this.moveDelay);
                };
                goNext();
            });
        };

        const fixLastLine = (step = 0, end = 27) => {
            console.log('go to last line fixing');
            return new Promise((resolve) => {
                const goNext = () => {
                    if (step > end) {
                        console.log('end fixing');
                        resolve();
                        return;
                    }
                    switch(step) {
                        case 0: case 1: case 7: case 8: case 9: case 16: case 17: case 18:
                        case 24: case 25: case 26:
                            currentPuzzle.moveLeft();
                            break;
                        case 2: case 10: case 15: case 23:
                            currentPuzzle.moveTop();
                            break;
                        case 3: case 4: case 5: case 11: case 12: case 14: case 20: case 21:
                        case 22:
                            currentPuzzle.moveRight();
                            break;
                        case 6: case 13: case 19: case 27:
                            currentPuzzle.moveBottom();
                            break;
                    }
                    step++;
                    moves++;
                    onMoveHandler(moves);
                    currentField.updatePositions(currentPuzzle.getField());
                    setTimeout(goNext, this.moveDelay);
                };
                goNext();
            });
        };

        const fixLastPiece = (step = 0, end = 28) => {
            console.log('go to last piece fixing');
            return new Promise((resolve) => {
                const goNext = () => {
                    if (step > end) {
                        console.log('end fixing');
                        resolve();
                        return;
                    }
                    switch(true) {
                        case step < 3: case step >= 8 && step < 11: case step === 16:
                        case step >= 18 && step < 20: case step >= 25 && step < 28:
                            currentPuzzle.moveLeft();
                            break;
                        case step === 3: case step === 11: case step === 17: case step === 24:
                            currentPuzzle.moveTop();
                            break;
                        case step >= 4 && step < 7: case step >= 12 && step < 15:
                        case step >= 21 && step < 24:
                            currentPuzzle.moveRight();
                            break;
                        case step === 7: case step === 15: case step === 20: case step === 28:
                            currentPuzzle.moveBottom();
                            break;
                    }
                    step++;
                    moves++;
                    onMoveHandler(moves);
                    currentField.updatePositions(currentPuzzle.getField());
                    setTimeout(goNext, this.moveDelay);
                };
                goNext();
            });
        };

        const moveToTopRight = (size, step = 0) => {
            console.log('go to switch to top and right with size', size);
            return new Promise((resolve) => {
                const goNext = () => {
                    if (step > size * 6 + 1) {
                        console.log(' ITS A HEEELLLLLLLLLLLL ');
                        console.log('end switching');
                        resolve();
                        return;
                    }
                    switch(true) {
                        case step === 0:
                            currentPuzzle.moveTop();
                            break;
                        case step <= size - 1:
                            currentPuzzle.moveRight();
                            break;
                        case step === size:
                            currentPuzzle.moveBottom();
                            break;
                        case step <= size * 2 - 1:
                            currentPuzzle.moveLeft();
                            break;
                        case step === size * 2:
                            currentPuzzle.moveTop();
                            break;
                        case step <= size * 2 + 2:
                            currentPuzzle.moveRight();
                            break;
                        case step === size * 2 + 3:
                            currentPuzzle.moveBottom();
                            break;
                        case step <= size * 3:
                            currentPuzzle.moveRight();
                            break;
                        case step === size * 3 + 1:
                            currentPuzzle.moveTop();
                            break;
                        case step <= size * 4:
                            currentPuzzle.moveLeft();
                            break;
                        case step === size * 4 + 1:
                            currentPuzzle.moveBottom();
                            break;
                        case step <= size * 5:
                            currentPuzzle.moveRight();
                            break;
                        case step === size * 5 + 1:
                            currentPuzzle.moveTop();
                            break;
                        case step <= size * 6:
                            currentPuzzle.moveLeft();
                            break;
                        case step === size * 6 + 1:
                            currentPuzzle.moveBottom();
                            break;
                    }
                    step++;
                    moves++;
                    onMoveHandler(moves);
                    currentField.updatePositions(currentPuzzle.getField());
                    setTimeout(goNext, this.moveDelay);
                };
                goNext();
            });
        };

        const nextMove = () => {
            if (currentPuzzle.isComplete) {
                finishHandler(moves);
                solving = false;
                return;
            }
            
            let state = currentPuzzle.getField();
            let currentIndex = state.indexOf(currentPiece);
            let isMoved = false;
            console.log('------------');
            if (currentIndex === currentPiece - 1) {
                console.log(`${currentPiece} is solved. Go next`);
                currentPiece++;
                solved.push(currentIndex);
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
            // available moves
            let top = (yE - 1) >= 0 ? xE + (yE - 1) * size : null;
            let bottom = (yE + 1) < size ? xE + (yE + 1) * size : null;
            let left = (xE - 1) >= 0 ? xE - 1 + yE * size : null;
            let right = (xE + 1) < size ? xE + 1 + yE * size : null;
            
            console.log(dXE, dYE);
            if (dY0 > 0 && dX0 > 0) {
                console.log('target should be move to up and left');
                
                if (dXE > 0 && dYE < 0) {
                    console.log('empty is right and top');
                    console.log('try to move left');
                    isMoved = move(left);
                }
                
                else if (dXE <= 0 && dYE < 0) {
                    console.log('empty is left (or current col) and top');
                    console.log('try to move bottom');
                    isMoved = move(bottom);
                }

                else if (xP === size - 1 && dXE === 0 && dYE > 0) {
                    console.log('xP === size - 1 && dXE === 0 && dYE > 0');
                    console.log('try to move left');
                    isMoved = move(left);
                }

                else if (xP === size - 1 && dXE < 0 && dYE > 0) {
                    console.log('xP === size - 1 && dXE < 0 && dYE > 0');
                    console.log('try to move top');
                    isMoved = move(top);
                }

                else if (xP === size - 1 && dXE < 0 && dYE <= 0) {
                    console.log('xP === size - 1 && dXE < 0 && dYE <= 0');
                    console.log('try to move right');
                    isMoved = move(right);
                }
                
                else if (dXE <= 0 && dYE >= 0) {
                    console.log('empty is left (or current col) and bottom (or current row)');
                    console.log('try to move right');
                    isMoved = move(right);
                }
                
                else  if (dXE > 0 && dYE >= 0) {
                    console.log('empty is right and bottom (or current row)');
                    console.log('try to move top');
                    isMoved = move(top);
                }
            }

            else if (dY0 > 0 && dX0 < 0) {
                console.log('target should be move right and up');

                if (dXE > 0 && dYE <= 0) {
                    console.log('empty is right and top (or current row)');
                    console.log('try to move left, else bottom');
                    isMoved = move(left) || move(bottom);
                }

                else if (dXE <= 0 && dYE > 0) {
                    console.log('empty is bottom and left');
                    console.log('try to move right');
                    isMoved = move(right);
                }

                else if (dXE <= 0 && dYE <= 0) {
                    console.log('empty is top (or current row) and left (or current col)');
                    console.log('try to move bottom');
                    isMoved = move(bottom);
                    if (!isMoved && dX0 === -1 && xE !== 0) {
                        switchToTopRight().then(nextMove);
                        return;
                    }
                    else if (!isMoved && dX0 === -1 && xE === 0) {
                        switchUp(0, 7).then(nextMove);
                        return;
                    }
                    else if (!isMoved && dX0 === -2) {
                        fixLastLine().then(nextMove);
                        return;
                    }
                    else if (!isMoved && dX0 < -2 && dXE < 0 && dYE === 0) {
                        moveToTopRight(size).then(nextMove);
                        return;
                    }
                }

                else if (dXE > 0 && dYE > 0) {
                    console.log('empty is bottom and right');
                    console.log('try to move top');
                    isMoved = move(top);
                }
            }

            else if (dY0 === 0 && dX0 > 0) {
                console.log('target should be move left');

                if (dXE >= 0 && dYE > 0) {
                    console.log('empty is bottom and right (or current row)');
                    console.log('try to move left');
                    isMoved = move(left);
                }

                else if (dXE < 0 && dYE > 0) {
                    console.log('empty is bottom and left');
                    console.log('try to move top, else right');
                    isMoved = move(top) || move(right);
                }

                else if (dXE < 0 && dYE >= 0) {
                    console.log('empty is left and top (or current row)');
                    console.log('try to move right');
                    isMoved = move(right);
                }

                else if (dXE > 0 && dYE <= 0) {
                    console.log('empty is top (or current row) and right');
                    console.log('try to move bottom (or left)');
                    isMoved = move(bottom);
                    if (!isMoved && dXE > 1) isMoved = move(left);
                    if (!isMoved && yP === size - 1 && xP === size - 2 && dXE > 0) {
                        fixLastPiece().then(nextMove);
                        return;
                    }
                    else if (!isMoved && yP === size - 1 && xP < size - 2 && dXE === 1) {
                        fixLastLine().then(nextMove);
                        return;
                    }
                }
            }

            else if (dY0 > 0 && dX0 === 0) {
                console.log('target should be move up');

                if (dXE > 0 && dYE >= 0) {
                    console.log('empty is bottom (or current row) and right');
                    console.log('try to move top');
                    isMoved = move(top);
                    // if (!isMoved && yP === size - 1 && dXE === -1) {
                    //     switchToTop(2).then(nextMove);
                    //     return;
                    // }
                }

                else if (xP === size - 1 && dXE < 0 && dYE >= 0 && x0 !== size - 1) {
                    console.log('xP === size - 1 && dXE < 0 && dYE >= 0');
                    console.log('try to move top');
                    isMoved = move(top);
                }
                else if (xP === size -1 && dXE < 0 && dYE < 0) {
                    console.log('xP === size -1 && dXE < 0 && dYE < 0');
                    console.log('try to move right');
                    isMoved = move(right);
                }

                else if (dXE === -1 && dYE === 0 && x0 < size - 1) {
                    switchUp().then(nextMove);
                    return;
                }

                else if (dXE <= 0 && dYE <= 0) {
                    console.log('empty is top (or current row) and left (or current col)');
                    console.log('try to move bottom (or right)');
                    isMoved = move(bottom);

                    if (!isMoved && dYE === 0 && dXE < -1) isMoved = move(right);
                    
                    if (!isMoved && x0 === size - 1 && yP === size - 1 && dYE === 0 && dXE == -1) {
                        fixLastOfRow(2).then(nextMove);
                        return
                    }
                    else if (!isMoved && dY0 > 1 && x0 === size - 1) {
                        switchToTop(2).then(nextMove);
                        return;
                    }
                    else if (!isMoved && x0 !== size - 1 && yP === size - 1) {
                        fixLastLine().then(nextMove);
                        return;
                    }

                }

                else if (dXE > 0 && dYE < 0) {
                    console.log('empty is top and right');
                    console.log('try to move left');
                    isMoved = move(left);
                }

                else if (dXE <= 0 && dYE > 0) {
                    console.log('empty is bottom and left (or current col)');
                    console.log('try to move right');
                    isMoved = move(right);
                    // if current piece is the last piece of row
                    if (!isMoved && dY0 === 1 && x0 === size - 1) {
                        fixLastOfRow().then(nextMove);
                        return;
                    } else if (!isMoved && x0 === size - 1) {
                        switchToTop().then(nextMove);
                        return;
                    }
                }

                else if (dXE === -1 && dYE === 0 && x0 === size - 1) {
                    fixLastOfRow(2).then(nextMove);
                    return;
                }
            }
            else {
                console.log('what direction?');
                //isMoved = move(bottom) || move(right) || move(left) || move(top);
                
            }

            currentField.updatePositions(currentPuzzle.getField());
            if (isMoved) {
                moves++;
                onMoveHandler(moves);
                setTimeout(nextMove, this.moveDelay);
            }
            else {
                rejectHandler(Error('Puzzle did not solve'));
                solving = false;
            }
        };


        this.solveIt = (puzzle, field, onMove) => new Promise((resolve, reject) => {
            if (solving) {
                reject(Error('Previous solving not finished'));
                return;
            }
            currentPuzzle = puzzle;
            currentField = field;
            currentPiece = 1;
            solved = [];
            solving = true;
            moves = 0;
            finishHandler = resolve;
            rejectHandler = reject;
            onMoveHandler = () => {
                if (typeof onMove === 'function') onMove(moves);
            };

            currentField.selectPieces(currentPiece);
            currentField.setState_Solving();

            nextMove();
        });
    }
}
export default Solver;
