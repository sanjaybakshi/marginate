
import Ttool          from "../libs/Ttool.js"
import Tpointer       from "../libs/Tpointer.js";
import TdrawUtils     from "../libs/TdrawUtils.js";
import Trect          from "../libs/Trect.js";

import Tdiv           from "../libs/Tdiv.js";
import Tmath          from "../libs/Tmath.js";
import TimageUtils    from "../libs/TimageUtils.js";

import TplanckJoint   from "../planck/TplanckJoint.js";

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

	this._wheel   = null
	this._body    = null
	this._wheelPt = null
	this._bodyPt  = null
	
	this._strokeStarted          = false
	this._moveWheelPivot_started = false
	this._moveBodyPivot_started  = false	
	
	this._jointType = TplanckJoint.eJointType.kMotor
    }

    setMotorMode()
    {
	this._jointType = TplanckJoint.eJointType.kMotor
    }

    setPrismaticMode()
    {
	this._jointType = TplanckJoint.eJointType.kPrismatic	
    }
    setDistanceMode()
    {
	this._jointType = TplanckJoint.eJointType.kDistance	
    }
    setRevoluteMode()
    {
	this._jointType = TplanckJoint.eJointType.kRevolute	
    }
     
    
    pointerDown(e)
    {
	super.pointerDown(e)

	let pointerInfo = Tpointer.getPointer(e)
	
	let x = pointerInfo.x
	let y = pointerInfo.y

	this.fJointGoDiv.hide()

	if (this._wheel != null && this._body!= null) {
	    if (TdrawUtils.isInsideCircle({x:x, y:y},
					  this._wheelPt,
					  this._circleManipSize)) {
		this._moveWheelPivot_started    = true
	    } else if (TdrawUtils.isInsideCircle({x:x, y:y},
					  this._bodyPt,
					  this._circleManipSize)) {
		this._moveBodyPivot_started    = true
	    }
	} else {
	    this._moveWheelPivot_started = false

	    // Draw a stroke to make the connection.
	    //
	    
	    // Check to see if the stroke was started inside a wheel.
	    //
	    let r = {left: pointerInfo.x, top: pointerInfo.y, width: 1, height: 1}	
	    let objs = fModel.fPlanckWorld.intersectRect(r)
	    if (objs.length > 0) {
		this._wheel = objs[0]

		this._wheelPt = this._wheel.getCenterInPixels()
		this._strokeStarted = true		
	    }
	}
    }

    pointerMove(e)
    {
	super.pointerMove(e)

	let pointerInfo = Tpointer.getPointer(e)	    
	let x = pointerInfo.x
	let y = pointerInfo.y


	if (this._moveWheelPivot_started) {
	    this._wheelPt = {x:x,y:y}
	} else if (this._moveBodyPivot_started) {
	    this._bodyPt = {x:x,y:y}	    
	} else if (this._strokeStarted) {

	    // Check to see if the stroke ends up in a valid body.
	    //
	    let r = {left: pointerInfo.x, top: pointerInfo.y, width: 1, height: 1}	
	    let objs = fModel.fPlanckWorld.intersectRect(r)
	    if (objs.length > 0 && objs[0] != this._wheel) {
		this._body = objs[0]

		this._bodyPt = this._body.getCenterInPixels()
	    } else {	    
		this._bodyPt = {x:pointerInfo.x,y:pointerInfo.y}
		this._body = null
	    }
	}	
    }

    pointerUp(e)
    {
	super.pointerUp(e)

	this._moveWheelPivot_started = false
	this._moveBodyPivot_started  = false
	this._strokeStarted          = false

	if (this._wheel != null && this._body != null) {
	    this.drawGoButton()
	}	
    }

    draw(ctx)
    {
	super.draw(ctx)


	
	let p1_Color = this._circleManipColor
	let p2_Color = this._circleManipColor

	ctx.save()

	// Draw the joint as a stroke...
	if (this._wheelPt != null &&
	    this._bodyPt  != null) {
	    ctx.beginPath()
	    ctx.lineWidth = 2
	    ctx.setLineDash([5,5])

	    if (this._body != null) {
		ctx.strokeStyle = 'yellow'
	    } else {
		ctx.strokeStyle = 'purple'
	    }
	    
	    ctx.moveTo(this._wheelPt.x, this._wheelPt.y)
	    ctx.lineTo(this._bodyPt.x, this._bodyPt.y)
	    ctx.stroke()
	}

	// Draw the pivot points.
	//
	if (this._wheel != null && this._body != null) {
	    // Draw the pivot point.
	    //
	    TdrawUtils.drawCircle(ctx, this._wheelPt,
				  this._circleManipSize,
				  p1_Color,
				  "black", 1)
	    TdrawUtils.drawCircle(ctx, this._bodyPt,
				  this._circleManipSize,
				  p1_Color,
				  "black", 1)
	}
	    
	    
	ctx.restore()
    }

    dismiss()
    {
	super.dismiss()
	this.fJointGoDiv.hide()

	this.fToolInfoDiv.hide()
    }

    engage()
    {
	super.engage()

	this._wheel   = null
	this._body    = null
	this._wheelPt = null
	this._bodyPt  = null
	this._moveWheelPivot_started = false
	this._moveBodyPivot_started  = false

	// Draw helpful message.
	//

	if (this._jointType == TplanckJoint.eJointType.kMotor) {
	    this.fToolInfoTxt._div.innerHTML = "Motor Joint: Draw a stroke from the wheel to the body."
	} else if (this._jointType == TplanckJoint.eJointType.kDistance) {
	    this.fToolInfoTxt._div.innerHTML = "Distance Joint: Draw a stroke from A to B."
	}

	// calculate middle.
	//
	this.fToolInfoDiv.show()
	let boundRect = this.fToolInfoDiv.getWidthHeight()
	let canvasRect = this.fCanvas.getWidthHeight()

	let xCoord = canvasRect.width/2 - boundRect.width/2
	let yCoord = 5
	let pos_wnd = this.fCanvas.canvasCoordsToWindow( {x: xCoord, y: yCoord} )
	this.fToolInfoDiv.showAt(pos_wnd)
	
    }

    drawGoButton()
    {
	// Draw it to the right of the wheel.
	//
	let posX = this._wheelPt.x + this._wheel._widthPixels/2
	let posY = this._wheelPt.y + this._wheel._heightPixels/2	

	//posX = posX + 10
	//posY = posY = 10

	let pos_wnd = this.fCanvas.canvasCoordsToWindow( {x: posX + 10,
							  y: posY + 10} )
	
	
	this.fJointGoDiv.showAt(pos_wnd)
    }
    
    
    makeJoint()
    {
	let newJointInfo = {}

	newJointInfo.jointType = this._jointType
	newJointInfo.obj1      = this._body
	newJointInfo.obj1Pos   = this._bodyPt
	    
	newJointInfo.obj2      = this._wheel
	newJointInfo.obj2Pos   = this._wheelPt

	fModel.addJoint(newJointInfo)

	this.engage()
    }

}

export default TjointTool

