class Slider {
    constructor(element, animationDelay = 500) {
        if (typeof element !== 'object' || element.classList === undefined) throw Error('Invalid argument "element"');
        element.classList.add('slider');

        const slides = [];
        let currentSlide = -1;

        const showSlide = (index, reverse = false) => {
            return new Promise((resolve, reject) => {
                if (currentSlide === -1) {
                    reject(Error('Slider is empty.'));
                    return;
                }
                if (index < 0 || index >= slides.length) {
                    reject(Error(`Slider does not contains item with index ${index}.`));
                    return;
                }
                if (currentSlide === index) {
                    resolve(slides[index].name);
                    return;
                }

                if (!reverse) {
                    element.append(slides[index].element);
                    slides[currentSlide].element.classList.add('slider__section--prev');
                } else {
                    slides[index].element.classList.add('slider__section--prev');
                    element.prepend(slides[index].element);
                    setTimeout(() => {
                        slides[index].element.classList.remove('slider__section--prev');
                    }, 50);
                }
                setTimeout(() => {
                    slides[currentSlide].element.remove();
                    slides[currentSlide].element.classList.remove('slider__section--prev');
                    currentSlide = index;
                    resolve(slides[index].name);
                }, animationDelay);
            });
        };

        this.addSlide = (el, name) => {
            el.classList.add('slider__section');
            slides.push({ element: el, name, });

            if (currentSlide === -1) {
                element.append(el);
                currentSlide = 0;
            }
        };

        this.goTo = (name, reverse = false) => {
            const index = slides.findIndex((slide) => slide.name === name);
            return showSlide(index, reverse);
        };

        this.next = () => {
            if (currentSlide === -1) return;
            let newSlide = 0;
            if (currentSlide < slides.length - 1) newSlide = currentSlide + 1;
            return showSlide(newSlide);
        };

        this.prev = () => {
            if (currentSlide === -1) return;
            let newSlide = slides.length - 1;
            if (currentSlide > 0) newSlide = currentSlide - 1;
            return showSlide(newSlide, true);
        };

        Object.defineProperties(this, {
            selected: {
                get: () => currentSlide >= 0 ? slides[currentSlide].name : null,
            },
            selectedIndex: {
                get: () => currentSlide,
            },
            selectedElement: {
                get: () => currentSlide >= 0 ? slides[currentSlide].element : null,
            },
        });
    }
}
export default Slider;
