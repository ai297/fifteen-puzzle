import create from './create';
import Settings from './game-settings';
import Slider from './slider';

function createPuzzleSizeSelector() {
    const sizeSelector = create('game-menu__section size-selector');
    const prevSize = create('size-selector__nav-button', 'button');
    const nextSize = create('size-selector__nav-button', 'button');
    const sizeSelectorSizes = create('size-selector__sizes');
    prevSize.innerHTML = '◄';
    nextSize.innerHTML = '►';
    
    const sizes = {};
    const sizeSelectorSlider = new Slider(sizeSelectorSizes);
    for (let i = 3; i <= 8; i++) {
        sizes[i] = create('size-selector__selected-size');
        sizes[i].innerHTML  = `${i} × ${i}`;
        sizeSelectorSlider.addSlide(sizes[i], i);
    }
    
    sizeSelector.append(prevSize, sizeSelectorSizes, nextSize);
    prevSize.onclick = () => sizeSelectorSlider.prev().then((size) => Settings.fieldSize = size);
    nextSize.onclick = () => sizeSelectorSlider.next().then((size) => Settings.fieldSize = size);
    sizeSelectorSlider.goTo(Settings.fieldSize);

    return sizeSelector;
}

function createPuzzleStyleSelector() {
    const puzzleStyleSelector = create('game-menu__section');

    const puzzleStyles = [
        { image: 'numbers.png', caption: 'Numbers' },
        { image: 'image-and-numbers.png', caption: 'Numbers with image' },
        { image: 'image-only.png', caption: 'Only random image' },
    ];

    puzzleStyles.forEach((style, index) => {
        const label = create('selectable-button bg-selector', 'label');
        label.innerHTML = `<figure><img src="./assets/${style.image}" alt="${style.caption}"></figure><p>${style.caption}</p>`;
        const input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'puzzle-back-style');
        input.value = index + 1;
        label.prepend(input);
        if (Settings.puzzleStyle == index + 1) input.checked = true;
        input.onchange = () => {
            if (input.checked) Settings.puzzleStyle = input.value;
        };
        puzzleStyleSelector.append(label);
    });

    return puzzleStyleSelector;
}

function createSoundAnd3dSettings() {
    const soundAnd3dSettings = create('game-menu__section game-menu__section--around');

    const soundSettingsSection = document.createElement('div');
    soundSettingsSection.innerHTML = '<h3 class="game-menu__header">Sound:</h3>';
    const soundCheckboxLabel = create('selectable-button check-button', 'label');
    soundCheckboxLabel.innerHTML = '<div class="custom-checkbox"><div>On</div><div>Off</div></div>';
    soundSettingsSection.append(soundCheckboxLabel);
    const soundCheckbox = document.createElement('input');
    soundCheckbox.setAttribute('type', 'checkbox');
    soundCheckboxLabel.prepend(soundCheckbox);

    soundCheckbox.checked = Settings.soundEnabled;
    soundCheckbox.onchange = () => Settings.soundEnabled = soundCheckbox.checked;

    const use3dSettingsSection = document.createElement('div');
    use3dSettingsSection.innerHTML = '<h3 class="game-menu__header">3D effects:</h3>';
    const use3dCheckboxLabel = create('selectable-button check-button', 'label');
    use3dCheckboxLabel.innerHTML = '<div class="custom-checkbox"><div>On</div><div>Off</div></div>';
    use3dSettingsSection.append(use3dCheckboxLabel);
    const use3dCheckbox = document.createElement('input');
    use3dCheckbox.setAttribute('type', 'checkbox');
    use3dCheckboxLabel.prepend(use3dCheckbox);
    use3dCheckbox.checked = Settings.use3dStyle === 'true';
    use3dCheckbox.onchange = () => Settings.use3dStyle = use3dCheckbox.checked;

    soundAnd3dSettings.append(soundSettingsSection, use3dSettingsSection);

    return soundAnd3dSettings;
}

class SettingsMenu {
    constructor() {
        // DOM
        this.element = create('game-menu');
        this.element.innerHTML = '<h3 class="game-menu__header">Puzzle size:</h3>';
        this.element.append(createPuzzleSizeSelector());
        const puzzleStyleSelectorHeader = create('game-menu__header', 'h3');
        puzzleStyleSelectorHeader.innerHTML = 'Puzzle style:';
        this.element.append(puzzleStyleSelectorHeader);
        this.element.append(createPuzzleStyleSelector());
        this.element.append(createSoundAnd3dSettings());
        const backButton = create('game-button confirm-settings', 'button');
        backButton.innerHTML = 'Ok';
        this.element.append(backButton);

        Object.defineProperties(this, {
            onClickBack: {
                get: () => backButton.onclick,
                set: (handler) => backButton.onclick = handler,
            },
        });
    }
}
export default SettingsMenu;
