class Trect
{
    _x1 = 0
    _y1 = 0
    _x2 = 0
    _y2 = 0

    constructor()
    {
    }

    static constructFromCoords(coords)
    {
	let newRect = new Trect()
	newRect._x1 = coords.x1
	newRect._y1 = coords.y1
	newRect._x2 = coords.x2
	newRect._y2 = coords.y2
	return newRect
    }
    
    static constructFromCenterWidthHeight(center, width, height)
    {
	let newRect = new Trect()
	newRect._x1 = center.x - width /2
	newRect._y1 = center.y - height/2
	newRect._x2 = center.x + width /2
	newRect._y2 = center.y + height/2

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
    
    width()
    {
	return (this._x2 - this._x1)
    }

    height()
    {
	return (this._y2 - this._y1)
    }

    center()
    {
	return {x:this._x1 + this.width()/2,
		y:this._y1 + this.height()/2}
    }
    
    union(r)
    {
	var union = new Trect()
	
	union._x1 = Math.min(this._x1, r._x1)
	union._y1 = Math.min(this._y1, r._y1)
	union._x2 = Math.max(this._x2, r._x2)
	union._y2 = Math.max(this._y2, r._y2)	

	return union
    }

    isInside(p)
    {
	if (p.x >= this._x1 && p.x <= this._x2 &&
	    p.y >= this._y1 && p.y <= this._y2) {
	    return true
	}
	return false
    }

    drawDashed(ctx, dashLength=5, spaceLength=5)
    {
	// Each dash
	ctx.setLineDash([dashLength,spaceLength])

	ctx.beginPath();
	ctx.moveTo(this._x1, this._y1)
	ctx.lineTo(this._x2, this._y1)
	ctx.lineTo(this._x2, this._y2)
	ctx.lineTo(this._x1, this._y2)
	ctx.lineTo(this._x1, this._y1)
	ctx.stroke();	
    }
    
}

export default Trect
