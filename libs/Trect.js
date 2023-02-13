//
// Implements a rectangle.
// Can also be used for a bounding box.
//
// Note: The coordinate system is important. This is in pixel space so the top-left is 0,0
//
//  (0,0)
//    +------------+
//    |            |
//    |   +----+   |
//    |   |    |   |
//    |   +----+   |
//    +------------+
//

class Trect
{
    _x      = 0 // top left in x
    _y      = 0 // top left in y
    _width  = 0
    _height = 0

    constructor()
    {
    }

    static constructFromCoords(coords)
    {
	let newRect = new Trect()

	newRect._x      = coords.x1
	newRect._y      = coords.y1
	newRect._width  = coords.x2 - coords.x1
	newRect._height = coords.y2 - coords.y1	

	return newRect
    }
    
    static constructFromCenterWidthHeight(center, width, height)
    {
	let newRect = new Trect()
	newRect._x = center.x - width /2
	newRect._y = center.y - height/2
	newRect._width = width
	newRect._height = height

	return newRect	
    }

    static constructFromInfo(p, w, h)
    {
	let newRect = new Trect()
	newRect._x = p.x
	newRect._y = p.y
	newRect._width = w
	newRect._height = h

	return newRect
    }
    
    static constructFromPoints(pts)
    {
	let minX = Number.MAX_VALUE
	let maxX = Number.MIN_VALUE
	let minY = Number.MAX_VALUE
	let maxY = Number.MIN_VALUE

	for (const p of pts) {
	    if (p.x < minX) {
		minX = p.x
	    }
	    if (p.x > maxX) {
		maxX = p.x
	    }
	    if (p.y < minY) {
		minY = p.y
	    }
	    if (p.y > maxY) {
		maxY = p.y
	    }
	}

	return Trect.constructFromCoords({x1:minX,y1:minY,x2:maxX,y2:maxY})
    }


    addPoint(p)
    {
        let pt_max_x = Math.max(this._x+this._width, p.x)
        let pt_max_y = Math.max(this._y+this._height, p.y)
        this._x = Math.min(this._x, p.x)
        this._y = Math.min(this._y, p.y)
        this._width  = pt_max_x - this._x
	this._height = pt_max_y - this._y;
    }

    
    width()
    {
	return this._width
    }

    height()
    {
	return this._height
    }

    top_left()
    {
	return {x:this._x,y:this._y}
    }

    top_right()
    {
	return {x:this._x + width, y:this._y}
    }
    bottom_left()
    {
	return {x:this._x, y:this._y + this._height}
    }
    bottom_right()
    {
	return {x:this._x + this._width, y:this._y + this._height}
    }

    right()
    {
	return this._x+this._width
    }
    bottom()
    {
	return this._y + this._height
    }
    center()
    {
	return {x:this._x + this._width/2,
		y:this._y + this._height/2}
    }
    
    union(r)
    {
	let u_x1 = Math.min(this._x, r._x)
	let u_y1 = Math.min(this._y, r._y)
	let u_x2 = Math.max(this._x + this._width,  r._x + r._width)
	let u_y2 = Math.max(this._y + this._height, r._y + r._height)	

	return Trect.constructFromCoords({x1:u_x1, x2:u_x2,
					  y1:u_y1, y2:u_y2})
    }

    isInside(p)
    {

	if (p.x < this._x ||
	    p.y < this._y ||
	    p.x >= (this._x + this._width) ||
	    p.y >= (this._y + this._height))
	    return false;
	return true;
    }

    drawDashed(ctx, dashLength=5, spaceLength=5)
    {
	// Each dash
	ctx.setLineDash([dashLength,spaceLength])

	ctx.beginPath();
	ctx.moveTo(this._x, this._y)
	ctx.lineTo(this._x + this._width, this._y)
	ctx.lineTo(this._x + this._width, this._y + this._height)
	ctx.lineTo(this._x , this._y + this._height)
	ctx.lineTo(this._x, this._y)
	ctx.stroke();	
    }

    touches(r)
    //
    // Description:
    //
    {
	let x1 = this._x
	let y1 = this._y
	let x2 = this.right()
	let y2 = this.bottom()

	let A_x1 = r._x
	let A_y1 = r._y
	let A_x2 = r.right()
	let A_y2 = r.bottom()

	if (x1 <= A_x2 && x2 >= A_x1 &&
	    y1 <= A_y2 && y2 >= A_y1) {
	    return true
	}

	return false
	
    }

    /*
    overlaps(r)
    // Description:
    // http://grok.pixar.com/xref/release-trio/third/rmanpkg/22.0-daily/rixplugin/bxdf/glint/glint/include/blueprint/geometry/bbox.hpp?r=1959111
    //
    {
	// Check if intervals overlap
	
	// Check if X interval overlaps
	let x_a0 = this._x;
	let x_b0 = r._x;
	let x_a1 = this._x + this._width;
	let x_b1 = r._x + r._width;
	let x_overlaps = x_a0 <= x_b1 && x_b0 <= x_a1;
	
	if (!x_overlaps)
            return false;
	
	// Check if Y interval overlaps
	let y_a0 = this._y;
	let y_b0 = r._y;
	let y_a1 = this._y + this._height;
	let y_b1 = r._y + r._height;
	let y_overlaps = y_a0 <= y_b1 && y_b0 <= y_a1;
	
	if (!y_overlaps)
            return false;
	
	return true;
	
	}
	*/
}

export default Trect
