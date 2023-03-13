import Ttool         from "../libs/Ttool.js"
import Tstroke       from "../libs/Tstroke.js"
import Tpointer      from "../libs/Tpointer.js";
import TimageUtils   from "../libs/TimageUtils.js";

import TplanckWorld   from "../planck/TplanckWorld.js";
import TplanckObject  from "../planck/TplanckObject.js";


import { fModel } from '../TmarginateModel.js'


class TaddObjectTool extends Ttool
{
    constructor(canvas)
    {
	super(canvas)

	this.fCurrentStroke = new Tstroke()
	this._strokeStarted = false

	this._objType = TplanckObject.eObjectType.kRectangle
    }

    setRectangleMode()
    {
	this._objType = TplanckObject.eObjectType.kRectangle	
    }
    setCircleMode()
    {
	this._objType = TplanckObject.eObjectType.kCircle	
    }
    setEdgeMode()
    {
	this._objType = TplanckObject.eObjectType.kEdge
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
	this.fCurrentStroke.pushStrokePt(pointerInfo)
    }

    pointerMove(e)
    {
	super.pointerMove(e)

	if (this._strokeStarted) {
	    let pointerInfo = Tpointer.getPointer(e)
	    
	    this.fCurrentStroke.pushStrokePt(pointerInfo)
	}
	
    }

    async pointerUp(e)
    {
	super.pointerUp(e)

	if (this._strokeStarted) {

	    
	    // Figure out the box.
	    //
	    let box = this.fCurrentStroke.axisAlignedBox()
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

		    // Draw the stroke in the object.
		    //

		    // Lifted this code from TbrushTool
		    // This should be put in a consolidated place (like in Tstroke) ?
		    //


		    // transform the stroke points to the coordinates on the image.
		    //
		    let bCenter = obj.getCenterInPixels()
		    let left = bCenter.x - obj.widthInPixels()  / 2
		    let top  = bCenter.y - obj.heightInPixels() / 2
		    
		    // Need to clone this as translating will affect stroke
		    //
		    let s = this.fCurrentStroke.clone()
		    s.translate(left, top)
	    

		    let sprite = obj.sprite()
		    if (sprite == null) {
			sprite = TimageUtils.makeImage(obj._widthPixels, obj._heightPixels)		
		    }
	    
		    //let strokedImg = await s.drawOnImage(sprite, obj._widthPixels, obj._heightPixels)
		    let strokedImg = await s.drawOnObjectBorder(sprite, obj._widthPixels, obj._heightPixels)
		    fModel.editObject(obj, {sprite: strokedImg})
		    
		}
	    }
	}

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

export default TaddObjectTool

