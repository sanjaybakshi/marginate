import TimageUtils from "./TimageUtils.js";

import Tvector2d   from "./Tvector2d.js";
import Tmath       from "./Tmath.js";

class Tstroke
{
    constructor() {

	this._pointList    = []
	this._pressureList = []

	this._color = "black"

	this._brushWidth = 1

	this.eModes = {
	    kPaintMode:  0,
	    kEraserMode: 1
	}
	
	this._fMode = this.eModes.kPaintMode
	
	/*
	this.push = function(pt, pressure) {
	    this._pointList.push(pt)
	    this._pressureList.push(pressure)
	}
	*/
    }


    
    clone() {
	let n = new Tstroke()

	for (let i=0; i < this._pointList.length; i++) {

	    let v = {x: this._pointList[i].x,
		     y: this._pointList[i].y}
	    
	    n._pointList.push(v)

	    let p = this._pressureList[i]
	    n._pressureList.push(p)
	}

	n._color = this._color
	n._brushWidth = this._brushWidth

	return n
    }


    push()
    {
	console.log("SHIT DONT CALL THIS")	
    }
    
    pushStrokePt(pt, pressure) {
	this._pointList.push(pt)
	this._pressureList.push(pressure)
    }
    
    clear()
    {
	this._pointList    = []
	this._pressureList = []
    }

    draw(ctx)
    {
	if (this._pointList.length == 0) {
	    return
	}

	ctx.save()
	
	//ctx.strokeStyle = 'black'
	//ctx.strokeStyle = this._color
	//ctx.lineCap     = 'round'
	//ctx.lineJoin    = 'round'

	if (this._fMode == this.eModes.kEraserMode) {
	    ctx.globalCompositeOperation = 'destination-out';
	    //console.log("eraser")
	} else {
	    //ctx.globalCompositeOperation = 'destination-out';

	    //console.log("paint")
	}
	/*
	for (let i=0; i < this._pointList.length-1; i++) {

	    let pt1 = this._pointList[i]
	    let pt2 = this._pointList[i+1]

	    let pr  = this._pressureList[i] * 1 * this._brushWidth


	    ctx.beginPath()
	    ctx.moveTo(pt1.x,pt1.y)
	    ctx.lineWidth = pr
	    ctx.lineTo(pt2.x,pt2.y)
	    ctx.stroke();
	    ctx.closePath()

	    //const output = document.getElementById("output")
	    //output.textContent = 'pe: ' + i + ' ' + pr
	    //console.log(i,pr)
	}
*/

	let sp = this.getStrokePolygon()


	ctx.beginPath()

	if (sp.length > 5) {
	    ctx.fillStyle = this._color
	    
	    ctx.moveTo(sp[0].x, sp[0].y)

	    for (let i=1; i < sp.length; i++) {
		ctx.lineTo(sp[i].x,sp[i].y)
	    }

	    ctx.closePath()
	    ctx.fill()
	}
	
	ctx.restore()
    }
    
    axisAlignedBox()
    //
    // Description:
    //     Constructs a box that bounds the points.
    //
    {
	if (this._pointList.length == 0) {
	    return null
	}
	
	let lo_x = this._pointList[0].x
	let lo_y = this._pointList[0].y
	let hi_x = this._pointList[0].x
	let hi_y = this._pointList[0].y
	
	for (const p of this._pointList) {

	    lo_x = Math.min(lo_x, p.x)
	    lo_y = Math.min(lo_y, p.y)
	    hi_x = Math.max(hi_x, p.x)
	    hi_y = Math.max(hi_y, p.y)
	}

	let width  = hi_x - lo_x;
	let height = hi_y - lo_y; 

	return {'center' : {x:lo_x + width / 2.0,y:lo_y + height / 2.0},
		'width'  : width,
		'height' : height}
    }

    translate(vx, vy)
    {
	for (let i=0; i < this._pointList.length; i++) {
	    this._pointList[i].x = this._pointList[i].x - vx
	    this._pointList[i].y = this._pointList[i].y - vy
	}
	
    }

    /*
    async drawOnImage(img)
    {
	let inMemoryCanvas  = document.createElement("canvas")
	let inMemoryContext = inMemoryCanvas.getContext("2d")

	inMemoryCanvas.width  = img.width
	inMemoryCanvas.height = img.height

	var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
	
	inMemoryContext.scale(scale,scale)

	//console.log(img.width,img.height)
	
	//inMemoryContext.drawImage(img, 0, 0, img.width/2, img.height/2);
	inMemoryContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width/scale, img.height/scale);

	
	// draw stroke.
	//
	this.draw(inMemoryContext)

	let newImage = await TimageUtils.canvas2img(inMemoryCanvas)

	return newImage
    }
*/

    async drawOnImage(img, canvasWidth, canvasHeight)
    {
	let inMemoryCanvas  = document.createElement("canvas")
	let inMemoryContext = inMemoryCanvas.getContext("2d")

	inMemoryCanvas.width  = img.width
	inMemoryCanvas.height = img.height

	inMemoryContext.scale(img.width/canvasWidth, img.height/canvasHeight)

	//console.log(img.width,img.height)
	
	//inMemoryContext.drawImage(img, 0, 0, img.width/2, img.height/2);
	inMemoryContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvasWidth, canvasHeight)

	
	// draw stroke.
	//
	this.draw(inMemoryContext)

	let newImage = await TimageUtils.canvas2img(inMemoryCanvas)

	return newImage
    }
    
    drawOnImage_no_work_on_safari_or_ios(img)
    {
	let inMemoryCanvas = new OffscreenCanvas(img.width, img.height)
	let inMemoryContext = inMemoryCanvas.getContext("2d");

	inMemoryContext.drawImage(img, 0, 0);
	// draw stroke.
	//
	this.draw(inMemoryContext)

	let newImage = inMemoryCanvas.transferToImageBitmap()
	return newImage
    }


    getStrokePolygon()
    {
	let leftPts  = []
	let rightPts = []


	let vecs = []
	let dist = []
    
	if (this._pointList.length == 0) {
	    return []
	}

	/*
	this._pointList = []
	this._pointList = [ {x:50,y:50},
			    {x:60,y:50},
			    {x:70,y:50},
			    {x:140,y:50},
			    {x:210,y:50},
			    {x:280,y:50},
			    {x:330,y:50},
			    {x:350,y:50},
			    {x:370,y:50},
			    {x:390,y:50}]
			    */

	vecs.push(new Tvector2d(0,0))
	dist.push(0.0)
	
	for (let i=1; i < this._pointList.length; i++) {

	    // Compute vector from current point to the previous point.
	    //

	    let p0 = new Tvector2d(this._pointList[i-1].x,this._pointList[i-1].y)
	    let p1 = new Tvector2d(this._pointList[i].x,  this._pointList[i].y)
	    
	    let v  = p1.subtract(p0)

	    dist.push( v.len() )
	    
	    v.normalize()
	    vecs.push(v)
	}


	if (this._pointList.length >= 2) {
	    // Make the first vector the same as the second.
	    //
	    vecs[0].x = vecs[1].x
	    vecs[0].y = vecs[1].y

	    dist[0] = 0.0
	}

	let brushWidth  = this._brushWidth
	let prevPressure = 0.0
	const RATE_OF_PRESSURE_CHANGE = 0.275
	let thinning = 0.5
	
	for (let i=0; i < this._pointList.length; i++) {

	    let perpendicularVec = vecs[i].perp()
	    let pointAsVec = new Tvector2d(this._pointList[i].x, this._pointList[i].y)


	    // What is the speed.
	    //
	    let d = dist[i]

            const sp = Math.min(1, d / brushWidth)
            const rp = Math.min(1, 1 - sp)

	    let pressure = Math.min( 1,
				     prevPressure + (rp-prevPressure) * (sp * RATE_OF_PRESSURE_CHANGE))
	    prevPressure = pressure

	    let strokeRadius = brushWidth * ((0.5 - thinning * (0.5 - pressure)))

	    if (i === this._pointList.length - 1) {
		//strokeRadius = brushWidth
	    }
	    
	    
	    let offset = perpendicularVec.multiplyScalar(strokeRadius)
	    
	    let pLeft  = pointAsVec.clone()
	    let pRight = pointAsVec.clone()


	    pLeft  = pLeft.add(offset)
	    pRight = pRight.subtract(offset)


	    leftPts.push(pLeft)
	    rightPts.push(pRight)


	    
	}

	return leftPts.concat(rightPts.reverse())

	/*
	let pts = [ {x:50,y:50},{x:60,y:50},{x:70,y:50},{x:80,y:50},{x:90,y:50},{x:100,y:50},
		    {x:100,y:60},{x:90,y:60},{x:80,y:60},{x:70,y:60},{x:60,y:60},{x:50,y:60} ]
		    return pts
		    */
	//return leftPts
    }
    

    /*
    smootherStrokePoints()
    {
	// Parameters:
	//	streamline - how much to soften your points.
	//

	let streamline = 0.5
	
	// No points to smooth.
	//
	if (this._pointList.length ==0) {
	    return []
	}

	let retPts = []

	// Copy into retPts
	//
	for (let i=0; i < this._pointList.length; i++) {

	    let v = {x: this._pointList[i].x,
		     y: this._pointList[i].y,
		     pressure: this._pressureList[i]}
	    
	    retPts.push(v)
	}


	
	const t = 0.15 + (1 - streamline) * 0.85

	// Add extra points between the two to help avoid dashed lines.
	//
	if (retPts.length == 2) {
	    let last = retPts[1]

	    // Remove the last point.
	    //
	    retPts = retPts.slice(0,-1)
	    
	    for (let i = 1; i < 5; i++) {
		
	    }
	}
    }

    getStrokeOutlinePoints()
    {
	
	
    }
*/
}    

export default Tstroke;
