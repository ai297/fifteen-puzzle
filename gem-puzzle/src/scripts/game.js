import Settings from './game-settings';
import Puzzle from './puzzle';
import GameField from './game-field';
import GameMenu from './game-menu';
import ModalDialog from './modals';

class SlidePuzzle {
    constructor() {
        const gameField = new GameField();
        const gameMenu = new GameMenu();
        const modalDialog = new ModalDialog();
        let puzzle;
        let timer;
        let gameTime = 0;
        let gameMoves = 0;
        let isPaused = true;

        // private methods
        const createPuzzle = (size) => {
            if (size < 3) siz = 3;
            else if (size > 16) size = 16;
            puzzle = new Puzzle(size);
            gameField.newField(puzzle.getField());
        };

        // PUBLIC METHODS
        this.appendTo = (el) => {
            if(typeof el !== 'object' || el.style === undefined || typeof el.append !== 'function') return;
            el.style.position = 'relative';

            el.append(gameField.element);
            el.append(gameMenu.element);
            modalDialog.parent = el;
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
                gameMenu.showStats();
            }, 0);
            // start game timer
            clearInterval(timer);
            setTimeout(() => {
                timer = setInterval(() => {
                    if(isPaused) return;
                    gameTime++;
                    gameMenu.gameTime = gameTime;
                }, 1000);
            }, 500);
        };

        this.movePiece = (piceNumber) => {
            if (puzzle.move(piceNumber) < 0) return;
            gameMoves++;
            gameMenu.gameMoves = gameMoves;
            gameField.updatePositions(puzzle.getField(), puzzle.getMovablePieces());
        };

        this.pause = () => {
            if (isPaused) return;
            isPaused = true;
            gameMenu.showMainMenu(true);
            gameField.updatePositions(puzzle.getField());
        };

        this.continue = () => {
            if (!isPaused) return;
            isPaused = false;
            gameMenu.showStats(gameTime, gameMoves);
            gameField.updatePositions(puzzle.getField(), puzzle.getMovablePieces());
        }

        // handlers
        gameMenu.newGameHandler = this.newGame;
        gameField.moveHandler = this.movePiece;
        gameMenu.pauseHandler = this.pause;
        gameMenu.continueGameHandler = this.continue;
        
        createPuzzle(Settings.fieldSize);
    }
}
export default SlidePuzzle;
