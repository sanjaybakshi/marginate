import Ttool          from "../libs/Ttool.js"
import Tpointer       from "../libs/Tpointer.js";
import TdrawUtils     from "../libs/TdrawUtils.js";

import TplanckObject  from "../planck/TplanckObject.js";

import { fModel } from '../TmarginateModel.js'


class TxformTool extends Ttool
{
    constructor(canvas)
    {
	super(canvas)

	this._boxManipSize     = 20

	this._boxManipDefColor  = 'red'
	this._boxManipMoveColor = 'yellow'

	this._boxManipColor    = this._boxManipDefColor

	this._scaleManipColor  = 'purple'
	this._scaleManipSize   = 20
	this._scaleManipOffset = 50
	this._translateStarted = false
	this._scaleStarted  = false

	this._mouseDownPos = {x:0, y:0}
	this._widthStart  = 0
	this._heightStart = 0
	
	this._scaleManipTarget_1 = {x:-this._scaleManipOffset,y:  this._scaleManipOffset}
	this._scaleManipTarget_2 = {x: this._scaleManipOffset,y: -this._scaleManipOffset}


    }

    
    pointerDown(e)
    {
	super.pointerDown(e)

	if (fModel.fSelectionList._sList.length > 0) {

	    let obj = fModel.fSelectionList._sList[0]
	    let center = obj.getCenterInPixels()

	    let pointerInfo = Tpointer.getPointer(e)
	    this._mouseDownPos = {x: pointerInfo.x, y: pointerInfo.y}

	    this._widthStart  = obj.widthInPixels()
	    this._heightStart = obj.heightInPixels()
	    
	    if (TdrawUtils.isInsideRect({x:pointerInfo.x,y:pointerInfo.y}, center,
					this._boxManipSize, this._boxManipSize)) {
		this._boxManipColor = this._boxManipMoveColor
		this._translateStarted = true
	    } else {

		let scalePos1 = {x: center.x + this._scaleManipTarget_1.x,
				 y: center.y + this._scaleManipTarget_1.y}	    
		if (TdrawUtils.isInsideRect({x:pointerInfo.x,y:pointerInfo.y}, scalePos1, this._scaleManipSize, this._scaleManipSize)) {
		    this._scaleStarted = true
		}
	    }	    
	}
    }

    pointerMove(e)
    {
	super.pointerMove(e)

	if (fModel.fSelectionList._sList.length > 0) {
	    let obj = fModel.fSelectionList._sList[0]	    
	    let center = obj.getCenterInPixels()	    
	    let pointerInfo = Tpointer.getPointer(e)
	    
	    if (this._translateStarted) {
		obj.setPosition( {x:pointerInfo.x, y: pointerInfo.y} )
	    } else if (this._scaleStarted) {

		let scaleVec = {x: pointerInfo.x - this._mouseDownPos.x,
				y: pointerInfo.y - this._mouseDownPos.y}

		let scaleAmt = Math.sqrt(scaleVec.x*scaleVec.x + scaleVec.y*scaleVec.y)
		if (scaleVec.x > 0) {
		    scaleAmt = Tmath.remap(0, 100, 1, 0.01, scaleAmt)

		} else {
		    scaleAmt = Tmath.remap(0, 100, 1, 10, scaleAmt)
		}

		let w = this._widthStart  * scaleAmt
		let h = this._heightStart * scaleAmt

		obj.resize(w, h)
		
	    }
	}	
    }

    async pointerUp(e)
    {
	super.pointerUp(e)

	this._boxManipColor = this._boxManipDefColor
	this._translateStarted = false
	this._scaleStarted = false
	
    }

    draw(ctx)
    {
	super.draw(ctx)

	if (fModel.fSelectionList._sList.length > 0) {

	    let obj = fModel.fSelectionList._sList[0]

	    let center = obj.getCenterInPixels()

	    ctx.save()

	    
	    ctx.lineWidth = 1.5;

	    ctx.strokeStyle = 'blue';
	    ctx.beginPath();
	    ctx.moveTo(center.x, center.y);
	    ctx.lineTo(center.x + 100, center.y)
	    ctx.stroke();	

	    ctx.strokeStyle = 'green';
	    ctx.beginPath();
	    ctx.moveTo(center.x, center.y);
	    ctx.lineTo(center.x, center.y - 100)
	    ctx.stroke();

	    TdrawUtils.fillRect(ctx, center, this._boxManipSize, this._boxManipSize, this._boxManipColor)


	    let scalePos1 = {x: center.x + this._scaleManipTarget_1.x,
			     y: center.y + this._scaleManipTarget_1.y}	    
	    TdrawUtils.fillRect(ctx, scalePos1, this._scaleManipSize, this._scaleManipSize, this._scaleManipColor)

	    let scalePos2 = {x: center.x + this._scaleManipTarget_2.x,
			     y: center.y + this._scaleManipTarget_2.y}	    
	    TdrawUtils.fillRect(ctx, scalePos2, this._scaleManipSize, this._scaleManipSize, this._scaleManipColor)


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

export default TxformTool

