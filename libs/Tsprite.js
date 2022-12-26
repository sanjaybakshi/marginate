import TimageUtils from "./TimageUtils.js";

class Tsprite
{
    _pos;
    _rot;
    
    constructor(w,h)
    {
	this._pos    = {x:0, y:0}
	this._rot    = 0.0;

	this._img = null
	
	this._drawWidth  = Math.floor(w)
	this._drawHeight = Math.floor(h)

    }

    image()
    {
	return this._img
    }
    
    draw(ctx)
    {
	if (this._img != null) {
	    ctx.save()

	    
	    ctx.translate(this._pos.x, this._pos.y)
	    ctx.rotate(this._rot);
	    //ctx.scale(1/this.scaleFactor(), 1/this.scaleFactor());

	    /*
	    ctx.drawImage(this._img,
			  Math.floor(-this._drawWidth  / 2),
			  Math.floor(-this._drawHeight / 2),
			  this._drawWidth,
			  this._drawHeight
			  
			 );
	    */

	    ctx.drawImage(this._img,
			  0,0,
			  this._img.width,
			  this._img.height,
			  
			  Math.floor(-this._drawWidth  / 2),
			  Math.floor(-this._drawHeight / 2),
			  this._drawWidth,
			  this._drawHeight
			 );

	    ctx.restore()
	}
    }

    initBitmap(img)
    {
	this._img = img
    }

    createBitmap(width, height)
    {
	
	let bmap = TimageUtils.makeImage(width,height)

	this.initBitmap(bmap)
	
    }
    
    scaleFactor()
    {
	return (this._drawWidth / this._img.width)
    }

    hasImage()
    {
	return (this._img != null)
    }

    drawWidth()
    {
	return this._drawWidth
    }

    drawHeight()
    {
	return this._drawHeight
    }
}

export default Tsprite
