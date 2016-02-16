//old code
throw "message";
// 1
function getDivs(el) {
    return el.getElementsByTagName('div');
}

//new 
function getDivs(el) {
    if (el && el.getElementsByTagName) {
        return el.getElementsByTagName("div");
    } else {
        throw new Error("getdivs : Argument must be a DOM");
    }
}
//bad code
function addClass(element.class) {
    if (!element || typeof element.className != 'string') {
        throw new Error("addClass:First argument must be a DOM");
    }
    if (typeof className != 'string') {
        throw new Error("addClass: second argument must be a string");
    }
    element.className += " " + class;

}
//to much test
function addClass(element, class) {
    if (!element && typeof element.className != 'string') {
        throw new Error("addClass:First argument must be a DOM");
    }
    element.className += " " + class;
}
