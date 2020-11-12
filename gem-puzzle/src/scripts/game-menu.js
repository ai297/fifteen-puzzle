import create from './create';
import Slider from './slider';

function createUILayer() {
    const header = create('ui-layer__header', 'h1');
    const uiLayer = create('ui-layer');
    const mainSection = create('ui-layer__main');
    const copy = create('ui-layer__copyright');
    copy.innerHTML = 'Aleksey Igumnov, <a href="https://github.com/ai297" target="_blank">github.com/ai297</a><br><a href="https://rs.school" target="_blank">RSSchool</a> 2020Q3';

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
    const newGameBuuton = create('game-button game-button--priority', 'button');
    const continueButton = create('game-button', 'button');
    const leaderBoardButtons = create('game-button', 'button');
    const settingsButton = create('game-button', 'button');
    menuELement.append(newGameBuuton, continueButton, leaderBoardButtons, settingsButton);

    newGameBuuton.innerHTML = 'New game';
    continueButton.innerHTML = 'Continue';
    leaderBoardButtons.innerHTML = 'Best results';
    settingsButton.innerHTML = 'Settings';
    continueButton.setAttribute('disabled', true);
    newGameBuuton.addEventListener('click', () => menuELement.dispatchEvent(new CustomEvent('main-menu', { detail: 'new-game', })));
    continueButton.addEventListener('click', () => menuELement.dispatchEvent(new CustomEvent('main-menu', { detail: 'continue', })));
    settingsButton.addEventListener('click', () => menuELement.dispatchEvent(new CustomEvent('main-menu', { detail: 'settings', })));
    leaderBoardButtons.addEventListener('click', () => menuELement.dispatchEvent(new CustomEvent('main-menu', { detail: 'leader-board', })));

    return menuELement;
}

function createSettingsMenu() {
    const settingsMenu = create('game-menu');
    settingsMenu.innerHTML = 'settings';
    return settingsMenu;
}

class GameMenu {
    constructor() {
        const uiLayer = createUILayer();
        uiLayer.header = 'Gem<span>Puzzle</span>';
        const mainMenu = createMainMenu();
        const settingsMenu = createSettingsMenu();

        const menuSlider = new Slider(uiLayer.mainSection);
        menuSlider.addSlide(mainMenu, 'main-menu');
        menuSlider.addSlide(settingsMenu, 'settings-menu');

        mainMenu.addEventListener('main-menu', (event) => {
            switch(event.detail) {
                case 'settings':
                    menuSlider.goTo('settings-menu');
                    return;
                case 'new-game':
                    if (typeof this._ngHandler === 'function') this._ngHandler();
                    return;
                case 'continue':
                    if (typeof this._cgHandler === 'function') this._cgHandler();
                    return;
                case 'leader-board':
                    if (typeof this._lbHandler === 'function') this._lbHandler();
                    return;
            }
        });

        Object.defineProperties(this, {
            element: { value: uiLayer.rootElement, },
            newGameHandler: {
                get: () => this._ngHandler,
                set: (handler) => {
                    if (typeof handler === 'function') this._ngHandler = handler;
                },
            },
            continueGameHandler: {
                get: () => this._cgHandler,
                set: (handler) => {
                    if (typeof handler === 'function') this._cgHandler = handler;
                },
            },
            leaderBoardHandler: {
                get: () => this._lbHandler,
                set: (handler) => {
                    if(typeof handler === 'function') this._lbHandler = handler;
                },
            },
        });
    }
}

export default GameMenu;
