import Ttool          from "../libs/Ttool.js"
import Tpointer       from "../libs/Tpointer.js";

import TplanckWorld   from "../planck/TplanckWorld.js";
import TplanckObject  from "../planck/TplanckObject.js";

import { fModel } from '../TmarginateModel.js'


class TselectTool extends Ttool
{
    constructor()
    {
	super()

	this._selectionStarted = false

	this.fCurrentRect = {top:0, left:0, width:0, height:0}
    }

    
    pointerDown(e)
    {
	super.pointerDown(e)

	let pointerInfo = Tpointer.getPointer(e)
	this._selectionStarted = true

	this.fCurrentRect.top    = pointerInfo.y
	this.fCurrentRect.left   = pointerInfo.x
	this.fCurrentRect.width  = 0
	this.fCurrentRect.height = 0
    }

    pointerMove(e)
    {
	super.pointerMove(e)

	if (this._selectionStarted) {
	    let pointerInfo = Tpointer.getPointer(e)

	    this.fCurrentRect.width  = pointerInfo.x - this.fCurrentRect.left
	    this.fCurrentRect.height = pointerInfo.y - this.fCurrentRect.top	    

	}
	
    }

    async pointerUp(e)
    {
	super.pointerUp(e)


	if (this._selectionStarted) {
	    let pointerInfo = Tpointer.getPointer(e)

	    this.fCurrentRect.width  = pointerInfo.x - this.fCurrentRect.left
	    this.fCurrentRect.height = pointerInfo.y - this.fCurrentRect.top	    
	    
	    let selObjs = fModel.fPlanckWorld.intersectRect(this.fCurrentRect)

	    fModel.fSelectionList.replace(selObjs)
	    
	    console.log(selObjs)

	    
	}    
	this._selectionStarted = false
	this.fCurrectRect = {top: 0, left: 0, width: 0, height: 0}
    }

    draw(ctx)
    {
	super.draw(ctx)

	if (this._selectionStarted == true) {

	    let x1 = this.fCurrentRect.left
	    let y1 = this.fCurrentRect.top
	    let x2 = this.fCurrentRect.left + this.fCurrentRect.width
	    let y2 = this.fCurrentRect.top  + this.fCurrentRect.height

	    let w = this.fCurrentRect.width
	    let h = this.fCurrentRect.height

	    ctx.save()
	    
	    ctx.beginPath();
	    ctx.setLineDash([10, 10]);
	    ctx.moveTo(x1,y1);
	    ctx.lineTo(x1+w, y1)
	    ctx.lineTo(x1+w, y1+h)
	    ctx.lineTo(x1,   y1+h)
	    ctx.lineTo(x1,   y1)	    
	    ctx.stroke();

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

