class Tmath
{
    constructor()
    {

	// Generate some random numbers.
	//

	this._randomNumbers = []
	for (let i=0; i < 5000; i++) {
	    this._randomNumbers.push(Math.random())
	}

    }

    static remap(low1, high1, low2, high2, value)
    //
    // Description:
    //      Takes a value between (low1,high1) and remaps it to be between (low2,high2)
    //
    {
	return low2 + (value - low1) * (high2 - low2) / (high1 - low1)
    }


    static xformMatrix(angle, t)
    {
	let cAngle = Math.cos(angle)
	let sAngle = Math.sin(angle)

	return [ [cAngle, sAngle, 0.0], [-sAngle, cAngle, 0], [t[0], t[1], 1.0] ];
    }

    static xformPoint(p, mat)
    {
	// See: https://developer.apple.com/documentation/coregraphics/cgaffinetransform
	let a  = mat[0][0]
	let b  = mat[0][1]
	let c  = mat[1][0]
	let d  = mat[1][1]
	let tx = mat[2][0]
	let ty = mat[2][1]
	
	let newP = [a*p[0] + c*p[1] + tx,
		    b*p[0] + d*p[1] + ty]

	return newP
    }

    static radians2degrees(radians)
    {
	var pi = Math.PI;
	return radians * (180/pi);
    }
    
    static degrees2radians(degrees)
    {
	var pi = Math.PI;
	return degrees * (pi/180);
    }

    
    /*
    static dot(v1,v2)
    {
	return (v1.x * v2.x + v1.y * v2.y);

    }
    static len2(v)
    {
	return Tmath.dot(v,v)
    }
    
    static len(v)
    {
	return Math.sqrt(Tmath.len2(v))
    }
    
    static normalize(v)
    {
	let d = Tmath.len(v)
	if (d > 0) {
	    v.x = v.x/d
	    v.y = v.y/d
	}
	return v
    }

    static perp(v)
    {
	let x = v.x
	let y = v.y

	v.x =  y
	v.y = -x
	}
    */



    getRandom(i)
    {
	let index = i % this._randomNumbers.length
	return this._randomNumbers[index]
	
    }
    
    // http://indiegamr.com/generate-repeatable-random-numbers-in-js/

   
    static seededRandom(min, max, seed)
    // in order to work 'Math.seed' must NOT be undefined,
    // so in any case, you HAVE to provide a Math.seed
    {
	max = max || 1;
	min = min || 0;
	
	let mSeed = (seed * 9301 + 49297) % 233280;
	var rnd = mSeed / 233280;
	
	return min + rnd * (max - min);
    }

    static seededRandom2(seed)
    {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
    }    
}

export default Tmath
