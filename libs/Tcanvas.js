import Tdiv from "./Tdiv.js"

class Tcanvas extends Tdiv
{
    constructor(canvasId)
    {
	super(canvasId)

	this.fContext = this._div.getContext('2d')
    }

/*
    canvasWidth() {
	return this._div.offsetWidth
    }
    canvasHeight() {
	return this._div.offsetHeight
    }
*/
    setWidthHeight(wh) {
	super.setWidthHeight(wh)

	var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
	this._div.width  = Math.floor(this._div.offsetWidth  * scale)
	this._div.height = Math.floor(this._div.offsetHeight * scale)

	this.fContext.scale(scale, scale)
    }
}


export default Tcanvas


