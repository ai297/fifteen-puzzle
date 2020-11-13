import create from './create';
import Slider from './slider';

function createUILayer() {
    const header = create('ui-layer__header', 'h1');
    const uiLayer = create('ui-layer');
    const mainSection = create('ui-layer__main');
    const copy = create('ui-layer__copyright');
    copy.innerHTML = 'Kris Casper, <a href="https://github.com/ai297" target="_blank">github.com/ai297</a><br><a href="https://rs.school" target="_blank">RSSchool</a> 2020Q3';

    uiLayer.append(header);
    uiLayer.append(mainSection);
    uiLayer.append(copy);
    const result = {};
    Object.defineProperties(result, {
        rootElement: { value: uiLayer, },
        header: {
            get: () => header.innerHTML,
            set: (val) => header.innerHTML = val,
        },
        mainSection: { value: mainSection, },
    });
    return result;
}
function createMainMenu() {
    const menuELement = create('game-menu');
    const newGameButton = create('game-button game-button--red', 'button');
    const continueButton = create('game-button game-button--priority', 'button');
    const leaderBoardButton = create('game-button', 'button');
    const settingsButton = create('game-button', 'button');
    menuELement.append(newGameButton, continueButton, leaderBoardButton, settingsButton);

    newGameButton.innerHTML = 'New game';
    continueButton.innerHTML = 'Continue';
    leaderBoardButton.innerHTML = 'Best results';
    settingsButton.innerHTML = 'Settings';
    continueButton.setAttribute('disabled', true);

    return {element: menuELement, newGameButton, continueButton, leaderBoardButton, settingsButton};
}

function createSettingsMenu() {
    const settingsMenu = create('game-menu');
    settingsMenu.innerHTML = 'settings';
    return settingsMenu;
}

function createGameStats() {
    const gameStatsMenu = create('game-menu');
    const timerSection = create('stat-section');
    const movesSection = create('stat-section');
    const buttonsSection = create('stat-section stat-section--buttons');

    const playingTime = create('stat-section__time');
    const moves = create('stat-section__moves');

    const pauseButton = create('game-button', 'button');
    const surrenderButton = create('game-button game-button--red', 'button');

    timerSection.innerHTML = '<h3 class="stat-section__header">Playing time:</h3>';
    movesSection.innerHTML = '<h3 class="stat-section__header">Moves:</h3>';
    pauseButton.innerHTML = 'Pause';
    surrenderButton.innerHTML = 'Surrender';
    timerSection.append(playingTime);
    movesSection.append(moves);
    buttonsSection.append(pauseButton, surrenderButton);
    gameStatsMenu.append(timerSection, movesSection, buttonsSection);
    return { element: gameStatsMenu, time: playingTime, moves, pause: pauseButton, surrender: surrenderButton };
}

class GameMenu {
    constructor() {
        const uiLayer = createUILayer();
        uiLayer.header = 'Gem<span>Puzzle</span>';
        const mainMenu = createMainMenu();
        const settingsMenu = createSettingsMenu();
        const statsMenu = createGameStats();

        const menuSlider = new Slider(uiLayer.mainSection);
        menuSlider.addSlide(mainMenu.element, 'main-menu');
        menuSlider.addSlide(settingsMenu, 'settings-menu');
        menuSlider.addSlide(statsMenu.element, 'game-stats');

        mainMenu.settingsButton.onclick = () => menuSlider.goTo('settings-menu');

        const setStatsTime = (val) => {
            let sec = val % 60;
            let min = Math.floor(val / 60) % 60;
            let hrs = Math.floor(val / ( 3600 ));
            statsMenu.time.innerHTML = `<span>${hrs}</span>:<span>${min < 10 ? '0' : ''}${min}</span>:<span>${sec < 10 ? '0' : ''}${sec}</span>`;
        }
        // public methods and properties
        this.showMainMenu = (anableContinueButton = false) => {
            if (anableContinueButton) mainMenu.continueButton.removeAttribute('disabled');
            else mainMenu.continueButton.setAttribute('disabled', true);
            menuSlider.goTo('main-menu');
        };
        this.showStats = (time = 0, moves = 0) => {
            setStatsTime(time);
            statsMenu.moves.innerHTML = moves;
            menuSlider.goTo('game-stats', true);
        };

        Object.defineProperties(this, {
            element: { value: uiLayer.rootElement, },
            newGameHandler: {
                get: () => mainMenu.newGameButton.onclick,
                set: (handler) => {
                    if (typeof handler === 'function') mainMenu.newGameButton.onclick = handler;
                },
            },
            continueGameHandler: {
                get: () => mainMenu.continueButton.onclick,
                set: (handler) => {
                    if (typeof handler === 'function') mainMenu.continueButton.onclick = handler;
                },
            },
            leaderBoardHandler: {
                get: () => mainMenu.leaderBoardButton.onclick,
                set: (handler) => {
                    if(typeof handler === 'function') mainMenu.leaderBoardButton.onclick = handler;
                },
            },
            pauseHandler: {
                get: () => statsMenu.pause.onclick,
                set: (handler) => {
                    if (typeof handler === 'function') statsMenu.pause.onclick = handler;
                },
            },
            surrenderHandler: {
                get: () => statsMenu.surrender.onclick,
                set: (handler) => {
                    if (typeof handler === 'function') statsMenu.surrender.onclick = handler;
                },
            },
            gameTime: {
                set: setStatsTime,
            },
            gameMoves: {
                set: (val) => statsMenu.moves.innerHTML = val,
            },
        });
    }
}

export default GameMenu;
