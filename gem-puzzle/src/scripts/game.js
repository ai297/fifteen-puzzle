import Settings from './game-settings';
import Puzzle from './puzzle';
import Solver from './puzzle-solver';
import PuzzleField from './puzzle-field';
import GameUI from './game-ui';
import ModalDialog from './modals';
import Score from './game-score';

const SAVE_GAME_KEY = 'ai297-puzzle_saved-game';

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
        let isFieldReady = false;

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
            localStorage.removeItem(SAVE_GAME_KEY);

            const gameScore = Score.calculateScore(puzzle.size, gameTime, gameMoves);

            const onWin = () => {
                gameMoves = 0;
                gameTime = 0;
                puzzleField.updateBackImage();
                gameUI.showMainMenu();
            };

            setTimeout(() => {
                modalDialog.show(`Congratulation! You win and got ${gameScore} points!<br>
                    Your time is ${gameUI.gameTime} and you has ${gameMoves} moves.`, 'Yo!')
                .finally(onWin);
            }, 1000);
        };

        const showMove = () => {
            gameUI.gameMoves = gameMoves;
            puzzleField.updatePositions(puzzle.getField(), puzzle.getMovablePieces());
            if (puzzle.isComplete) win();
        };

        const startTimer = () => setInterval(() => {
            if(isPaused) return;
            gameTime++;
            gameUI.gameTime = gameTime;
        }, 1000);

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
                        isFieldReady = false;
                        this.newGame();
                    });
                return;
            }
            if (!isFieldReady) {
                createPuzzle(Settings.fieldSize);
                puzzleField.updateBackImage();
                puzzleField.updatePuzzleStyle();
                isFieldReady = true;
            }
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
                timer = startTimer();
            }, 500);

            this._changeSizeNotificationShowed = false;
            this._changeBackStyleNotificationShowed = false;
        };

        this.save = () => {
            if (gameMoves === 0) return;
            const state = [puzzle.size, puzzle.saveState(), gameMoves, gameTime, puzzleField.backImage];
            const saveString = btoa(JSON.stringify(state));
            localStorage.setItem(SAVE_GAME_KEY, saveString);
            console.log('state saved');
        };

        this.load = () => {
            const saveString = localStorage.getItem(SAVE_GAME_KEY);
            if(saveString === undefined) return;
            const state = JSON.parse(atob(saveString));
            puzzle = new Puzzle(state[0]);
            puzzle.loadState(state[1]);
            gameMoves = state[2];
            gameTime = state[3];
            puzzleField.newField(puzzle.getField());
            puzzleField.updateBackImage(state[4]);
            puzzleField.updatePuzzleStyle();
            puzzleField.setState_Active();
            showMove();
            timer = startTimer();
            isPaused = true;
            isFieldReady = true;
        };

        this.movePiece = (piceNumber) => {
            if (puzzle.move(piceNumber) < 0) return;
            gameMoves++;
            showMove();
        };

        this.pause = () => {
            if (isPaused) return;
            if (gameMoves === 0) isFieldReady = false;
            this.save();
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

        this.solve = () => {
            if (isPaused || typeof puzzle === 'undefined') return;
            if (puzzle.isComplete) return;

            if (typeof this.solver === 'undefined') this.solver = new Solver();

            this.solver.solveIt(puzzle, puzzleField, (moves) => {
                gameUI.gameMoves = gameMoves + moves;
            }).then((moves) => {
                console.log(`Puzzle complete with ${gameMoves + moves} moves. Time: ${gameTime}`);
                console.log(`Solver take ${Score.calculateScore(puzzle.size, gameTime, moves)}`);
                puzzleField.setState_Completed();
                gameUI.showMainMenu();
                localStorage.removeItem(SAVE_GAME_KEY);
                isFieldReady = false;
            })
            .catch((e) => {
                alert(e);
                puzzleField.setState_Active();
                gameUI.showMainMenu(true);
            })
            .finally(() => {
                isPaused = true;
            });
        };

        // handlers
        gameUI.addListener('new-game', this.newGame);
        gameUI.addListener('pause', this.pause);
        gameUI.addListener('continue', this.continue);
        gameUI.addListener('give-up', this.solve);
        puzzleField.moveHandler = this.movePiece;

        Settings.addListener('fieldSize', changeFieldSize);
        Settings.addListener('puzzleStyle', changeBgStyle);

        document.addEventListener('keydown', (event) => {
            if (isPaused) return;
            event.preventDefault();
            switch(event.code) {
                case 'ArrowUp':
                    if(puzzle.moveTop() < 0 ) return;
                    gameMoves++;
                    showMove();
                    break;
                case 'ArrowDown':
                    if(puzzle.moveBottom() < 0 ) return;
                    gameMoves++;
                    showMove();
                    break;
                case 'ArrowLeft':
                    if(puzzle.moveLeft() < 0 ) return;
                    gameMoves++;
                    showMove();
                    break;
                case 'ArrowRight':
                    if(puzzle.moveRight() < 0 ) return;
                    gameMoves++;
                    showMove();
                    break;
            }
        });
        
        if (localStorage.getItem(SAVE_GAME_KEY) !== null) {
            this.load();
            gameUI.showMainMenu(true);
        } else {
            createPuzzle(Settings.fieldSize);
            gameUI.showMainMenu();
            isFieldReady = true;
        }

        // auto-saving
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'hidden') this.pause();
        });
        window.addEventListener("unload", this.save);
    }
}
export default SlidePuzzle;
