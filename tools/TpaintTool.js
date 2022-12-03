import Ttool       from "../libs/Ttool.js"
import Tstroke     from "../libs/Tstroke.js"
import Tpointer    from "../libs/Tpointer.js";


import { fModel } from '../TmarginateModel.js'


class TpaintTool extends Ttool
{
    constructor(canvas)
    {
	super(canvas)

	this.fCurrentStroke = new Tstroke()
	this._strokeStarted = false
    }

    setEraserMode()
    {
	this.fCurrentStroke._fMode = this.fCurrentStroke.eModes.kEraserMode
    }
    setPaintMode()
    {
	this.fCurrentStroke._fMode = this.fCurrentStroke.eModes.kPaintMode
    }
    
    pointerDown(e)
    {
	super.pointerDown(e)

	// Set the color.
	//
	this.fCurrentStroke._color      = fModel.fStrokeColor
	this.fCurrentStroke._brushWidth = fModel.fStrokeSize

	let pointerInfo = Tpointer.getPointer(e)
	this._strokeStarted = true
	this.fCurrentStroke.pushStrokePt({x:pointerInfo.x,y:pointerInfo.y}, pointerInfo.pressure)		
    }

    pointerMove(e)
    {
	super.pointerMove(e)

	if (this._strokeStarted) {
	    let pointerInfo = Tpointer.getPointer(e)
	    
	    this.fCurrentStroke.pushStrokePt({x:pointerInfo.x,y:pointerInfo.y}, pointerInfo.pressure)

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
	
	let strokedImg = await this.fCurrentStroke.drawOnImage(frameImg)


	fModel.setFrameImage(strokedImg)
	//paintCanvas.setBackgroundImage(strokedImg)	    

	this._strokeStarted = false
	this.fCurrentStroke.clear()

    }

    draw(ctx)
    {
	super.draw(ctx)

	
	this.fCurrentStroke.draw(ctx)
    }

    dismiss()
    {
	super.dismiss()
    }

    engage()
    {
	super.engage()
    }    
}

export default TpaintTool

