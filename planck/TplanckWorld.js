import TplanckObject from "./TplanckObject.js"
import TplanckJoint  from "./TplanckJoint.js"

import Tmath         from "../libs/Tmath.js";
import Trect         from "../libs/Trect.js";

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

    generateUID()
    {
	return new Date().getTime();
    }

    
    addObject(objDict)
    {
	let uid = TplanckObject.pullUIDfromDict(objDict)

	if (uid == null) {
	    uid = this.generateUID()
	}
	
	let obj = new TplanckObject(objDict, uid)

	this._fObjectList.push(obj)

	return obj
    }

    editObject(obj, objDict)
    {
	obj.editObject(objDict)
    }
    
    removeObject(b)
    {
	b.removeFromSimulation()

	// See if any joints include this object.
	//
	let jointsToRemove = []
	for (const j of this._fJointList) {
	    if (j._obj1 == b || j._obj2 == b) {

		jointsToRemove.push(j)
	    }
	}

	// Delete the joints from the list.
	//
	for (const j of jointsToRemove) {
	    j.removeFromSimulation()
	    this._fJointList = this._fJointList.filter(jnt => jnt != j);
	}


	// Delete the object from the list.
	//
	this._fObjectList = this._fObjectList.filter(obj => obj != b);	

	// Delete the joint from the list.
	//
	this._fJointList = this._fJointList.filter(joint => joint != b);	
	
    }

    /*
    addJoint(obj1, obj1Pos, obj2, obj2Pos, existanceStart, currentFrame)
    {
	let joint = new TplanckJoint(obj1, obj1Pos, obj2, obj2Pos, existanceStart, this.generateUID())
	this._fJointList.push(joint)

	if (existanceStart == currentFrame) {
	    joint.addToSimulation(this._fWorld)
	}

	return joint	
    }
    */
    addJoint(jointDict)
    {
	let uid = TplanckJoint.pullUIDfromDict(jointDict)

	if (uid == null) {
	    uid = this.generateUID()
	}

	// Check to see if the jointDict needs to resolve the object references.
	// This happens when addJoint is called from loading a file.
	//
	if ('obj1' in jointDict) {
	    if (jointDict.obj1.constructor.name != "TplanckObject") {
		let obj1 = this.objFromId(jointDict.obj1)
		jointDict.obj1 = obj1
	    }
	}
	if ('obj2' in jointDict) {
	    if (jointDict.obj2.constructor.name != "TplanckObject") {
		let obj2 = this.objFromId(jointDict.obj2)
		jointDict.obj2 = obj2
	    }
	}
	
	
	let joint = new TplanckJoint(jointDict, uid)
	this._fJointList.push(joint)

	return joint	
    }

    
    intersectRect(rectPixelSpace, filterForObjects=true, filterForJoints=false)
    //
    // Description:
    //	    Tests which boxes are in the rectangle defined by (left,top,right,bottom)
    //
    {
	let boxes  = []
	let joints = []
	
	if (filterForObjects == true) {
            for (const b of this._fObjectList) {		
		if (b.isBeingSimulated()) {
		    if (b.intersectRect(rectPixelSpace)) {
			boxes.push(b)
		    }		    
		}
	    }
	}

	if (filterForJoints == true) {
            for (const j of this._fJointList) {		
		if (j.isBeingSimulated()) {		    
		    if (j.intersectRect(rectPixelSpace)) {
			joints.push(j)
		    }		    
		}
	    }

	}

	return boxes.concat(joints)
    }

    static pixels2world_x(v)
    {
	return Tmath.remap(0,fCanvasWidth,0,fWorldWidth,v)
    }

    static pixels2world_y(v)
    {
	return Tmath.remap(0,fCanvasHeight,0,fWorldHeight,v)
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

    world2dict()
    {
	let objs   = []
	let joints = []

	for (const b of this._fObjectList) {
	    let bS = b.obj2dict()
	    objs.push(bS)	    
	}
	for (const j of this._fJointList) {
	    let jS = j.joint2dict()
	    joints.push(jS)	    
	}

	return {objs: objs, joints: joints}
    }


    dict2world(d)
    {
	let objs   = d.objs
	let joints = d.joints

	for (const obj of objs) {
	    let objDict = obj
	    this.addObject(objDict)
	}

	for (const j of joints) {
	    let jointDict = j
	    this.addJoint(jointDict)
	}
    }

    objFromId(id)
    {
	let foundObj = null
	
	for (const b of this._fObjectList) {	
	    if (b._uid == id) {
		foundObj = b
		break
	    }
	}
	return foundObj
    }
}

export default TplanckWorld
