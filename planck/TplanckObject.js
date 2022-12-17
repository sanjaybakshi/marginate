import Tmath        from "../libs/Tmath.js";
import Tsprite      from "../libs/Tsprite.js";
import TplanckWorld from "./TplanckWorld.js";


class TplanckObject
{
    _widthPixels;
    _heightPixels;
    _existanceStart;
    _isActive;
    _isDynamic;
    _activateOnCollision;

    _body_b2d    
    _sprite;

    static eObjectType = {
	kRectangle : 0,
	kCircle    : 1
    }

    _objType;
    
    
    constructor(pos, width, height, existanceStart, objType, isDynamic=true, isActive=true)
    {
	this._widthWorld   = TplanckWorld.pixels2world_float(width)
	this._heightWorld  = TplanckWorld.pixels2world_float(height)
	
	this._widthPixels  = width
	this._heightPixels = height
	this._existanceStart = existanceStart

	this._v_pixels = planck.Vec2(pos.x, pos.y)
	this._isDynamic = isDynamic
	this._isActive  = isActive
	
	this._activateOnCollision = true
	
	this._objType = objType

	this._sprite = new Tsprite()
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
	console.log(this._activateOnCollision)
    }
    
    isActivatedOnCollision()
    {
	return this._activateOnCollision
    }

    
    removeFromSimulation()
    {
	this._body_b2d = null
    }

    isBeingSimulated()
    {
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
	
	let shape = planck.Box(this._widthWorld/2, this._heightWorld/2);
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
	let pos_world = this._body_b2d.getPosition();
	let rot       = this._body_b2d.getAngle();
	let pos_pixels = TplanckWorld.world2pixels_vec(pos_world)

	ctx.save()


	this._sprite._rot = -rot
	this._sprite._pos = {x:pos_pixels.x, y:pos_pixels.y}
	this._sprite.draw(ctx)

	ctx.beginPath();

	/*
	if (isSelected == true) {
	    ctx.lineWidth = 1.5;
	} else {
	    ctx.lineWidth = 0.5;
	}
	*/
	if (this.isDynamic()) {
	    ctx.strokeStyle = 'black';
	} else {
	    ctx.strokeStyle = 'grey';	    
	}

	if (annotated == true) {
	    ctx.strokeStyle = 'red';	    
	}

	if (!paused) {
	    this.drawRect(ctx, pos_pixels, rot);
	} else {
	    this.drawRect(ctx, pos_pixels, rot);
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
    


    intersectRect(rectWorldSpace, rectPixelSpace)
    //
    // Description:
    //	    Tests if the object is in the rectangle.
    //

    {
	if (this.isActive()) {
	    
	    // loop through all fixtures
            for (let fixture = this._body_b2d.getFixtureList(); fixture; fixture = fixture.getNext()) {
		let shape = fixture.getShape();

		let numChildren = shape.getChildCount()
		
		for (let i=0; i < numChildren; i++) {
		    
		    let aabb = fixture.getAABB(i)
		    
		    let boxRect = {x1: aabb.lowerBound.x, y1: aabb.lowerBound.y,
				   x2: aabb.upperBound.x, y2: aabb.upperBound.y}
		    
		    return Tmath.overlaps({x1: rectWorldSpace.left, y1: rectWorldSpace.top, x2: rectWorldSpace.left+rectWorldSpace.width, y2: rectWorldSpace.top+rectWorldSpace.height},
				      boxRect)
		}
	    }
	    
	} else {

	    // Inactive objects need to be handled separately.
	    //
	    let pos_world = this._body_b2d.getPosition();
	    let pos_pixels = TplanckWorld.world2pixels_vec(pos_world)

	    let boxRect = {x1: pos_pixels.x - this._widthPixels/2, y1: pos_pixels.y - this._heightPixels/2,
			   x2: pos_pixels.x + this._widthPixels/2, y2: pos_pixels.y + this._heightPixels/2}

	    console.log(boxRect)
	    return Tmath.overlaps({x1: rectPixelSpace.left, y1: rectPixelSpace.top, x2: rectPixelSpace.left+rectPixelSpace.width, y2: rectPixelSpace.top+rectPixelSpace.height},
				      boxRect)

	}
    
	return false    
    }

    sprite()
    {
	return this._sprite
    }
}

export default TplanckObject
