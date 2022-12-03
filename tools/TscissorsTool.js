
import Ttool          from "../libs/Ttool.js"
import Tpointer       from "../libs/Tpointer.js";
import TdrawUtils     from "../libs/TdrawUtils.js";
import Trect          from "../libs/Trect.js";

import Tdiv           from "../libs/Tdiv.js";
import Tmath          from "../libs/Tmath.js";
import TimageUtils    from "../libs/TimageUtils.js";

import TplanckObject  from "../planck/TplanckObject.js";

import { fModel }     from '../TmarginateModel.js'


class TscissorsTool extends Ttool
{
    constructor(canvas)
    {
	super(canvas)

	this.gScissorsGoDivId        = "scissors.GoDivId"
	this.gScissorsGoBtnId        = "scissors.GoBtnId"	

	this.fScissorsGoDiv          = new Tdiv(this.gScissorsGoDivId)
	this.fScissorsGoBtn          = new Tdiv(this.gScissorsGoBtnId)

	this.fScissorsGoBtn._div.addEventListener('pointerdown', (e) => {
	    this.executeCut()
	});
    

	
	this._posManipDefaultColor   = 'red'
	this._posManipColor          = this._posManipDefaultColor
	this._posManipMoveColor      = 'yellow'
	this._circleManipSize        = 10

	this._manipSizeW       = 10
	this._manipSizeH       = 5	
	this._xOffset          = 0
	this._yOffset	       = 0


	this._horizontalMode   = true
	
	this._objRect = null

    }

    
    pointerDown(e)
    {
	super.pointerDown(e)

	if (this._objRect != null) {
	    
	    let pointerInfo = Tpointer.getPointer(e)
	    
	    let x = pointerInfo.x
	    let y = pointerInfo.y

	    let vertTarget = Trect.constructFromCenterWidthHeight(this.verticalManipPosition(),
								  this._manipSizeW,
								  this._manipSizeH)
	    
		
	    if (TdrawUtils.isInsideCircle({x:x, y:y},
					  this.circleManipPosition(),
					  this._circleManipSize)) {
		this._posManipColor = this._posManipMoveColor
		this._translateStarted = true

		this._horizontalMode = true
		
	    } else if (vertTarget.isInside({x:x, y:y})) {
		this._posManipColor = this._posManipMoveColor
		this._translateStarted = true

		this._horizontalMode = false
	    }
	}
    }

    pointerMove(e)
    {
	super.pointerMove(e)

	if (this._objRect != null) {

	    let pointerInfo = Tpointer.getPointer(e)	    
	    let x = pointerInfo.x
	    let y = pointerInfo.y
	    
	    if (this._translateStarted) {

		if (this._horizontalMode) {
		    if (y < this._objRect._y1) {
			y = this._objRect._y1
		    } else if (y > this._objRect._y2) {
			y = this._objRect._y2
		    }
		    this._yOffset = y - this._objRect.center().y
		} else {
		    if (x < this._objRect._x1) {
			x = this._objRect._x1
		    } else if (x > this._objRect._x2) {
			x = this._objRect._x2
		    }
		    this._xOffset = x - this._objRect.center().x

		}
	    }
	}

    }

    async pointerUp(e)
    {
	super.pointerUp(e)

	this._posManipColor    = this._posManipDefaultColor
	this._translateStarted = false

	
    }

    draw(ctx)
    {
	super.draw(ctx)

	if (fModel.fSelectionList._sList.length > 0) {

	    let obj = fModel.fSelectionList._sList[0]

	    ctx.save()


	    // Draw a horizontal cut line.
	    //

	    if (this._horizontalMode == true) {
		ctx.beginPath()
		ctx.lineWidth = 2
		ctx.strokeStyle = 'purple'
	    
		ctx.beginPath()
		ctx.moveTo(this._objRect._x1, this._objRect.center().y + this._yOffset)
		ctx.lineTo(this._objRect._x2, this._objRect.center().y + this._yOffset)
		ctx.stroke()
	    } else {
		// Draw a vertical cut line.
		//
		ctx.beginPath()
		ctx.lineWidth = 1
		ctx.strokeStyle = 'purple'
		
		ctx.beginPath()
		ctx.moveTo(this._objRect.center().x + this._xOffset, this._objRect._y1)
		ctx.lineTo(this._objRect.center().x + this._xOffset, this._objRect._y2)
		ctx.stroke()
	    }

		
	    TdrawUtils.drawCircle(ctx, this.circleManipPosition(),
				  this._circleManipSize,
				  this._posManipColor,
				  "black", 1)
	    

	    
	    TdrawUtils.drawTriangle(ctx, this.verticalManipPosition(),
				    this._manipSizeW,
				    this._manipSizeH,
				    "south",
				    this._posManipColor,
				    "black", 1)

	    

	    // Draw a dashed line around the selected objects.
	    //
	    
	    this._objRect.drawDashed(ctx)
	    
	    //TdrawUtils.drawRect(ctx, this._objRect.center(), this._objRect.width(), this._objRect.height())

	    
	    ctx.restore()
	}
    }

    dismiss()
    {
	super.dismiss()

	console.log("dismissing")

	this.fScissorsGoDiv.hide()
	this._objRect = null
    }

    engage()
    {
	super.engage()

	
	this._objRect = null
	console.log("engaging")

	if (fModel.fSelectionList._sList.length > 0) {

	    let obj = fModel.fSelectionList._sList[0]

	    let center = obj.getCenterInPixels()
	    let width  = obj.widthInPixels()
	    let height = obj.heightInPixels()

	    this._objRect = Trect.constructFromCenterWidthHeight(center,width,height)

	    
	    for (const obj of fModel.fSelectionList._sList) {
		let rect = Trect.constructFromCenterWidthHeight(obj.getCenterInPixels(),
								obj.widthInPixels(),
								obj.heightInPixels())
		
		this._objRect = this._objRect.union(rect)

	    }

	    this._yOffset = 0

	    // Convert canvas coordinates to window coordinates.
	    //

	    console.log(this.fCanvas)
	    
	    let pos_wnd = this.fCanvas.canvasCoordsToWindow( {x: this._objRect._x2,
							      y: this._objRect._y2} )
	    this.fScissorsGoDiv.showAt(pos_wnd)

	}	
    }

    executeCut()
    {
	let center = this._objRect.center()
	let yPos   = center.y + this._yOffset
	let xPos   = center.x + this._xOffset


	let newObjInfo = []
	//
	// This will be an array of objects that have the info
	// .rect = rectangle that describes the crop
	// .obj  = the source object to crop from
	// .dict = a dictionary that can be used to create the object (Tmodel.addObject)
	//

	
	for (const obj of fModel.fSelectionList._sList) {

	    let r = Trect.constructFromCenterWidthHeight(obj.getCenterInPixels(),
							 obj.widthInPixels(),
							 obj.heightInPixels())
	    
	    if (this._horizontalMode) {
		// Check to see if this box can be split by this xPos.
		//		
		if (r.isInside({x:obj.getCenterInPixels().x, y: yPos})) {
		    let hRects = this.computeHorizontalCutRects(obj,yPos)

		    for (const h of hRects) {
			let newObjRect = {rect: h, obj: obj}
			newObjInfo.push(newObjRect)
		    }
		}
	    } else {
		// Check to see if this box can be split by this yPos.
		//
		if (r.isInside({x: xPos, y: obj.getCenterInPixels().y})) {
		    
		    let vRects = this.computeVerticalCutRects(obj, xPos)

		    for (const v of vRects) {
			let newObjRect = {rect: v, obj: obj}
			newObjInfo.push(newObjRect)
		    }
		}
	    }
	}


	
	// Compute dictionaries that will describe the objects to create.
	//
	for (const o of newObjInfo) {
	    let d = this.addObjectDictionary(o.obj, o.rect)
	    o.dict = d
	}

	// add the objects.
	//
	const dictArray = []
	newObjInfo.forEach(object => {
	    dictArray.push(object.dict)
	});
	
	fModel.addObjects(dictArray)

	
	// Remove the objects that were split.
	//
	const DelObjList = []

	newObjInfo.forEach(object => {
	    if (!DelObjList.includes(object.obj)) {
		DelObjList.push(object.obj)
	    };
	});
	for (const obj of DelObjList) {
	    fModel.removeObject(obj)
	}
	
	this.engage()
    }


    
    circleManipPosition()
    {
	return {x:this._objRect._x1,
		y:this._objRect.center().y + this._yOffset}
    }

    verticalManipPosition()
    {
	return {x: this._objRect.center().x + this._xOffset,
		y: this._objRect._y1 - this._manipSizeH}
    }



    computeHorizontalCutRects(obj, yPos)
    //
    // Description:
    //		Do a cut along the x-axis.
    //
    //		+-----------+
    //		|	    |
    //        x---------------x
    //		|	    |
    //		+-----------+
    {
	// Have to make 2 boxes from: top rect and bottom rect.
	//

	let objRect = Trect.constructFromCenterWidthHeight(obj.getCenterInPixels(),
							   obj.widthInPixels(),
							   obj.heightInPixels())
	
	let topRect = Trect.constructFromCoords({x1: objRect._x1,
						 y1: objRect._y1,
						 x2: objRect._x2,
						 y2: yPos})
	let botRect = Trect.constructFromCoords({x1: objRect._x1,
						 y1: yPos,
						 x2: objRect._x2,
						 y2: objRect._y2})
	return [topRect, botRect]
    }

    computeVerticalCutRects(obj, xPos)
    //
    // Description:
    //		Do a cut along the y-axis.
    //
    //              x
    //              |
    //		+-----------+
    //		|   |	    |
    //		|   |	    |
    //		|   |	    |
    //		+-----------+
    //              |
    //              x
    {
	// Have to make 2 boxes from: left rect and right rect.
	//
	let objRect = Trect.constructFromCenterWidthHeight(obj.getCenterInPixels(),
							   obj.widthInPixels(),
							   obj.heightInPixels())

	let leftRect = Trect.constructFromCoords({x1: objRect._x1,
						  y1: objRect._y1,
						  x2: xPos,
						  y2: objRect._y2})
	let rightRect = Trect.constructFromCoords({x1: xPos,
						   y1: objRect._y1,
						   x2: objRect._x2,
						   y2: objRect._y2})

	return [leftRect, rightRect]
    }
    
    addObjectDictionary(obj, r)
    //
    // Description:
    //	   Return the dictionary that can be used in Tmodel.addObject.
    //
    {
	let center = r.center()
	let width  = r.width()
	let height = r.height()

	let d = null
	
	// Only make the box if it's big enough.
	//
	if (width > 5 && height > 5) {

	    let objRect = Trect.constructFromCenterWidthHeight(obj.getCenterInPixels(),
							       obj.widthInPixels(),
							       obj.heightInPixels())

	    
	    d = {center: center,
		 width: width,
		 height: height,
		 currentFrame: fModel.getCurrentFrame(),
		 objType: TplanckObject.eObjectType.kRectangle}

	    if (obj.sprite().hasImage()) {

		let objSpriteImg = obj.sprite().image()
		
		let cropRect_imgSpace =
		    Trect.constructFromCoords({x1: Tmath.remap(objRect._x1, objRect._x2,
							       0, objSpriteImg.width,
							       r._x1),
					       y1: Tmath.remap(objRect._y1, objRect._y2,
							       0, objSpriteImg.height,
							       r._y1),
					       x2: Tmath.remap(objRect._x1, objRect._x2,
							       0, objSpriteImg.width,
							       r._x2),
					       y2: Tmath.remap(objRect._y1, objRect._y2,
							       0, objSpriteImg.height,
							       r._y2)})

		let croppedImage = TimageUtils.crop(objSpriteImg,
						    cropRect_imgSpace)
		d.sprite = croppedImage

	    }
	}

	return d
    }
}

export default TscissorsTool

