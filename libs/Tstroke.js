import TimageUtils from "./TimageUtils.js";

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
	ctx.strokeStyle = this._color
	ctx.lineCap     = 'round'
	ctx.lineJoin    = 'round'

	if (this._fMode == this.eModes.kEraserMode) {
	    ctx.globalCompositeOperation = 'destination-out';
	    console.log("eraser")
	} else {
	    //ctx.globalCompositeOperation = 'destination-out';

	    console.log("paint")
	}
	
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

	return {'center' : [lo_x + width / 2.0, lo_y + height / 2.0],
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
    async drawOnImage(img)
    {
	let inMemoryCanvas  = document.createElement("canvas")
	let inMemoryContext = inMemoryCanvas.getContext("2d")

	inMemoryCanvas.width = img.width
	inMemoryCanvas.height = img.height

	inMemoryContext.scale(2,2)
	
	inMemoryContext.drawImage(img, 0, 0, img.width/2, img.height/2);
	
	/*
	// Draw blue triangle
	inMemoryContext.beginPath();
	inMemoryContext.fillStyle = 'blue';
	inMemoryContext.moveTo(20, 20);
	inMemoryContext.lineTo(180, 20);
	inMemoryContext.lineTo(130, 130);
	inMemoryContext.closePath();
	inMemoryContext.fill();
	*/
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
}    

export default Tstroke;
