import TplanckWorld from "./TplanckWorld.js";


class TplanckJoint
{
    _obj1;
    _obj1Pos;
    _obj2;
    _obj2Pos;

    _existanceStart;
    
    _joint_b2d;

    constructor(o1, o1Pos, o2, o2Pos, existanceStart)
    {
	this._obj1    = o1
	this._obj2    = o2
	this._obj1Pos = o1Pos
	this._obj2Pos = o2Pos

	this._existanceStart = existanceStart
    }
    
    removeFromSimulation()
    {
	this._joint_b2d = null
    }

    isBeingSimulated()
    {
	return this._joint_b2d != null
    }
    
    
    addToSimulation(world)
    {
	//let j = this.makeDistanceJoint(world)
	let j = this.makeMotorJoint(world)
	//let j = this.makeRevoluteJoint(world)
	this._joint_b2d = j
	
    }

    makeDistanceJoint(world)
    {	
	var worldAnchorOnA = planck.Vec2(this._obj1Pos.x, this._obj1Pos.y)
	var worldAnchorOnB = planck.Vec2(this._obj2Pos.x, this._obj2Pos.y)
	
	worldAnchorOnA = TplanckWorld.pixels2world_vec(worldAnchorOnA)
	worldAnchorOnB = TplanckWorld.pixels2world_vec(worldAnchorOnB)

	let j = world.createJoint(planck.DistanceJoint({
	    collideConnected: false,
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

	j.m_collideConnected = false	
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
	
	j.m_collideConnected = false
	j.m_motorSpeed       = 50.0
	j.m_maxMotorTorque   = 10.0
	j.m_enableMotor      = true
	j.m_frequencyHz      = 3.0
	j.m_dampingRatio     = 0.7

	return j
    }
    
    
    draw(ctx, paused, annotated=false)
    {
	var p1 = TplanckWorld.world2pixels_vec(this._joint_b2d.getBodyA().getPosition())
	var p2 = TplanckWorld.world2pixels_vec(this._joint_b2d.getBodyB().getPosition())

	var a1 = TplanckWorld.world2pixels_vec(this._joint_b2d.getAnchorA())
	var a2 = TplanckWorld.world2pixels_vec(this._joint_b2d.getAnchorB())	    

	ctx.save()
	
	ctx.beginPath();
	ctx.lineWidth = .5;
	ctx.strokeStyle = 'grey';	    
	
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y)
	ctx.lineTo(a1.x, a2.y)

	ctx.lineTo(a2.x, a2.y)
	ctx.lineTo(p2.x, p2.y)
	
	ctx.stroke();

	ctx.restore()	
    }
}

export default TplanckJoint
