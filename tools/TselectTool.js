import Ttool          from "../libs/Ttool.js"
import Tpointer       from "../libs/Tpointer.js";
import Trect          from "../libs/Trect.js";

import TplanckWorld   from "../planck/TplanckWorld.js";
import TplanckObject  from "../planck/TplanckObject.js";

import { fModel } from '../TmarginateModel.js'


class TselectTool extends Ttool
{
    constructor(canvas)
    {
	super(canvas)

	this._selectionStarted = false

	this.fCurrentRect = Trect.constructFromCoords({x1:0,y1:0,x2:0,y2:0})
    }

    
    pointerDown(e)
    {
	super.pointerDown(e)

	let pointerInfo = Tpointer.getPointer(e)
	this._selectionStarted = true

	this.fCurrentRect._x = pointerInfo.x
	this.fCurrentRect._y = pointerInfo.y
	this.fCurrentRect._width = 0
	this.fCurrentRect._height = 0
    }

    pointerMove(e)
    {
	super.pointerMove(e)

	if (this._selectionStarted) {
	    let pointerInfo = Tpointer.getPointer(e)

	    this.fCurrentRect.addPoint( {x:pointerInfo.x, y:pointerInfo.y} )	    
	}
	
    }

    async pointerUp(e)
    {
	super.pointerUp(e)


	if (this._selectionStarted) {
	    let pointerInfo = Tpointer.getPointer(e)

	    this.fCurrentRect.addPoint( {x:pointerInfo.x, y:pointerInfo.y} )	    
	    
	    let selThings = fModel.fPlanckWorld.intersectRect(this.fCurrentRect, true, true)

	    fModel.fSelectionList.replace(selThings)
	}    
	this._selectionStarted = false
	this.fCurrectRect =  Trect.constructFromCoords({x1:0,y1:0,x2:0,y2:0})
    }

    draw(ctx)
    {
	super.draw(ctx)

	if (this._selectionStarted == true) {

	    ctx.save()
	    this.fCurrentRect.drawDashed(ctx, 10, 10)
	    ctx.restore()	

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
}

export default TselectTool

