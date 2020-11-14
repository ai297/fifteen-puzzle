import create from './create';

class ModalDialog {
    constructor(parent) {
        parent = parent || document.body;
        this.element = create('game-modal');
        const wrapper = create('game-modal__wrapper');
        const textElement = create('game-modal__text');
        const buttons = create('game-modal__buttons');
        const confirmButton = create('game-button inline-button', 'button');
        const cancelButton = create('game-button game-button--red inline-button', 'button');

        buttons.append(cancelButton, confirmButton);
        wrapper.append(textElement, buttons);
        this.element.append(wrapper);

        let confirmHandler;
        let cancelHandler;

        const hide = () => {
            this.element.style.opacity = 0;
            setTimeout(() => {
                parent.removeChild(this.element);
            }, 500);
        };

        this.element.addEventListener('click', (event) => {
            if (event.target === this.element) cancelHandler();
        });
        confirmButton.onclick = () => confirmHandler();
        cancelButton.onclick = () => cancelHandler();

        this.show = (text, okText, cancelText) => new Promise((resolve, reject) => {
            this.element.style.opacity = 0;
            cancelButton.style.display = 'none';
            textElement.innerHTML = text;

            if (typeof okText === 'string') confirmButton.innerHTML = okText;
            else confirmButton.innerHTML = 'Ok';
            if (typeof cancelText === 'string') cancelButton.innerHTML = cancelText;
            else cancelButton.innerHTML = 'Cancel';

            if (!!cancelText) cancelButton.style.display = 'block';

            confirmHandler = () => {
                resolve();
                hide();
            };
            cancelHandler = () => {
                reject();
                hide();
            };

            parent.append(this.element);
            setTimeout(() => {
                this.element.style.opacity = 1;
            }, 0);
        });

        Object.defineProperties(this, {
            parent: {
                get: () => parent,
                set: (el) => parent = el,
            },
        });
    }
}

export default ModalDialog;
