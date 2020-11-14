import Settings from './game-settings';
import Puzzle from './puzzle';
import GameField from './game-field';
import GameUI from './game-ui';
import ModalDialog from './modals';

class SlidePuzzle {
    constructor() {
        const gameField = new GameField();
        const gameUI = new GameUI();
        const modalDialog = new ModalDialog();
        let puzzle;
        let timer;
        let gameTime = 0;
        let gameMoves = 0;
        let isPaused = true;

        // private methods
        const createPuzzle = (size) => {
            if (size < 3) size = 3;
            else if (size > 16) size = 16;
            puzzle = new Puzzle(size);
            gameField.newField(puzzle.getField());
        };

        const win = () => {
            isPaused = true;
            clearInterval(timer);
            gameField.updatePositions(puzzle.getField());
            gameField.setState_Completed();

            setTimeout(() => {
                modalDialog.show(`Congratulation! You win!<br>Your time is ${gameTime} seconds and you has ${gameMoves} moves.`, () => {
                    gameTime = 0;
                    gameMoves = 0;
                    gameField.updateBackImage();
                    gameUI.showMainMenu();
                });
            }, 1500);
        };

        // PUBLIC METHODS
        this.appendTo = (el) => {
            if(typeof el !== 'object' || el.style === undefined || typeof el.append !== 'function') return;
            el.style.position = 'relative';

            el.append(gameField.element);
            el.append(gameUI.element);
            //modalDialog.parent = el;
        };

        this.newGame = () => {
            if (gameMoves > 0) {
                modalDialog.show(
                    'Your current game is not complited.<br>Start new game?',
                    () => {
                        gameMoves = 0;
                        this.newGame();
                    },
                    true
                );
                return;
            }
            createPuzzle(Settings.fieldSize);
            gameTime = 0;
            isPaused = false;
            gameField.updatePositions(puzzle.getField(), puzzle.getMovablePieces());
            setTimeout(() => {
                gameField.setState_Active();
                gameUI.showStats();
            }, 0);
            // start game timer
            clearInterval(timer);
            setTimeout(() => {
                timer = setInterval(() => {
                    if(isPaused) return;
                    gameTime++;
                    gameUI.gameTime = gameTime;
                }, 1000);
            }, 500);

            this._changeSizeNotificationShowed = false;
            this._changeBackStyleNotificationShowed = false;
        };

        this.movePiece = (piceNumber) => {
            if (puzzle.move(piceNumber) < 0) return;
            gameMoves++;
            gameUI.gameMoves = gameMoves;
            gameField.updatePositions(puzzle.getField(), puzzle.getMovablePieces()).then(() => {
                if (puzzle.isComplete) win();
            });
        };

        this.pause = () => {
            if (isPaused) return;
            isPaused = true;
            gameUI.showMainMenu(true);
            gameField.updatePositions(puzzle.getField());
        };

        this.continue = () => {
            if (!isPaused) return;
            isPaused = false;
            gameUI.showStats(gameTime, gameMoves);
            gameField.updatePositions(puzzle.getField(), puzzle.getMovablePieces());
        }

        // handlers
        gameUI.newGameHandler = this.newGame;
        gameField.moveHandler = this.movePiece;
        gameUI.pauseHandler = this.pause;
        gameUI.continueGameHandler = this.continue;
        gameUI.changeFieldSizeHandler = (size) => {
            if (isPaused && gameMoves === 0) createPuzzle(size);
            else if (!this._changeSizeNotificationShowed) {
                modalDialog.show('Puzzle size will change for next game.');
                this._changeSizeNotificationShowed = true;
            }
        };
        gameUI.changeBgStyleHandler = () => {
            if (isPaused && gameMoves === 0) gameField.updatePuzzleStyle();
            else if (!this._changeBackStyleNotificationShowed) {
                modalDialog.show('Puzzle style will change for next game.');
                this._changeBackStyleNotificationShowed = true;
            }
        };
        
        createPuzzle(Settings.fieldSize);
    }
}
export default SlidePuzzle;
