import Settings from './game-settings';
import Puzzle from './puzzle';
import Solver from './puzzle-solver';
import PuzzleField from './puzzle-field';
import GameUI from './game-ui';
import ModalDialog from './modals';
import Score from './game-score';
import playSound from './game-sound';
import victory from './victory-ui';
import getScoreTable from './score-ui';

const SAVE_GAME_KEY = 'ai297-puzzle_saved-game';

const getUssername = `
<h3>Your result is one of the best!</h3>
<p>What is your name?</p>
<input type="text" class="get-name" id="username" placeholder="Anonymous">
`;

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

        const showScore = () => {
            this.pause();
            modalDialog.show(getScoreTable(Score.score));
            playSound('popup');
        };

        const win = () => {
            isPaused = true;
            clearInterval(timer);
            puzzleField.updatePositions(puzzle.getField());
            puzzleField.setState_Completed();
            localStorage.removeItem(SAVE_GAME_KEY);

            const gameScore = Score.calculateScore(puzzle.size, gameTime, gameMoves);
            isFieldReady = false;

            const onWin = () => {
                gameMoves = 0;
                gameTime = 0;
                puzzleField.updateBackImage();
                gameUI.showMainMenu();
                if (gameScore > Score.minPointsInScore) {
                    playSound('tada', true);
                    modalDialog.show(getUssername).finally(() => {
                        let input = document.getElementById('username').value;
                        input = input || 'Anonymous';
                        Score.addToScore(puzzle.size, gameScore, input);
                        console.log(Score.score);
                    }).finally(showScore);
                }
            };

            setTimeout(() => {
                playSound('win');
                modalDialog.show(victory(gameScore, gameUI.gameTime, gameMoves))
                .finally(onWin);
            }, 500);
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
                playSound('popup');
                modalDialog.show('Puzzle size will change for next game.');
                this._changeSizeNotificationShowed = true;
            }
        };
        const changeBgStyle = () => {
            if (isPaused && gameMoves === 0) puzzleField.updatePuzzleStyle();
            else if (!this._changeBackStyleNotificationShowed) {
                playSound('popup');
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
                playSound('popup');
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
            playSound('newGame', true);
        };

        this.pause = () => {
            if (isPaused) return;
            if (gameMoves === 0) isFieldReady = false;
            this.save();
            isPaused = true;
            gameUI.showMainMenu(true);
            puzzleField.updatePositions(puzzle.getField());
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
            timer = startTimer();
            isFieldReady = true;
            puzzleField.setState_Active();
            this.pause();
        };

        this.movePiece = (piceNumber) => {
            if (puzzle.move(piceNumber) < 0) return;
            gameMoves++;
            showMove();
            playSound('move');
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
                playSound('move');
            }).then((moves) => {
                console.log(`Puzzle complete with ${gameMoves + moves} moves. Time: ${gameTime}`);
                console.log(`Solver take ${Score.calculateScore(puzzle.size, gameTime, moves)}`);
                puzzleField.setState_Completed();
                gameUI.showMainMenu();
                localStorage.removeItem(SAVE_GAME_KEY);
                isFieldReady = false;
                playSound('solved', true);
            })
            .catch((e) => {
                modalDialog.show(`<p>Привет! мой алгоритм автоматического решения - это сплошной костыль,
                                    написанный из головы на тыщще иф-элсов.</p>
                                    <p>Ну в общем он не совсем хорошо справляется, особенно с полями 6 на 6 и больше. Кажется,
                                    сейчас как раз он не смог найти решение, хоть и очень старался. Но если после этого сообщения
                                    нажать на Continue, то можно дорешать вручную))</p>`);
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
        gameUI.addListener('leader-board', showScore);

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
