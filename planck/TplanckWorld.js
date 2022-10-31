import TplanckObject from "./TplanckObject.js"
import Tmath         from "../libs/Tmath.js";

// ALERT: Need to update these when the canvas size changes.
//
let fCanvasWidth
let fCanvasHeight



let fWorldWidth
let fWorldHeight

//export {fCanvasWidth, fCanvasHeight, fWorldWidth, fWorldHeight}

class TplanckWorld
{
    constructor(canvasWidth, canvasHeight, worldSize, gravity = planck.Vec2(0,-10))
    {
	this._fGravity = gravity
	
	this._fWorld = planck.World(this._fGravity)

	this._fObjectList  = []
	this._fJointList   = []

	fCanvasWidth  = canvasWidth
	fCanvasHeight = canvasHeight
	
	fWorldWidth   = worldSize
	fWorldHeight  = worldSize
	
	if (fCanvasWidth > fCanvasHeight) {
	    fWorldWidth  = 10
	    fWorldHeight = fWorldWidth * (fCanvasHeight/fCanvasWidth)
	} else {
	    fWorldHeight = 10
	    fWorldWidth  = fWorldHeight * (fCanvasWidth/fCanvasHeight)
	}
    }

    step()
    {
	this._fWorld.step(1/60, 8, 3);

	// crearForces  method should be added at the end on each step
        this._fWorld.clearForces();
    }
    
    draw(ctx, paused)
    {
	for (const b of this._fObjectList) {	
	    // Check to see if it's part of the world.
	    //
	    if (b.isBeingSimulated()) {
		b.draw(ctx, paused)
	    }
	}

	for (const j of this._fJointList) {	
	    // Check to see if it's part of the world.
	    //
	    if (j.isBeingSimulated()) {
		j.draw(ctx, paused)
	    }
	}
    }

    drawAnnotated(ctx, objList)
    {
	for (const b of objList) {
	    // Check to see if it's part of the world.
	    //
	    if (b.isBeingSimulated()) {
		b.draw(ctx, false, true)
	    }

	}
    }
    
    reset()
    {
	this._fWorld = null
	this._fWorld = planck.World(this._fGravity);

	
	this._fWorld.on('pre-solve', function(contact, oldManifold) {
	    var manifold = contact.getManifold();
        
	    if (manifold.pointCount == 0) {
		return;
	    }

	    let bodyA = contact.getFixtureA().getBody();
	    let bodyB = contact.getFixtureB().getBody();
	    
	    let vA = bodyA.getLinearVelocity()
	    let vB = bodyB.getLinearVelocity()

	    if (vA.x < 0.0001 && vA.y < 0.001 && vB.x < 0.001 && vB.y < 0.001) {
		
	    } else {
		bodyA.setGravityScale(1.0)
		bodyB.setGravityScale(1.0)
		let boxA = bodyA.getUserData()
		let boxB = bodyB.getUserData()
	    }
	});

	
	for (const b of this._fObjectList) {
	    b.removeFromSimulation()	    
	}

	for (const j of this._fJointList) {
	    j.removeFromSimulation()	    
	}
	
    }
    
    setFrame(f)
    {
        for (const b of this._fObjectList) {
	    if (b._existanceStart == f) {
		b.addToSimulation(this._fWorld)
	    }
	}
        for (const j of this._fJointList) {
	    if (j._existanceStart == f) {
		j.addToSimulation(this._fWorld)
	    }
	}
    }


    
    addObject(pos, width, height, existanceStart, currentFrame, objType)
    {
	let obj = new TplanckObject(pos, width, height, existanceStart, objType)
	this._fObjectList.push(obj)

	if (existanceStart == currentFrame) {
	    obj.addToSimulation(this._fWorld)
	}
    }

    intersectRect(rect)
    //
    // Description:
    //	    Tests which boxes are in the rectangle defined by (left,top,right,bottom)
    //
    {
	let p1 = TplanckWorld.pixels2world_vec(planck.Vec2(rect.left, rect.top))
	let w  = TplanckWorld.pixels2world_float(rect.width)
	let h  = TplanckWorld.pixels2world_float(rect.height)	

	let r1 = {left: p1.x, top: p1.y, width: w, height: h}
	//console.log(r1)
	
	let boxes = []
        for (const b of this._fObjectList) {		
	    if (b.isBeingSimulated()) {

		if (b.intersectRect(r1)) {
		    boxes.push(b)
		}
		
	    }
	} 
	return boxes
    }

    static pixels2world_float(f)
    {
	return Tmath.remap(0, fCanvasWidth,  0, fWorldWidth,  f)
    }
    
    static pixels2world_vec(v)
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

    static world2pixels_vec(v)
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

export default TplanckWorld
