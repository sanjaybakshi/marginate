import TplanckBase  from "./TplanckBase.js";
import TplanckWorld from "./TplanckWorld.js";

import Trect        from "../libs/Trect.js";


class TplanckJoint extends TplanckBase
{
    _obj1;
    _obj1Pos;
    _obj2;
    _obj2Pos;

    _existanceStart;
    
    _joint_b2d;

    static eJointType = {
	kMotor     : 0,
	kPrismatic : 1,
	kDistance  : 2,
	kRevolute  : 3
    }

    _jointType;
    _collideConnected = true;
    
    _uid;
    
    constructor(jointDict, id)
    {
	super(jointDict, id)
	
	this.dict2joint(jointDict, true)
	this._uid = id
    }

    removeFromSimulation()
    {
	super.removeFromSimulation()
	this._joint_b2d = null
    }

    isBeingSimulated()
    {
	super.isBeingSimulated()	
	return this._joint_b2d != null
    }
    

    collideConnected()
    {
	return this._collideConnected
    }

    setCollideConnected(v)
    {
	this._collideConnected = v
	if (this._joint_b2d != null) {
	    this._joint_b2d.m_collideConnected = v
	}
	console.log("set it to " + v)
    }
    
    addToSimulation(world)
    {
	let j = null

	if (this._jointType == TplanckJoint.eJointType.kMotor) {
	    j = this.makeMotorJoint(world)
	} else if (this._jointType == TplanckJoint.eJointType.kPrismatic) {
	    j = this.makeDistanceJoint(world)	    	    	    
	} else if (this._jointType == TplanckJoint.eJointType.kDistance) {
	    j = this.makeDistanceJoint(world)	    	    
	} else if (this._jointType == TplanckJoint.eJointType.kRevolute) {
	    j = this.makeRevoluteJoint(world)	    	    
	}
	this._joint_b2d = j	
    }

    makeDistanceJoint(world)
    {	
	var worldAnchorOnA = planck.Vec2(this._obj1Pos.x, this._obj1Pos.y)
	var worldAnchorOnB = planck.Vec2(this._obj2Pos.x, this._obj2Pos.y)
	
	worldAnchorOnA = TplanckWorld.pixels2world_vec(worldAnchorOnA)
	worldAnchorOnB = TplanckWorld.pixels2world_vec(worldAnchorOnB)

	console.log(this._collideConnected)
	let j = world.createJoint(planck.DistanceJoint({
	    collideConnected: this._collideConnected,
	}, this._obj1._body_b2d, this._obj2._body_b2d, worldAnchorOnA, worldAnchorOnB))
//	let j = world.createJoint(planck.RevoluteJoint({
//	    collideConnected: false,
//	}, this._obj1._body_b2d, this._obj2._body_b2d, worldAnchorOnA, worldAnchorOnB))

	// Compute distance between the anchor points.
	//
	let d = planck.Vec2.distance(worldAnchorOnA,worldAnchorOnB)
	j.m_length = d
	j.m_dampingRatio = 0.1
	j.m_frequencyHz = 3.0

	
	return j
    }

    makeRevoluteJoint(world)
    {	
	var worldAnchorOnA = planck.Vec2(this._obj1Pos.x, this._obj1Pos.y)
	worldAnchorOnA = TplanckWorld.pixels2world_vec(worldAnchorOnA)

	let j = world.createJoint(planck.RevoluteJoint( {},
							this._obj1._body_b2d,
							this._obj2._body_b2d,
							worldAnchorOnA))

	j.m_collideConnected = this._collideConnected
	j.m_dampingRatio = 0.1
	j.m_frequencyHz = 3.0

	
	return j
    }
    
    makeMotorJoint(world)
    {
	var worldAnchorOnB = planck.Vec2(this._obj2Pos.x, this._obj2Pos.y)
	worldAnchorOnB = TplanckWorld.pixels2world_vec(worldAnchorOnB)

	let j = world.createJoint(planck.WheelJoint( {},
						     this._obj1._body_b2d,
						     this._obj2._body_b2d,
						     worldAnchorOnB,
						     planck.Vec2(0.0,1.0) ))
	
	j.m_collideConnected = this._collideConnected
	j.m_motorSpeed       = 50.0
	j.m_maxMotorTorque   = 10.0
	j.m_enableMotor      = true
	j.m_frequencyHz      = 3.0
	j.m_dampingRatio     = 0.7

	return j
    }
    
    
    draw(ctx, paused, annotated=false)
    {
	super.draw(ctx, paused, annotated)
	
	//var p1 = TplanckWorld.world2pixels_vec(this._joint_b2d.getBodyA().getPosition())
	//var p2 = TplanckWorld.world2pixels_vec(this._joint_b2d.getBodyB().getPosition())

	var a1 = TplanckWorld.world2pixels_vec(this._joint_b2d.getAnchorA())
	if (this._jointType == TplanckJoint.eJointType.kMotor) {
	    a1 = TplanckWorld.world2pixels_vec(this._joint_b2d.getBodyA().getPosition())	    
	}
	var a2 = TplanckWorld.world2pixels_vec(this._joint_b2d.getAnchorB())	    

	ctx.save()
	
	ctx.beginPath();
	ctx.lineWidth = .5;
	ctx.strokeStyle = 'grey';	    

	if (annotated == true) {
	    ctx.strokeStyle = 'red';	    
	}

	ctx.beginPath();
	//ctx.moveTo(p1.x, p1.y)
	//ctx.lineTo(a1.x, a1.y)

	//ctx.lineTo(a2.x, a2.y)
	//ctx.lineTo(p2.x, p2.y)

	ctx.moveTo(a1.x, a1.y)
	ctx.lineTo(a2.x, a2.y)
	
	ctx.stroke();

	ctx.restore()	
    }


    intersectRect(rectPixelSpace)
    //
    // Description:
    //	    Tests if the joint is in the rectangle.
    //
    {	
	var a1 = TplanckWorld.world2pixels_vec(this._joint_b2d.getAnchorA())
	if (this._jointType == TplanckJoint.eJointType.kMotor) {
	    a1 = TplanckWorld.world2pixels_vec(this._joint_b2d.getBodyA().getPosition())	    
	}
	var a2 = TplanckWorld.world2pixels_vec(this._joint_b2d.getAnchorB())	    

	let boxRect = Trect.constructFromInfo({x:a1.x,y:a1.y},0,0)
	boxRect.addPoint({x:a2.x,y:a2.y})
	
	return rectPixelSpace.touches(boxRect)
    }
    
    joint2dict()
    {
	let jType = this._jointType
	
	let o1id = this._obj1._uid
	let o2id = this._obj2._uid
	
	let o1Pos = this._obj1Pos
	let o2Pos = this._obj2Pos
	
	let start = this._existanceStart

	let cc    = this._collideConnected
	let id    = this._uid
	
	let jointData = {jointType: jType, obj1: o1id, obj2: o2id, obj1Pos: o1Pos, obj2Pos: o2Pos, collideConnected: cc, start: start, id: id}
	return jointData
    }

    dict2joint(jointDict, useDefaults=true)
    {
	let jType   = null
	let obj1    = null
	let obj1Pos = null
	let obj2    = null
	let obj2Pos = null
	let start   = null
	let cc      = null
	
	if ('jointType' in jointDict) {
	    jType = jointDict.jointType
	}
	
	if ('obj1' in jointDict) {
	    obj1 = jointDict.obj1
	}

	if ('obj1Pos' in jointDict) {
	    obj1Pos = jointDict.obj1Pos
	}

	if ('obj2' in jointDict) {
	    obj2 = jointDict.obj2
	}

	if ('obj2Pos' in jointDict) {
	    obj2Pos = jointDict.obj2Pos
	}

	if ('collideConnected' in jointDict) {
	    cc = jointDict.collideConnected
	}

	if ('start' in jointDict) {
	    start = jointDict.start
	}
	
	if (useDefaults == true) {
	    if (jType == null) {
		jType = TplanckJoint.eJointType.kDistance	
	    }
	    if (obj1 == null) {
		obj1 = null
	    }
	    if (obj1Pos == null) {
		obj1Pos = {x:0,y:0}
	    }
	    if (obj2 == null) {
		obj2 = null
	    }
	    if (obj2Pos == null) {
		obj2Pos = {x:0,y:0}
	    }
	    if (cc == null) {
		cc = true
	    }
	    if (start == null) {
		start = 0
	    }
	    
	}

	if (jType != null) {
	    this._jointType = jType
	}
	
	if (obj1 != null) {
	    this._obj1 = obj1
	}
	if (obj1Pos != null) {
	    this._obj1Pos = obj1Pos
	}
	if (obj2 != null) {
	    this._obj2 = obj2
	}
	if (obj2Pos != null) {
	    this._obj2Pos = obj2Pos
	}
	if (cc != null) {
	    this._collideConnected = cc
	}
	
	if (start != null) {
	    this._existanceStart = start
	}
    }

    static pullUIDfromDict(jointDict)
    {
	let id = null
	if ('id' in jointDict) {
	    id = jointDict.id
	}
	return id
    }
    
}

export default TplanckJoint
