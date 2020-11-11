// import create from './create';

// class PuzzleField {
//     constructor() {
//         // // DOM
//         // const fieldElement = create('puzzle-field');
//         // const fieldFrame = create('puzzle-field__frame');

//         // // PRIVATE METHODS
//         // const createGrid = (fieldSize) => {
//         //     if(typeof(fieldSize) !== 'number') fieldSize = 3;
//         //     const cells = fieldSize ** 2;
//         //     const side = Math.floor(1000 / fieldSize) / 10;
//         //     for(let i = 0; i < cells; i++) {
//         //         const cell = create('puzzle-piece puzzle-piece__frame');
//         //         cell.style.width = `${side}%`;
//         //         cell.style.height = `${side}%`;
//         //         cell.style.top = `${ Math.floor(i / fieldSize) * side }%`;
//         //         cell.style.left = `${ (i % fieldSize) * side }%`;
//         //         fieldElement.prepend(cell);
//         //     }
//         // }

//         // // PUBLIC METHODS
//         // this.clear = () => {
//         //     fieldElement.innerHTML = '';
//         //     fieldElement.classList.remove('active');
//         //     fieldElement.append(fieldFrame);
//         //     return this;
//         // }

//         // this.clear();
//     }
// }