import create from './create';
import Slider from './slider';
import SettingsMenu from './settings-menu';
import playSound from './game-sound';

const soundOver = () => playSound('hover');
const soundClick = () => playSound('click');

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
    const newGameButton = create('game-button game-button--red menu-button', 'button');
    const continueButton = create('game-button game-button--priority menu-button', 'button');
    const leaderBoardButton = create('game-button menu-button', 'button');
    const settingsButton = create('game-button menu-button', 'button');
    menuELement.append(newGameButton, continueButton, leaderBoardButton, settingsButton);

    newGameButton.innerHTML = 'New game';
    continueButton.innerHTML = 'Continue';
    leaderBoardButton.innerHTML = 'Best results';
    settingsButton.innerHTML = 'Settings';
    continueButton.setAttribute('disabled', true);

    return {element: menuELement, newGameButton, continueButton, leaderBoardButton, settingsButton};
}
function createGameStats() {
    const gameStatsMenu = create('game-menu');
    const timerSection = create('game-menu__section game-menu__section--rows');
    const movesSection = create('game-menu__section game-menu__section--rows');
    const buttonsSection = create('game-menu__section');

    const playingTime = create('timer-counter');
    const moves = create('moves-counter');

    const pauseButton = create('game-button inline-button', 'button');
    const surrenderButton = create('game-button game-button--red inline-button', 'button');

    timerSection.innerHTML = '<h3 class="game-menu__header">Playing time:</h3>';
    movesSection.innerHTML = '<h3 class="game-menu__header">Moves:</h3>';
    pauseButton.innerHTML = 'Pause';
    surrenderButton.innerHTML = 'Give up';
    timerSection.append(playingTime);
    movesSection.append(moves);
    buttonsSection.append(pauseButton, surrenderButton);
    gameStatsMenu.append(timerSection, movesSection, buttonsSection);
    return { element: gameStatsMenu, time: playingTime, moves, pause: pauseButton, surrender: surrenderButton };
}

class GameUI {
    constructor() {
        const uiLayer = createUILayer();
        uiLayer.header = 'Gem<span>Puzzle</span>';
        const mainMenu = createMainMenu();
        const settingsMenu = new SettingsMenu();
        const statsMenu = createGameStats();

        const menuSlider = new Slider(uiLayer.mainSection);
        menuSlider.addSlide(mainMenu.element, 'main-menu');
        menuSlider.addSlide(settingsMenu.element, 'settings-menu');
        menuSlider.addSlide(statsMenu.element, 'game-stats');

        const setStatsTime = (val) => {
            let sec = val % 60;
            let min = Math.floor(val / 60);
            statsMenu.time.innerHTML = `<span>${min < 10 ? '0' : ''}${min}</span>:<span>${sec < 10 ? '0' : ''}${sec}</span>`;
        }

        const eventListeners = {};

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

        this.addListener = (eventName, handler) => {
            if (typeof handler !== 'function') return;
            if (typeof eventListeners[eventName] === 'undefined') eventListeners[eventName] = [];
            eventListeners[eventName].push(handler);
        };
        this.removeListener = (eventName, handler) => {
            if (typeof eventListeners[eventName] === 'undefined') return;
            let index = eventListeners[eventName].indexOf(handler);
            if (index >= 0) eventListeners[eventName].splice(index, 1);
        };

        Object.defineProperties(this, {
            element: { value: uiLayer.rootElement, },
            gameTime: {
                get: () => statsMenu.time.innerText,
                set: setStatsTime,
            },
            gameMoves: {
                get: () => statsMenu.moves.innerText,
                set: (val) => statsMenu.moves.innerHTML = val,
            },
        });

        // handlers
        const clickHandler = (name) => {
            if (typeof eventListeners[name] === 'undefined') return;
            eventListeners[name].forEach((handler) => handler());
        };

        mainMenu.settingsButton.onclick = () => menuSlider.goTo('settings-menu');
        settingsMenu.onClickBack = () => menuSlider.goTo('main-menu', true);
        mainMenu.newGameButton.onclick = () => clickHandler('new-game');
        mainMenu.continueButton.onclick = () => clickHandler('continue');
        mainMenu.leaderBoardButton.onclick = () => clickHandler('leader-board');
        statsMenu.pause.onclick = () => clickHandler('pause');
        statsMenu.surrender.onclick = () => clickHandler('give-up');

        [mainMenu.newGameButton, mainMenu.continueButton, mainMenu.leaderBoardButton, mainMenu.settingsButton,
        statsMenu.pause, statsMenu.surrender].forEach((button) => {
            button.addEventListener('mouseenter', soundOver);
            button.addEventListener('mousedown', soundClick);
        });
    }
}

export default GameUI;
