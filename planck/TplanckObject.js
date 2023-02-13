import TplanckBase  from "./TplanckBase.js";
import TplanckWorld from "./TplanckWorld.js";
import Tmath        from "../libs/Tmath.js";
import Trect        from "../libs/Trect.js";
import TimageUtils  from "../libs/TimageUtils.js";


class TplanckObject extends TplanckBase
{
    _widthPixels;
    _heightPixels;
    _existanceStart;
    _isActive;
    _isDynamic;
    _activateOnCollision;
    
    _body_b2d    
    _sprite;
    _showSprite;
    _showBorder;    

    static eObjectType = {
	kRectangle : 0,
	kCircle    : 1,
	kEdge      : 2
    }

    _objType;

    _uid;
    
    constructor(objDict, id)
    {
	super(objDict, id)
	
	this.dict2obj(objDict, true)
	this._uid = id
    }

    editObject(objDict)
    {
	this.dict2obj(objDict, false)
    }

    sprite()
    {
	return this._sprite
    }

    setPosition(newPos)
    {
	this._v_pixels = planck.Vec2(newPos.x, newPos.y)
	let v_world = TplanckWorld.pixels2world_vec(this._v_pixels) 
	this._body_b2d.setPosition(v_world)
    }

    isDynamic()
    {
	return this._isDynamic
    }

    setStatic()
    {
	this._isDynamic = false
	
	if (this._body_b2d != null) {
	    this._body_b2d.setStatic()
	}
    }
    
    setDynamic()
    {
	this._isDynamic = true
	
	if (this._body_b2d != null) {
	    this._body_b2d.setDynamic()
	}
    }


    isActive()
    {
	return this._isActive
    }

    setActive()
    {
	this._isActive = true
	
	if (this._body_b2d != null) {
	    this._body_b2d.setActive(true)
	}
    }
    
    setInActive()
    {
	this._isActive = false
	
	if (this._body_b2d != null) {
	    this._body_b2d.setActive(false)
	}
    }
    
    setActivateOnCollision(activatedState)
    //
    // Description:
    //	   ActivatedOnCollision means that it has experienced at least one collision and then responds to gravity.
    //
    {
	this._activateOnCollision = activatedState
    }
    
    isActivatedOnCollision()
    {
	return this._activateOnCollision
    }

    isShowingSprite()
    {
	return this._showSprite
    }

    isShowingBorder()
    {
	return this._showBorder
    }

    setShowSprite(v)
    {
	this._showSprite = v
    }

    setShowBorder(v)
    {
	this._showBorder = v
    }
    
    removeFromSimulation()
    {
	super.removeFromSimulation()
	this._body_b2d = null
    }

    isBeingSimulated()
    {
	super.isBeingSimulated()
	return this._body_b2d != null
    }
    
    addToSimulation(world)
    {
	let body = world.createBody();

	if (this._isDynamic) {
	    body.setDynamic()
	} else {
	    body.setStatic()
	}

	
	if (this._isActive) {
	    body.setActive(true)
	} else {
	    body.setActive(false)
	}

	let v_world  = TplanckWorld.pixels2world_vec(this._v_pixels) 
	body.setPosition(v_world)

	let shape = null

	if (this._objType === TplanckObject.eObjectType.kRectangle) {
	    shape = planck.Box(this._widthWorld/2, this._heightWorld/2);
	} else 	if (this._objType === TplanckObject.eObjectType.kCircle) {
	    // assumed that width/height are equal.
	    //
	    shape = planck.Circle(this._widthWorld/2);
	} else 	if (this._objType === TplanckObject.eObjectType.kEdge) {
	    // assumed that width/height are equal.
	    //
	    shape = planck.Edge(this._widthWorld/2);

	    console.log("adding an edge.")
	}
	
	body.createFixture(shape, 1.0);

	// time to set mass information
        body.setMassData({
	    mass: 5,
	    center: planck.Vec2(),
		
	    // I have to say I do not know the meaning of this "I", but if you set it to zero, bodies won't rotate
	    I: 1
	});
	
	if (this.isActivatedOnCollision()) {
	    body.setGravityScale(0.0)
	} else {
	    body.setGravityScale(1.0)
	}
	    
	// Point the box2d object back at Tbox
	//
	body.setUserData(this)
	    
	this._body_b2d = body	    
    }

    
    draw(ctx, paused, annotated=false)
    {
	super.draw(ctx, paused, annotated)
	
	let pos_world = this._body_b2d.getPosition();
	let rot       = this._body_b2d.getAngle();
	let pos_pixels = TplanckWorld.world2pixels_vec(pos_world)

	ctx.save()


	if (this._sprite != null && this._showSprite == true) {
	    ctx.save()
	    ctx.translate(pos_pixels.x,pos_pixels.y)
	    ctx.rotate(-rot)

	    ctx.drawImage(this._sprite,
			  0,0,
			  this._sprite.width,
			  this._sprite.height,
			  
			  Math.floor(-this._widthPixels  / 2),
			  Math.floor(-this._heightPixels / 2),
			  this._widthPixels,
			  this._heightPixels
			 );

	    ctx.restore()
	    

	}

	if (this._showBorder == true) {
	    ctx.beginPath();

	    if (this.isDynamic()) {
		ctx.strokeStyle = 'black';
	    } else {
		ctx.strokeStyle = 'grey';	    
	    }

	    if (annotated == true) {
		ctx.strokeStyle = 'red';	    
	    }

	    if (!paused) {
		if (this._objType === TplanckObject.eObjectType.kRectangle) {	    
		    this.drawRect(ctx, pos_pixels, rot);
		} else if (this._objType === TplanckObject.eObjectType.kCircle) {
		    this.drawCircle(ctx, pos_pixels, rot);
		} else if (this._objType === TplanckObject.eObjectType.kEdge) {
		    this.drawEdge(ctx, pos_pixels, rot);
		}
	    } else {
		if (this._objType === TplanckObject.eObjectType.kRectangle) {	    
		    this.drawRect(ctx, pos_pixels, rot);
		} else if (this._objType === TplanckObject.eObjectType.kCircle) {
		    this.drawCircle(ctx, pos_pixels, rot);
		} else if (this._objType === TplanckObject.eObjectType.kEdge) {
		    this.drawEdge(ctx, pos_pixels, rot);
		}
	    }
	}

	ctx.restore()
	
    }

    

    drawRect(ctx, p_pixels, angle)
    {
	let xformMat = Tmath.xformMatrix(-angle, [p_pixels.x, p_pixels.y])

	let p0 = [-this._widthPixels/2, -this._heightPixels/2]
	let p1 = [-this._widthPixels/2,  this._heightPixels/2]
	let p2 = [ this._widthPixels/2,  this._heightPixels/2]
	let p3 = [ this._widthPixels/2, -this._heightPixels/2]
	
	p0 = Tmath.xformPoint(p0, xformMat)
	p1 = Tmath.xformPoint(p1, xformMat)
	p2 = Tmath.xformPoint(p2, xformMat)
	p3 = Tmath.xformPoint(p3, xformMat)    
	
    
	ctx.beginPath();
	ctx.moveTo(p0[0], p0[1]);
	ctx.lineTo(p1[0], p1[1]);
	ctx.lineTo(p2[0], p2[1]);
	ctx.lineTo(p3[0], p3[1]);
	ctx.lineTo(p0[0], p0[1]);    
	ctx.stroke();	
    }

    drawCircle(ctx, p_pixels, angle)
    {	
	let xformMat = Tmath.xformMatrix(-angle, [p_pixels.x, p_pixels.y])

	let p = [0,0]
	p = Tmath.xformPoint(p, xformMat)

	ctx.beginPath();
	ctx.arc(p[0],p[1],this._widthPixels/2,0,2*Math.PI);
	ctx.stroke();	
    }

    drawEdge(ctx, p_pixels, angle)
    {	
	let xformMat = Tmath.xformMatrix(-angle, [p_pixels.x, p_pixels.y])

	let p = [0,0]
	p = Tmath.xformPoint(p, xformMat)

	ctx.beginPath();
	//ctx.arc(p[0],p[1],this._widthPixels/2,0,2*Math.PI);
	ctx.stroke();	
    }
    
    getCenterInPixels()
    {
	// Probably should rotate the object and then find the center but
	// this is simpler for now.
	//
	let pos_world  = this._body_b2d.getPosition();
	let pos_pixels = TplanckWorld.world2pixels_vec(pos_world)
	
	let xCenter = pos_pixels.x
	let yCenter = pos_pixels.y
	
	return {x:xCenter, y:yCenter}
    }

    widthInPixels()
    {
	return this._widthPixels
    }
    
    heightInPixels()
    {
	return this._heightPixels
    }
    


    intersectRect(rectPixelSpace)
    //
    // Description:
    //	    Tests if the object is in the rectangle.
    //

    {
	if (this.isActive()) {

	    // loop through all fixtures

	    let found = false
            for (let fixture = this._body_b2d.getFixtureList(); fixture; fixture = fixture.getNext()) {
		let shape = fixture.getShape();

		let numChildren = shape.getChildCount()
		
		for (let i=0; i < numChildren && !found; i++) {
		    
		    let aabb = fixture.getAABB(i)

		    // This is tricky: flipping Y as Trect assumes an image coordinate system.
		    //		    
		    let topLeft  = TplanckWorld.world2pixels_vec({x:aabb.lowerBound.x, y:aabb.upperBound.y})
		    let botRight = TplanckWorld.world2pixels_vec({x:aabb.upperBound.x, y:aabb.lowerBound.y})

		    let boxRect = Trect.constructFromCoords({x1:topLeft.x, y1:topLeft.y,
							     x2:botRight.x,y2:botRight.y})

		    found = rectPixelSpace.touches(boxRect)
		}

		return found
	    }
	    
	} else {
	    
	    // Inactive objects need to be handled separately.
	    //
	    let pos_world = this._body_b2d.getPosition();
	    let pos_pixels = TplanckWorld.world2pixels_vec(pos_world)
	    
	    let boxRect = Trect.constructFromCoords({x1: pos_pixels.x - this._widthPixels/2,
						     y1: pos_pixels.y - this._heightPixels/2,
						     x2: pos_pixels.x + this._widthPixels/2,
						     y2: pos_pixels.y + this._heightPixels/2})

	    return rectPixelSpace.touches(boxRect)
	}
    
	return false    
    }
    
    obj2dict()
    {
	let p  = this._v_pixels
	let w  = this._widthPixels
	let h  = this._heightPixels
	let s  = this._existanceStart
	let d  = this._isDynamic
	let a  = this._activateOnCollision
	let ot = this._objType
	let id = this._uid
	let ss = this._showSprite
	let sb = this._showBorder
	
	let objData = {pos: p, width: w, height: h, start: s,
		       isDynamic: d,
		       activateOnCollision: a,
		       objType: ot,
		       id: id,
		       showSprite: ss,
		       showBorder: sb}

	if (this._sprite != null) {
	    objData.sprite = TimageUtils.img2String(this._sprite)
	}

	return objData
	
    }


    dict2obj(objDict, useDefaults=true)
    {
	let pos                 = null
	let width               = null
	let height              = null
	let start               = null
	let objType             = null
	let isDynamic           = null
	let activateOnCollision = null
	let isActive            = null
	let sprite              = null
	let showSprite          = null
	let showBorder          = null
	
	if ('pos' in objDict) {
	    pos = objDict.pos
	}

	if ('width' in objDict) {
	    width = objDict.width
	}

	if ('height' in objDict) {
	    height = objDict.height
	}

	if ('start' in objDict) {
	    start = objDict.start
	}

	if ('objType' in objDict) {
	    objType = objDict.objType
	}

	if ('isDynamic' in objDict) {
	    isDynamic = objDict.isDynamic
	}

	if ('activateOnCollision' in objDict) {
	    activateOnCollision = objDict.activateOnCollision
	}

	if ('isActive' in objDict) {
	    isActive = objDict.isActive
	}

	if ('showSprite' in objDict) {
	    showSprite = objDict.showSprite
	}

	if ('showBorder' in objDict) {
	    showBorder = objDict.showBorder
	}

	if ('sprite' in objDict) {
	    if (objDict.sprite.constructor.name == "String") {
		sprite = TimageUtils.string2Img(objDict.sprite)
	    } else {
		sprite = objDict.sprite
	    }
	}


	if (useDefaults == true) {
	    if (pos == null) {
		pos = {x:0,y:0}
	    }
	    if (width == null) {
		width = 10
	    }
	    if (height == null) {
		height = 10
	    }
	    if (start == null) {
		start = 0
	    }
	    if (objType == null) {
		objType = TplanckObject.eObjectType.kRectangle
	    }
	    if (isDynamic == null) {
		isDynamic = true
	    }

	    if (activateOnCollision == null) {
		activateOnCollision = false
	    }
	    if (isActive == null) {
		isActive = true
	    }

	    if (showSprite == null) {
		showSprite = true
	    }

	    if (showBorder == null) {
		showBorder = true
	    }
	    
	    if (sprite == null) {
		sprite = null
	    }
	}

	if (pos != null) {
	    this._v_pixels = planck.Vec2(pos.x, pos.y)
	}
	
	if (width != null) {
	    this._widthWorld   = TplanckWorld.pixels2world_x(width)
	    this._widthPixels  = width	    
	}

	if (height != null) {
	    this._heightWorld  = TplanckWorld.pixels2world_y(height)
	    this._heightPixels = height	    
	}

	if (start != null) {
	    this._existanceStart = start
	}

	if (objType != null) {
	    this._objType = objType
	}
	
	if (isDynamic != null) {
	    this._isDynamic = isDynamic
	}

	if (activateOnCollision != null) {
	    this._activateOnCollision = activateOnCollision
	}
	
	if (isActive != null) {
	    this._isActive  = isActive
	}

	if (showSprite != null) {
	    this._showSprite = showSprite
	}

	if (showBorder != null) {
	    this._showBorder = showBorder
	}

	if (sprite != null) {
	    this._sprite = sprite
	}
    }

    static pullUIDfromDict(objDict)
    {
	let id = null
	if ('id' in objDict) {
	    id = objDict.id
	}
	return id
    }
}

export default TplanckObject
