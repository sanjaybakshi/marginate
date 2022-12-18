
import Ttool          from "../libs/Ttool.js"
import Tpointer       from "../libs/Tpointer.js";
import TdrawUtils     from "../libs/TdrawUtils.js";
import Trect          from "../libs/Trect.js";

import Tdiv           from "../libs/Tdiv.js";
import Tmath          from "../libs/Tmath.js";
import TimageUtils    from "../libs/TimageUtils.js";

import TplanckObject  from "../planck/TplanckObject.js";

import { fModel }     from '../TmarginateModel.js'


class TjointTool extends Ttool
{
    constructor(canvas)
    {
	super(canvas)

	this.gJointGoDivId        = "joint.GoDivId"
	this.gJointGoBtnId        = "joint.GoBtnId"	

	this.fJointGoDiv          = new Tdiv(this.gJointGoDivId)
	this.fJointGoBtn          = new Tdiv(this.gJointGoBtnId)

	this.fJointGoBtn._div.addEventListener('pointerdown', (e) => {
	    this.makeJoint()
	});

	this._circleManipSize     = 5
	this._circleManipColor    = 'blue'
	this._selCircleManipColor = 'red'


	this._obj1                   = null
	this._objPt1                 = {x:100,y:90}
	this._anchorPt1              = {x:100,y:130}
	this._move_objPt1_started    = false
	this._move_anchorPt1_started = false	

	this._obj2                   = null
	this._objPt2                 = {x:200,y:90}
	this._anchorPt2              = {x:200,y:130}
	this._move_objPt2_started    = false
	this._move_anchorPt2_started = false	
    }

    
    pointerDown(e)
    {
	super.pointerDown(e)

	let pointerInfo = Tpointer.getPointer(e)
	
	let x = pointerInfo.x
	let y = pointerInfo.y

	this.fJointGoDiv.hide()

	if (TdrawUtils.isInsideCircle({x:x, y:y},
				      this._objPt1,
				      this._circleManipSize)) {
	    this._move_objPt1_started    = true
	    this._move_objPt2_started    = false
	    this._move_anchorPt1_started = false
	    this._move_anchorPt2_started = false	    	    
	} else if (TdrawUtils.isInsideCircle({x:x, y:y},
					     this._objPt2,
					     this._circleManipSize)) {
	    this._move_objPt1_started    = false
	    this._move_objPt2_started    = true
	    this._move_anchorPt1_started = false
	    this._move_anchorPt2_started = false	    	    
	} else if (TdrawUtils.isInsideCircle({x:x, y:y},
					     this._anchorPt1,
					     this._circleManipSize)) {
	    this._move_objPt1_started    = false
	    this._move_objPt2_started    = false
	    this._move_anchorPt1_started = true
	    this._move_anchorPt2_started = false
	}  else if (TdrawUtils.isInsideCircle({x:x, y:y},
					     this._anchorPt2,
					     this._circleManipSize)) {
	    this._move_objPt1_started    = false
	    this._move_objPt2_started    = false
	    this._move_anchorPt1_started = false
	    this._move_anchorPt2_started = true
	} else {
	    this._move_objPt1_started    = false
	    this._move_objPt2_started    = false
	    this._move_anchorPt1_started = false
	    this._move_anchorPt2_started = false

	    this._obj1                   = null
	    this._obj2                   = null
	}
    }

    pointerMove(e)
    {
	super.pointerMove(e)

	let pointerInfo = Tpointer.getPointer(e)	    
	let x = pointerInfo.x
	let y = pointerInfo.y
	
	if (this._move_objPt1_started) {
	    this._objPt1 = {x:x,y:y}	    
	} else if (this._move_objPt2_started) {
	    this._objPt2 = {x:x,y:y}
	} else if (this._move_anchorPt1_started) {
	    this._anchorPt1 = {x:x,y:y}
	} else if (this._move_anchorPt2_started) {
	    this._anchorPt2 = {x:x,y:y}
	}
    }

    pointerUp(e)
    {
	super.pointerUp(e)

	this._move_objPt1_started    = false
	this._move_objPt2_started    = false
	this._move_anchorPt1_started = false
	this._move_anchorPt2_started = false

	if (this.canDrawGoButton()) {
	    this.drawGoButton()
	} else {
	    this.fJointGoDiv.hide()
	}	
    }

    draw(ctx)
    {
	super.draw(ctx)

	let p1_Color = this._circleManipColor
	let p2_Color = this._circleManipColor

	ctx.save()

	// Draw the ui for building a joint.
	//
	TdrawUtils.drawCircle(ctx, this._objPt1,
			      this._circleManipSize,
			      p1_Color,
			      "black", 1)

	TdrawUtils.drawCircle(ctx, this._anchorPt1,
			      this._circleManipSize,
			      p1_Color,
			      "black", 1)

	ctx.beginPath()
	ctx.lineWidth = 2
	ctx.strokeStyle = 'purple'
	    
	ctx.moveTo(this._objPt1.x, this._objPt1.y)
	ctx.lineTo(this._anchorPt1.x, this._anchorPt1.y)
	ctx.stroke()

	
	TdrawUtils.drawCircle(ctx, this._objPt2,
			      this._circleManipSize,
			      p2_Color,
			      "black", 1)

	TdrawUtils.drawCircle(ctx, this._anchorPt2,
			      this._circleManipSize,
			      p2_Color,
			      "black", 1)

	ctx.beginPath()
	ctx.lineWidth = 2
	ctx.strokeStyle = 'purple'
	    
	ctx.moveTo(this._objPt2.x, this._objPt2.y)
	ctx.lineTo(this._anchorPt2.x, this._anchorPt2.y)
	ctx.stroke()


	ctx.beginPath()
	ctx.lineWidth = 2
	ctx.setLineDash([5,5])
	ctx.strokeStyle = 'purple'
	    
	ctx.moveTo(this._anchorPt1.x, this._anchorPt1.y)
	ctx.lineTo(this._anchorPt2.x, this._anchorPt2.y)
	ctx.stroke()
	
	ctx.restore()
    }

    dismiss()
    {
	super.dismiss()
	this.fJointGoDiv.hide()
    }

    engage()
    {
	super.engage()

	
	this._obj1                   = null
	//this._objPt1                 = {x:100,y:90}
	//this._anchorPt1              = {x:100,y:130}
	this._move_objPt1_started    = false
	this._move_anchorPt1_started = false	

	this._obj2                   = null
	//this._objPt2                 = {x:200,y:90}
	//this._anchorPt2              = {x:200,y:130}
	this._move_objPt2_started    = false
	this._move_anchorPt2_started = false	

	if (this.canDrawGoButton()) {
	    this.drawGoButton()
	} else {
	    this.fJointGoDiv.hide()
	}	
    }

    canDrawGoButton()
    {
	this._obj1 = null
	this._obj2 = null
	
	let r = {left: this._objPt1.x, top: this._objPt1.y, width: 1, height: 1}	
	let objs = fModel.fPlanckWorld.intersectRect(r)
	if (objs.length > 0) {
	    this._obj1 = objs[0]
	}

	r = {left: this._objPt2.x, top: this._objPt2.y, width: 1, height: 1}
	objs = fModel.fPlanckWorld.intersectRect(r)
	if (objs.length > 0) {
	    this._obj2 = objs[0]
	}

	if (this._obj1 != null && this._obj2 != null) {
	    return true
	}

	return false	
    }
    
    drawGoButton()
    {
	// make a rect from the 2 points and position the go button
	// in the lower right.
	//
	let boundRect = Trect.constructFromPoints([this._anchorPt1, this._anchorPt2])
	let pos_wnd = this.fCanvas.canvasCoordsToWindow( {x: boundRect._x2,
							  y: boundRect._y2 + 20} )
	
	this.fJointGoDiv.showAt(pos_wnd)
    }

    
    makeJoint()
    {
	let newJointInfo = {}
	//
	//

	newJointInfo.obj1    = this._obj1
	newJointInfo.obj1Pos = this._anchorPt1

	newJointInfo.obj2    = this._obj2
	newJointInfo.obj2Pos = this._anchorPt2

	fModel.addJoint(newJointInfo)
	
	this.engage()
    }

}

export default TjointTool

