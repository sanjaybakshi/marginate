import Tmath from "./Tmath.js";


class TlinearSpline
{
    constructor()
    {
	this._data = []
    }

    addPoint(p)
    {
	this._data.push(p)
    }
    
    interpolate(x)
    {

	let y = 0.0
	
	for (let i=1; i < this._data.length; i++) {

	    if (this._data[i].x > x) {
		let x0 = this._data[i-1].x
		let y0 = this._data[i-1].y
		let x1 = this._data[i].x
		let y1 = this._data[i].y

		// Interpolate between these two points.
		//
		y = Tmath.remap(x0,x1,y0,y1,x)
		
		break;
	    }
	}
	return y;
    }

    debug()
    {
	for (let i=0; i < this._data.length; i++) {
	    console.log(i, this._data[i].x, this._data[i].y)

	}
    }
}

export default TlinearSpline;
