import TdrawUtils  from "./TdrawUtils.js";
import TimageUtils from "./TimageUtils.js";
import TfileUtils  from "./TfileUtils.js";
import Tmath       from "./Tmath.js";
import Tvector2d   from "./Tvector2d.js";



class TstampStroke
{
    constructor()
    {
	this.setStrokeProperties(4,"black")

	this._pointList    = []
	this._pressureList = []

	this._brushTexture = TimageUtils.makeImage(50,50)

	this._kbrushTexture = null

	this._math = new Tmath()
    }

    clone() {
	let n = new TstampStroke()

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

    setStrokeProperties(s,c)
    {
	this._brushWidth     = s
	this._halfBrushWidth = s/2

	this._color = c
    }
    
    push()
    {
	console.log("SHIT DONT CALL THIS")	
    }
    
    pushStampStrokePt(pointerInfo) {
	let pt              = {x:pointerInfo.x,y:pointerInfo.y}
	let pressure        = pointerInfo.pressure
	let respectPressure = pointerInfo.respectPressure


	// Check distance from previous point.
	//
	let nPts = this._pointList.length
	
	if (nPts >= 1) {
	    
	    let p0 = new Tvector2d(this._pointList[nPts-1].x,this._pointList[nPts-1].y)
	    let p1 = new Tvector2d(pt.x, pt.y)

	    
	    let v  = p1.subtract(p0)
	    let l = v.len()

	    // add extra points if length is more than 1 pixel.
	    //
	    if (l > 1) {

		for (let i=1; i < l; i++) {
		    //y = Tmath.remap(x0,x1,y0,y1,x)


		    let v= i/l
		    let xx = Tmath.remap(0.0, 1.0, p0.x, pt.x, v)
		    let yy = Tmath.remap(0.0, 1.0, p0.y, pt.y, v)

		    this._pointList.push({x:xx,y:yy})
		    this._pressureList.push(pressure*pressure*pressure)

		    
		}
		
		this._pointList.push(pt)
		this._pressureList.push(pressure*pressure*pressure)

		
	    } else {
		this._pointList.push(pt)
		this._pressureList.push(pressure*pressure*pressure)
	    }
	    
	    //console.log(l.toFixed(2))
	    //let distance = 
	} else {
	
	    this._pointList.push(pt)
	    this._pressureList.push(pressure*pressure*pressure)

	}
	
	
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
    
    async setupBrushes()
    {
	if (this._kbrushTexture == null) {
	    this._kbrushTexture = await TfileUtils.readImageAsync("./tools/kbrush.png")
	}
    }

    
    async draw(ctx)
    {
	
	if (this._pointList.length > 1) {
	    
	    ctx.save()
	    // Reset current transformation matrix to the identity matrix
	    //ctx.setTransform(1, 0, 0, 1, 0, 0);

	    ctx.globalCompositeOperation = 'source-over';

	    for (let i=0; i < this._pointList.length; i++) {
		//TdrawUtils.drawCircle(ctx, this._pointListB[i], 15, "rgba(255, 165, 0, .15)")

		ctx.translate(this._pointList[i].x,
			      this._pointList[i].y)


		//let angle = Tmath.seededRandom2(1234) * 180
		//let angle = Math.random() * 180
		let angle = this._math.getRandom(i) * 180

		//let angle = Math.random() * 360
		let angleRadians = Tmath.degrees2radians(angle)
		ctx.rotate(angleRadians)
		//ctx.rotate(i)
		//console.log(i, Tmath.radians2degrees(i))

		
		if (this._kbrushTexture != null) {
		    ctx.drawImage(this._kbrushTexture,
		    0, 0, this._kbrushTexture.width, this._kbrushTexture.height,
				  -this._halfBrushWidth, -this._halfBrushWidth,
				  this._brushWidth, this._brushWidth)

		    //TdrawUtils.drawCircle(ctx, {x:0,y:0}, 15, "rgba(255, 165, 0, .15)")

		} else {
		    /*
		    console.log(this._pointListB[i].x,
		    this._pointListB[i].y)
		    */

		}
		
		// Reset current transformation matrix to the identity matrix
		//ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.rotate(-angleRadians)		

		ctx.translate(-this._pointList[i].x,
			      -this._pointList[i].y)


		// Debugging
		/*
		if (this._kbrushTexture != null) {
		    let cw = ctx.canvas.clientWidth
		    let ch = ctx.canvas.clientHeight
		    
		    console.log(cw,ch)
		    ctx.translate(cw/2,ch/2)

		    ctx.drawImage(this._kbrushTexture,
				  0, 0, this._kbrushTexture.width, this._kbrushTexture.height,
				  -250,-250,
				  500,500)
		    ctx.translate(-cw/2,-ch/2)		    
		    }
		    */

	    }
	    
	    ctx.restore()
	}
	
    }

    async drawOnImage(img, canvasWidth, canvasHeight)
    {
	let inMemoryCanvas  = document.createElement("canvas")
	let inMemoryContext = inMemoryCanvas.getContext("2d")

	inMemoryCanvas.width  = img.width
	inMemoryCanvas.height = img.height

	inMemoryContext.scale(img.width/canvasWidth, img.height/canvasHeight)

	inMemoryContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvasWidth, canvasHeight)

	
	// draw stroke.
	//
	this.draw(inMemoryContext)
	
	let newImage = await TimageUtils.canvas2img(inMemoryCanvas)

	return newImage
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


/*
	lo_x = 10
	lo_y = 10
	hi_x = 200
	hi_y = 200
*/

	// compensate for the size of the brush.
	//
	lo_x = lo_x - this._halfBrushWidth
	lo_y = lo_y - this._halfBrushWidth
	hi_x = hi_x + this._halfBrushWidth
	hi_y = hi_y + this._halfBrushWidth
	
	let width  = hi_x - lo_x;
	let height = hi_y - lo_y; 

	console.log(this._brushWidth)
	console.log(lo_x, lo_y)
	console.log(hi_x, hi_y)
	
	return {'center' : {x:(lo_x) + (width / 2.0),
			    y:(lo_y) + (height / 2.0)},
		'width'  : width,
		'height' : height}
    }
}    

export default TstampStroke;
