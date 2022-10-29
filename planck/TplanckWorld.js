import TplanckObject from "./TplanckObject.js"

// Update these when the canvas size changes.
//
let fCanvasWidth
let fCanvasHeight

let fWorldWidth
let fWorldHeight

export {fCanvasWidth, fCanvasHeight, fWorldWidth, fWorldHeight}

class TplanckWorld
{
    constructor(canvasWidth, canvasHeight, worldSize, gravity = planck.Vec2(0,-10))
    {
	this._fGravity = gravity
	
	this._fWorld = planck.World(this._fGravity)

	this._fObjectList  = []
	this._fJointList   = []

	// Update the global variables.
	//
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
}

export default TplanckWorld
