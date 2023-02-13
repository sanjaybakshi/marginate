//2016 Andrew V Butt Sr. Pryme8@gmail.com
//Vector2 Object.
//Common 2d array functions.



class Tvector2d {

    constructor(x,y)
    {
	this.x = x;
	this.y = y;
    }

    clone()
    {
	return new Tvector2d(this.x, this.y); //Make a new Instances of the vector.
    }

    perp() {
	//Get the Perpendicular angle;
	var x = this.x;
	var y = this.y;
	this.x =  y;
	this.y = -x;

	return this
    }

    rotate(angle)
    //Rotate a vec by an angle in radians.    
    {
	var x = this.x;
	var y = this.y;
	this.x = x * Math.cos(angle) - y * Math.sin(angle);
	this.y = x * Math.sin(angle) + y * Math.cos(angle);

	return this
    }

    normalize()
    {
	var d = this.len();
	if(d > 0) {
	    this.x = this.x / d;
	    this.y = this.y / d;
	}
	return this
    }

    add(input)
    {
	this.x += input.x;
	this.y += input.y;

	return this
    }

    subtract(input) {
	this.x -= input.x;
	this.y -= input.y;

	return this
    }

    scale(x,y) {
	this.x *= x
	this.y *= y

	return this
    }

    multiplyScalar(scalar)
    {
	this.x *= scalar
	this.y *= scalar
	return this
    }
    
    dot(input) {
	return (this.x * input.x + this.y * input.y);
    }


    len2()
    {
	return this.dot(this);
    }

    len()
    {
	return Math.sqrt(this.len2());
    }

    project(axis)
    {
	//Project a vector onto anouther.
	var t = this.dot(axis) / axis.len2();
	this.x = t * axis.x;
	this.y = t * axis.y;

	return this
    }

    /*
    Tvector2d.prototype.projectN = function(axis) { //Project onto a vector of unit length.
    var t = this.dot(axis);
    this.x = t * axis.x;
    this.y = t * axis.y;
    return this;
};

Tvector2d.prototype.reflect = function(axis) { //Reflect vector to a vector.
    var x = this.x;
    var y = this.y;
    this.project(axis).scale(2);
    this.x -= x;
    this.y -= y;
    return this;
};

Tvector2d.prototype.reflectN = function(axis) {  //Reflect on an Arbitrary Axis
    var x = this.x;
    var y = this.y;
    this.projectN(axis).scale(2);
    this.x -= x;
    this.y -= y;
    return this;
};

Tvector2d.prototype.getValue = function(v){  //Returns value of float or array,
	if((v == 'x' || v == 0) ){
		return parseFloat(this.x);
	}else if((v == 'y' || v == 1)){
		return parseFloat(this.y);
	}else{
		return [this.x,this.y];
	}
}
*/
}

export default Tvector2d
    
