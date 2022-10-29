import Tmath        from "../libs/Tmath.js";

import {fCanvasWidth, fCanvasHeight, fWorldWidth, fWorldHeight} from './TplanckWorld.js'

class TplanckObject
{
    _widthPixels;
    _heightPixels;
    _existanceStart;
    _isDynamic;
    _activateOnCollision;


    static eObjectType = {
	kRectangle : 0,
	kCircle    : 1
    }

    _objType;
    
    
    constructor(pos, width, height, existanceStart, objType, isDynamic=true)
    {
	
	this._widthPixels  = width
	this._heightPixels = height
	this._existanceStart = existanceStart

	this._v_pixels = planck.Vec2(pos.x, pos.y)
	this._isDynamic = isDynamic
	
	this._activateOnCollision = false
	this._isDynamic = true
	
	this._objType = objType
    }

    setPosition(newPos)
    {
	this._v_pixels = planck.Vec2(newPos.x, newPos.y)
	let v_world = this.pixels2world_vec(this._v_pixels) 
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

	let v_world  = this.pixels2world_vec(this._v_pixels) 
	body.setPosition(v_world)
	
	let w = Tmath.remap(0, fCanvasWidth,  0, fWorldWidth,  this._widthPixels)
	let h = Tmath.remap(0, fCanvasHeight, 0, fWorldHeight, this._heightPixels)
	let shape = planck.Box(w/2, h/2);
	body.createFixture(shape, 1.0);

	// time to set mass information
        body.setMassData({
	    mass: 5,
	    center: planck.Vec2(),
		
	    // I have to say I do not know the meaning of this "I", but if you set it to zero, bodies won't rotate
	    I: 1
	});
	
	if (this.isActivatedOnCollision()) {
	    body.setGravityScale(1.0)
	} else {
	    body.setGravityScale(0.0)
	}
	    
	// Point the box2d object back at Tbox
	//
	body.setUserData(this)
	    
	this._body_b2d = body	    
    }

    
    draw(ctx, paused, isSelected=false)
    {
	let pos_world = this._body_b2d.getPosition();
	let rot       = this._body_b2d.getAngle();
	let pos_pixels = this.world2pixels_vec(pos_world)

	ctx.save()

	ctx.beginPath();

	if (isSelected == true) {
	    ctx.lineWidth = 1.5;
	} else {
	    ctx.lineWidth = 0.5;
	}
	    
	if (this.isDynamic()) {
	    ctx.strokeStyle = 'black';
	} else {
	    ctx.strokeStyle = 'grey';	    
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
	let pos_pixels = this.world2pixels_vec(pos_world)
	
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
    
    pixels2world_vec(v)
    {
	let newVec = planck.Vec2()
	
	let x = Tmath.remap(0, fCanvasWidth,  0, fWorldWidth,  v.x)
	let y = Tmath.remap(0, fCanvasHeight, 0, fWorldHeight, v.y)
	
	// flip y
	y = fWorldHeight - y;
	
	newVec.x = x;
	newVec.y = y;
	return newVec
    }

    world2pixels_vec(v)
    {
	let newVec = planck.Vec2()
	
	let x = Tmath.remap(0, fWorldWidth,  0, fCanvasWidth,  v.x)
	let y = Tmath.remap(0, fWorldHeight, 0, fCanvasHeight, v.y)
	
	// flip y
	y = fCanvasHeight - y;
	
	newVec.x = x;
	newVec.y = y;
	return newVec
    }
}

export default TplanckObject
