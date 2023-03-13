import Ttool         from "../libs/Ttool.js"
import Tpointer      from "../libs/Tpointer.js";
import TstampStroke  from "../libs/TstampStroke.js"
import TimageUtils   from "../libs/TimageUtils.js";

import { fModel }    from '../TmarginateModel.js'


class TdrawTool extends Ttool
{
    static eDrawType = {
	kPencil    : 0,
	kPen       : 1,
	kEraser    : 2,
	kRectangle : 3
    }


    constructor(canvas)
    {
	super(canvas)
	this._drawType = TdrawTool.eDrawType.kPencil

	this.fCurrentStampStroke = new TstampStroke()
	this._stampStrokeStarted = false	
    }

    setPencilMode()
    {	
	this._drawType = TdrawTool.eDrawType.kPencil
	// Change this function to load the pencil texture explicitly
	this.fCurrentStampStroke.setupBrushes()	
    }

    setPenMode()
    {
	this._drawType = TdrawTool.eDrawType.kPen
	// Change this function to load the pen texture explicitly
	//this.fStampStroke.setupBrushes()		
    }
    
    setEraserMode()
    {
	this._drawType = TdrawTool.eDrawType.kEraser
	// Change this function to load the eraser texture explicitly
	//this.fStampStroke.setupBrushes()			
    }

    setRectangleMode()
    {
	this._drawType = TdrawTool.eDrawType.kRectangle

	// Change this function to load the pencil texture explicitly
	this.fCurrentStampStroke.setupBrushes()	
    }
     
    
    pointerDown(e)
    {
	super.pointerDown(e)

	// Set the color.
	//
	this.fCurrentStampStroke.setStrokeProperties(fModel.fStrokeSize, fModel.fStrokeColor)
	
	let pointerInfo = Tpointer.getPointer(e)
	this._stampStrokeStarted = true
	this.fCurrentStampStroke.pushStampStrokePt(pointerInfo)	
    }

    pointerMove(e)
    {
	super.pointerMove(e)

	if (this._stampStrokeStarted) {
	    let pointerInfo = Tpointer.getPointer(e)
	    
	    this.fCurrentStampStroke.pushStampStrokePt(pointerInfo)

	}
	
    }

    async pointerUp(e)
    {
	super.pointerUp(e)

	let frameImg = fModel.getFrameImage()
	
	if (frameImg == null) {
	    fModel.makeFrameImage()
	    frameImg = fModel.getFrameImage()
	}

	if (this._drawType == TdrawTool.eDrawType.kRectangle) {

	    this.createRectangle()
	    
	} else {
	
	    let stampStrokedImg = await this.fCurrentStampStroke.drawOnImage(frameImg,
									     this.fCanvas.getWidthHeight().width,
									     this.fCanvas.getWidthHeight().height)
	
	    fModel.setFrameImage(stampStrokedImg)
	}

	this._stampStrokeStarted = false
	this.fCurrentStampStroke.clear()
	
    }

    draw(ctx)
    {
	super.draw(ctx)
	if (this._stampStrokeStarted == true) {
	    this.fCurrentStampStroke.draw(ctx)
	}
    }

    dismiss()
    {
	super.dismiss()
    }

    engage()
    {
	super.engage()
    }


    async createRectangle()
    {
	// Figure out the box.
	//
	let box = this.fCurrentStampStroke.axisAlignedBox()
	if (box != null) {
	    let pos    = box['center'];
	    let width  = box['width'];
	    let height = box['height'];
	    
	    // Only make the box if it's big enough.
	    //
	    if (width > 5 && height > 5) {
		
		let obj = fModel.addObject({pos: pos,
					    width: width,
					    height: height,
					    currentFrame: fModel.getCurrentFrame(),
					    objType: this._objType})

		let sprite = obj.sprite()
		if (sprite == null) {
		    sprite = TimageUtils.makeImage(obj._widthPixels, obj._heightPixels)		
		}

		// use stroke on this one...
		//
		let borderStroke = new TstampStroke()
		await borderStroke.setupBrushes()	
		
		borderStroke.setStrokeProperties(fModel.fStrokeSize, fModel.fStrokeColor)

		
		borderStroke.pushStampStrokePt({x:borderStroke._halfBrushWidth,
						y:borderStroke._halfBrushWidth,
						pressure:1.0,
						respectPressure:false})

		borderStroke.pushStampStrokePt({x:obj._widthPixels - borderStroke._halfBrushWidth,
						y:borderStroke._halfBrushWidth,
						pressure:1.0,
						respectPressure:false})

		borderStroke.pushStampStrokePt({x:obj._widthPixels - borderStroke._halfBrushWidth,
						y:obj._heightPixels - borderStroke._halfBrushWidth,
						pressure:1.0,
						respectPressure:false})

		borderStroke.pushStampStrokePt({x:borderStroke._halfBrushWidth,
						y:obj._heightPixels - borderStroke._halfBrushWidth,
						pressure:1.0,
						respectPressure:false})

		borderStroke.pushStampStrokePt({x:borderStroke._halfBrushWidth,
						y:borderStroke._halfBrushWidth,
						pressure:1.0,
						respectPressure:false})


		let borderImage = await borderStroke.drawOnImage(sprite,
								 obj._widthPixels,
								 obj._heightPixels)
		fModel.editObject(obj, {sprite: borderImage})
		
		
	    }

	}
    }
}

export default TdrawTool

