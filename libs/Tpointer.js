class Tpointer
{
    constructor() {

    }

    static getOffset(obj) {
	var offsetLeft = 0;
	var offsetTop = 0;
	do {
	    if (!isNaN(obj.offsetLeft)) {
		offsetLeft += obj.offsetLeft;
	    }
	    if (!isNaN(obj.offsetTop)) {
		offsetTop += obj.offsetTop;
	    }   
	} while(obj = obj.offsetParent );
	return {left: offsetLeft, top: offsetTop};
    }

    static getClientXY(e)
    {
	let x
	let y
	
	if (e.pointeres && e.pointeres[0]) {
	    x = e.pointeres[0].clientX
	    y = e.pointeres[0].clientY
	} else {
	    x = e.clientX
	    y = e.clientY
	}

	return {x: x, y: y}
    }

    
    static getPointer(e) {
	
	let pressure = 0.1
	let x, y;

	pressure = e.pressure;
	// https://dustinpfister.github.io/2020/03/04/canvas-get-point-relative-to-canvas/
	let bx = e.target.getBoundingClientRect()
	x = e.clientX - bx.left
	y = e.clientY - bx.top
	
	return {x: x, y: y, pressure: pressure};
    }
}

export default Tpointer
