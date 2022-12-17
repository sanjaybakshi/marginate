
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
	
	this._p1 = {x:40,y:40}
	this._p2 = {x:60,y:60}

	this._moveP1_started   = false
	this._moveP2_started   = false
	this._intersectedObjP1 = null
	this._intersectedObjP2 = null
    }

    
    pointerDown(e)
    {
	super.pointerDown(e)

	let pointerInfo = Tpointer.getPointer(e)
	
	let x = pointerInfo.x
	let y = pointerInfo.y

	this.fJointGoDiv.hide()
	
	if (TdrawUtils.isInsideCircle({x:x, y:y},
				      this._p1,
				      this._circleManipSize)) {
	    this._moveP1_started = true
	    this._moveP2_started = false

	} else if (TdrawUtils.isInsideCircle({x:x, y:y},
					     this._p2,
					     this._circleManipSize)) {
	    this._moveP1_started = false
	    this._moveP2_started = true
	} else {
	    this._moveP1_started = false
	    this._moveP2_started = false

	    this._intersectedObjP1 = null	    
	    this._intersectedObjP2 = null	    
	}
    }

    pointerMove(e)
    {
	super.pointerMove(e)

	let pointerInfo = Tpointer.getPointer(e)	    
	let x = pointerInfo.x
	let y = pointerInfo.y
	
	if (this._moveP1_started) {
	    this._p1 = {x:x,y:y}	    
	} else if (this._moveP2_started) {
	    this._p2 = {x:x,y:y}
	}
    }

    pointerUp(e)
    {
	super.pointerUp(e)

	this._moveP1_started = false
	this._moveP2_started = false

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
	
	if (this._moveP1_started) {
	    p1_Color = this._selCircleManipColor
	} else if (this._moveP2_started) {
	    p2_Color = this._selCircleManipColor
	}

	ctx.save()
	
	TdrawUtils.drawCircle(ctx, this._p1,
			      this._circleManipSize,
			      p1_Color,
			      "black", 1)
	TdrawUtils.drawCircle(ctx, this._p2,
			      this._circleManipSize,
			      p2_Color,
			      "black", 1)

	ctx.beginPath()
	ctx.lineWidth = 2
	ctx.strokeStyle = 'purple'
	    
	ctx.moveTo(this._p1.x, this._p1.y)
	ctx.lineTo(this._p2.x, this._p2.y)
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

	this._moveP1_started   = false
	this._moveP2_started   = false
	this._intersectedObjP1 = null
	this._intersectedObjP2 = null

	this._p1 = {x:40,y:40}
	this._p2 = {x:60,y:60}

	if (this.canDrawGoButton()) {
	    this.drawGoButton()
	} else {
	    this.fJointGoDiv.hide()
	}	
    }

    canDrawGoButton()
    {
	this._intersectedObjP1 = null
	this._intersectedObjP2 = null
	
	let r = {left: this._p1.x, top: this._p1.y, width: 1, height: 1}	
	let objs = fModel.fPlanckWorld.intersectRect(r)
	if (objs.length > 0) {
	    this._intersectedObjP1 = objs[0]
	}

	r = {left: this._p2.x, top: this._p2.y, width: 1, height: 1}
	objs = fModel.fPlanckWorld.intersectRect(r)
	if (objs.length > 0) {
	    this._intersectedObjP2 = objs[0]
	}

	if (this._intersectedObjP1 != null && this._intersectedObjP2 != null) {
	    return true
	}

	return false	
    }
    
    drawGoButton()
    {
	// make a rect from the 2 points and position the go button
	// in the lower right.
	//
	let boundRect = Trect.constructFromPoints([this._p1,this._p2])
	let pos_wnd = this.fCanvas.canvasCoordsToWindow( {x: boundRect._x2,
							  y: boundRect._y2 + 20} )
	
	this.fJointGoDiv.showAt(pos_wnd)
    }

    
    makeJoint()
    {
	console.log("makeJoint")

	let newJointInfo = {}
	//
	//

	newJointInfo.obj1    = this._intersectedObjP1
	newJointInfo.obj1Pos = this._p1

	newJointInfo.obj2    = this._intersectedObjP2
	newJointInfo.obj2Pos = this._p2

	fModel.addJoint(newJointInfo)
	
	this.engage()
    }

}

export default TjointTool

