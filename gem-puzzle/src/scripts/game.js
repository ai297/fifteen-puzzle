import Settings from './game-settings';
import Puzzle from './puzzle';
import PuzzleField from './puzzle-field';
import GameUI from './game-ui';
import ModalDialog from './modals';

class SlidePuzzle {
    constructor() {
        const puzzleField = new PuzzleField();
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
            puzzleField.newField(puzzle.getField());
        };

        const win = () => {
            isPaused = true;
            clearInterval(timer);
            puzzleField.updatePositions(puzzle.getField());
            puzzleField.setState_Completed();

            const onWin = () => {
                gameTime = 0;
                gameMoves = 0;
                puzzleField.updateBackImage();
                gameUI.showMainMenu();
            };

            setTimeout(() => {
                modalDialog.show(`Congratulation! You win!<br>
                    Your time is ${gameTime} seconds and you has ${gameMoves} moves.`, 'Yo!')
                .finally(onWin);
            }, 1000);
        };

        const showMove = () => {
            gameMoves++;
            gameUI.gameMoves = gameMoves;
            puzzleField.updatePositions(puzzle.getField(), puzzle.getMovablePieces()).then(() => {
                if (puzzle.isComplete) win();
            });
        };

        const changeFieldSize = (size) => {
            if (isPaused && gameMoves === 0) createPuzzle(size);
            else if (!this._changeSizeNotificationShowed) {
                modalDialog.show('Puzzle size will change for next game.');
                this._changeSizeNotificationShowed = true;
            }
        };

        const changeBgStyle = () => {
            if (isPaused && gameMoves === 0) puzzleField.updatePuzzleStyle();
            else if (!this._changeBackStyleNotificationShowed) {
                modalDialog.show('Puzzle style will change for next game.');
                this._changeBackStyleNotificationShowed = true;
            }
        };

        // PUBLIC METHODS
        this.appendTo = (el) => {
            if(typeof el !== 'object' || el.style === undefined || typeof el.append !== 'function') return;
            el.style.position = 'relative';

            el.append(puzzleField.element);
            el.append(gameUI.element);
            this.element = el;
            //modalDialog.parent = el;
        };

        this.newGame = () => {
            if (gameMoves > 0) {
                modalDialog.show('Your current game is not complited.<br>Start new game?', 'Yes', 'No')
                    .then(() => {
                        gameMoves = 0;
                        this.newGame();
                    });
                return;
            }
            createPuzzle(Settings.fieldSize);
            gameTime = 0;
            isPaused = false;
            puzzleField.updatePositions(puzzle.getField(), puzzle.getMovablePieces());
            setTimeout(() => {
                puzzleField.setState_Active();
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
            if (puzzle.move(piceNumber) >= 0) showMove();
        };

        this.pause = () => {
            if (isPaused) return;
            isPaused = true;
            gameUI.showMainMenu(true);
            puzzleField.updatePositions(puzzle.getField());
        };

        this.continue = () => {
            if (!isPaused) return;
            isPaused = false;
            gameUI.showStats(gameTime, gameMoves);
            puzzleField.updatePositions(puzzle.getField(), puzzle.getMovablePieces());
        }

        // handlers
        gameUI.addListener('new-game', this.newGame);
        gameUI.addListener('pause', this.pause);
        gameUI.addListener('continue', this.continue);
        puzzleField.moveHandler = this.movePiece;

        Settings.addListener('fieldSize', changeFieldSize);
        Settings.addListener('puzzleStyle', changeBgStyle);

        document.addEventListener('keydown', (event) => {
            if (isPaused) return;
            switch(event.code) {
                case 'ArrowUp':
                    event.preventDefault();
                    if(puzzle.moveTop() >= 0 ) showMove();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    if(puzzle.moveBottom() >= 0 ) showMove();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    if(puzzle.moveLeft() >= 0 ) showMove();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    if(puzzle.moveRight() >= 0 ) showMove();
                    break;
            }
        });
        
        createPuzzle(Settings.fieldSize);
    }
}
export default SlidePuzzle;
