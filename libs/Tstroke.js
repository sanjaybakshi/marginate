import TimageUtils   from "./TimageUtils.js";
import Tvector2d     from "./Tvector2d.js";
import Tmath         from "./Tmath.js";

import TlinearSpline from "./TlinearSpline.js";

class Tstroke
{
    constructor() {

	this._pointList    = []
	this._pressureList = []

	this._color = "black"

	this._brushWidth = 1

	this.eModes = {
	    kPaintMode:  0,
	    kEraserMode: 1,
	    kStampMode: 2
	}
	
	this._fMode = this.eModes.kStampMode
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
    
    pushStrokePt(pointerInfo) {
	let pt              = {x:pointerInfo.x,y:pointerInfo.y}
	let pressure        = pointerInfo.pressure
	let respectPressure = pointerInfo.respectPressure

	this._pointList.push(pt)
	this._pressureList.push(pressure*pressure*pressure)

	
	
	if (respectPressure == false) {
	    //this.simulatePressure()
	}

	//this.pressureToPoints()
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

	if (this._fMode == this.eModes.kStampMode) {
	    //console.log("stamp")
	}
	
	ctx.save()

	if (this._fMode == this.eModes.kEraserMode) {
	    ctx.globalCompositeOperation = 'destination-out';
	} else {
	    //ctx.globalCompositeOperation = 'destination-out';
	}

	
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

    async drawOnObjectBorder(img, objectWidth, objectHeight)
    {
	console.log("drawiing on border")
	let inMemoryCanvas  = document.createElement("canvas")
	let inMemoryContext = inMemoryCanvas.getContext("2d")

	inMemoryCanvas.width  = img.width
	inMemoryCanvas.height = img.height

	inMemoryContext.scale(img.width/objectWidth, img.height/objectHeight)

	//console.log(img.width,img.height)
	
	//inMemoryContext.drawImage(img, 0, 0, img.width/2, img.height/2);
	//inMemoryContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvasWidth, canvasHeight)




	
	// Construct a spline for the pressures as a function of distance.
	//
	if (this._pointList.length < 2) {
	    return
	}

	
	let dist = []
	dist.push(0.0)
	let totalDist = 0.0
	
	for (let i=1; i < this._pointList.length; i++) {
	    let p0 = new Tvector2d(this._pointList[i-1].x,this._pointList[i-1].y)
	    let p1 = new Tvector2d(this._pointList[i].x,  this._pointList[i].y)
	    
	    let v  = p1.subtract(p0)
	    let l = v.len()
	    dist.push( l )
	    totalDist = totalDist + l
	}
	
	let runningD = 0.0
	
	let pressureSpline = new TlinearSpline()
	
	for (let i=0; i < dist.length; i++) {
	    runningD = runningD + dist[i]
	    let x = runningD / totalDist
	    
	    pressureSpline.addPoint( new Tvector2d(x,this._pressureList[i]) )
	}

	// Iterate over the points on the border and draw the stroke.
	//

	let perimeterLength = objectWidth*2 + objectHeight*2

	let pressureArray = []
	
	let maxPressure = Number.MIN_VALUE
	
	for (let i=0; i < perimeterLength; i++) {
	    let d = i / perimeterLength
	    let pressure = pressureSpline.interpolate(d)
	    pressureArray.push(pressure)

	    if (pressure > maxPressure) {
		maxPressure = pressure
	    }
	}

	let brushWidth = this._brushWidth	
	let maxOffset = maxPressure * brushWidth


	inMemoryContext.save()

	// start at top left for now (should start where the stroke starts)
	//
	let x0 = 0.0;
	let x1 = 0.0;
	let y0 = 0.0;
	let y1 = 0.0;

	let centerX = 0.0
	for (let i=0; i < pressureArray.length; i+=1) {

	    let pressureRatio = pressureArray[i] / maxPressure
	    let offset = pressureRatio * maxOffset

	    if (i < objectWidth) {
		let centerY = maxOffset/2
		y0 = centerY - offset/2
		y1 = centerY + offset/2
		x0 = i;
		x1 = i;
	    } else if (i < objectWidth+objectHeight) {

		centerX = (objectWidth) - maxOffset/2
		
		x0 = centerX - offset/2
		x1 = centerX + offset/2
		y0 = i - (objectWidth)
		y1 = i - (objectWidth)
	    } else if (i < objectWidth+objectHeight+objectWidth) {
		let centerY = objectHeight - maxOffset/2

		y0 = centerY - offset/2
		y1 = centerY + offset/2
		
		x0 = i - (objectWidth+objectHeight)
		x1 = i - (objectWidth+objectHeight)
	    } else {
		let centerX = maxOffset/2

		x0 = centerX - offset/2
		x1 = centerX + offset/2
		y0 = i - (objectWidth+objectHeight+objectWidth)
		y1 = i - (objectWidth+objectHeight+objectWidth)
	    }

	    
	    inMemoryContext.beginPath()
	    
	    inMemoryContext.moveTo(x0,y0)
	    inMemoryContext.strokeStyle = this._color
	    
	    inMemoryContext.lineTo(x1,y1)
	    inMemoryContext.stroke()
	}
	    /*
	inMemoryContext.beginPath()
	    
	inMemoryContext.moveTo(0,0)
	inMemoryContext.fillStyle = this._color
	
	inMemoryContext.lineTo(objectWidth,objectHeight)
	inMemoryContext.stroke()



	console.log(objectWidth)
	for (let y=0; y < objectHeight; y++) {

	    inMemoryContext.beginPath()
	    inMemoryContext.lineWidth = 1
	    inMemoryContext.moveTo(objectWidth/2-10,y)
	    inMemoryContext.lineTo(objectWidth/2-8,y)	    
	    inMemoryContext.stroke()
	    

	}
	*/
/*
	// start at top left for now (should start where the stroke starts)
	//
	for (let x=0; x < img.width; x+=1) {

	    let pressureRatio = pressureArray[x] / maxPressure
	    let offset = pressureRatio * maxOffset

	    let centerY = maxOffset/2

	    let y0 = centerY - offset/2
	    let y1 = centerY + offset/2

	    inMemoryContext.beginPath()
	    
	    inMemoryContext.moveTo(x,y0)
	    inMemoryContext.fillStyle = this._color
	    
	    inMemoryContext.lineTo(x,y1)
	    inMemoryContext.stroke()
	    //inMemoryContext.fill()
	}
*/
	
	inMemoryContext.restore()

	
	// draw stroke.
	//
	//this.draw(inMemoryContext)

	let newImage = await TimageUtils.canvas2img(inMemoryCanvas)

	return newImage
    }

    
    
    simulatePressure()
    {
	let vecs = []
	let dist = []
    
	if (this._pointList.length == 0) {
	    return []
	}

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

	let prevPressure = 0.0
	const RATE_OF_PRESSURE_CHANGE = 0.275
	let thinning = 0.5
	
	for (let i=0; i < this._pointList.length; i++) {

	    let perpendicularVec = vecs[i].perp()
	    let pointAsVec = new Tvector2d(this._pointList[i].x, this._pointList[i].y)

	    // What is the speed.
	    //
	    let d = dist[i]

            const sp = Math.min(1, d / this._brushWidth)
            const rp = Math.min(1, 1 - sp)

	    let pressure = Math.min( 1,
				     prevPressure + (rp-prevPressure) * (sp * RATE_OF_PRESSURE_CHANGE))
	    prevPressure = pressure
	    
	    this._pressureList[i] = pressure
	}	
    }

    pressureToPoints()
    {
	let brushWidth  = this._brushWidth

	let leftPts  = []
	let rightPts = []
	
	for (let i=0; i < this._pointList.length; i++) {

	    let perpendicularVec = vecs[i].perp()
	    let pointAsVec = new Tvector2d(this._pointList[i].x, this._pointList[i].y)
	    let pressure = this._pressureList[i]

	    let strokeRadius = brushWidth * ((0.5 - thinning * (0.5 - pressure)))

	    let offset = perpendicularVec.multiplyScalar(strokeRadius)
	    
	    let pLeft  = pointAsVec.clone()
	    let pRight = pointAsVec.clone()


	    pLeft  = pLeft.add(offset)
	    pRight = pRight.subtract(offset)


	    leftPts.push(pLeft)
	    rightPts.push(pRight)	    
	}

	return leftPts.concat(rightPts.reverse())
	
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

	    
	    //let strokeRadius = brushWidth * ((0.5 - thinning * (0.5 - pressure)))
	    let strokeRadius = brushWidth * ((0.5 - thinning * (0.5 - this._pressureList[i])))

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
