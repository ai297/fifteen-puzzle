import create from './create';

class ModalDialog {
    constructor(parent) {
        parent = parent | document.body;
        this.element = create('game-modal');
        const wrapper = create('game-modal__wrapper');
        const textElement = create('game-modal__text');
        const buttons = create('game-modal__buttons');
        const confirmButton = create('game-button inline-button', 'button');
        const cancelButton = create('game-button game-button--red inline-button', 'button');

        cancelButton.innerHTML = 'Cancel';
        confirmButton.innerHTML = 'Ok';
        buttons.append(cancelButton, confirmButton);
        wrapper.append(textElement, buttons);
        this.element.append(wrapper);

        let confirmHandler;
        let cancelHandler;

        this.element.addEventListener('click', (event) => {
            if (event.target === this.element) this.hide();
        });
        confirmButton.onclick = () => {
            if (typeof confirmHandler === 'function') confirmHandler();
            this.hide();
        };
        cancelButton.onclick = () => {
            if (typeof cancelHandler === 'function') cancelHandler();
            this.hide();
        };

        this.show = (text, confirm, cancel) => {
            this.element.style.opacity = 0;
            cancelButton.style.display = 'none';
            textElement.innerHTML = text;
            confirmHandler = confirm;

            if (typeof cancel !== 'undefined') {
                cancelButton.style.display = 'block'
                cancelHandler = cancel;
            }

            parent.append(this.element);
            setTimeout(() => {
                this.element.style.opacity = 1;
            }, 0);
        }

        this.hide = () => {
            this.element.style.opacity = 0;
            setTimeout(() => {
                parent.removeChild(this.element);
            }, 500);
        }

        Object.defineProperties(this, {
            parent: {
                get: () => parent,
                set: (el) => parent = el,
            },
        });
    }
}

export default ModalDialog;
