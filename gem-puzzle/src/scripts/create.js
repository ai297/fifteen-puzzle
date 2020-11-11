const create = function(classList, element = 'div') {
    const el = document.createElement(element);
    
    if(typeof(classList) === 'string')
        el.classList.add(...classList.split(' '));
    
    return el;
}

export default create;