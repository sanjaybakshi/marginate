import Ttool         from "../libs/Ttool.js"
import Tstroke       from "../libs/Tstroke.js"
import Tpointer       from "../libs/Tpointer.js";

import TplanckWorld   from "../planck/TplanckWorld.js";
import TplanckObject  from "../planck/TplanckObject.js";


import { fModel } from '../TmarginateModel.js'


class TaddObjectTool extends Ttool
{
    constructor()
    {
	super()

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
	
	//let strokedImg = await this.fCurrentStroke.drawOnImage(frameImg)


	// fModel.setFrameImage(strokedImg)

	
	//fModel.fPlanckWorld.addObject({x:50,y:50}, 10, 10, 0, fModel.getCurrentFrame(), this._objType)
	
	//let newBoxArray = []
	if (this._strokeStarted) {
	    // Figure out the box.
	    //
	    let box = this.fCurrentStroke.axisAlignedBox()
	    if (box != null) {
		let center = box['center'];
		let width  = box['width'];
		let height = box['height'];

		// Only make the box if it's big enough.
		//
		if (width > 5 && height > 5) {
		    //let newBox = this.fCanvas._box2dWorld.addBox(center, width, height, this.fCanvas.getCurrentFrame())


		    let newBox = fModel.fPlanckWorld.addObject(center, width, height,
							       fModel.getCurrentFrame(), this._objType)

		    fModel.fSelectionList.replace([newBox])
		    //let newBox = fModel.fBox2dWorld.addBox({x:center[0],y:center[1]},
		    //					   width, height, this.fCanvas.getCurrentFrame())
		    //newBoxArray.push(newBox)
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

