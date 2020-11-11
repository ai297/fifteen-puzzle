class SlidePuzzle {

    constructor(el) {
        if(el === null || el === undefined) throw Error('Root game element cannot be null');
        el.style.position = 'relative';
        //el.append(gameLayer);
        // create game layout

        this.newGme = size => {}

    }

    get moves() {
        if(typeof this.getMoves === 'function')
            return this.getMoves();
        return 0;
    }

}

export default SlidePuzzle;
