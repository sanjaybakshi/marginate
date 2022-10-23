
class Tsprite
{
    _pos;
    _rot;
    
    constructor()
    {
	this._pos    = {x:0, y:0}
	this._rot    = 0.0;

	this._img = null
	
	this._drawWidth  = 0
	this._drawHeight = 0

    }
    
    draw(ctx)
    {
	if (this._img != null) {
	    ctx.save()

	    
	    ctx.translate(this._pos.x, this._pos.y)
	    ctx.rotate(this._rot);
	    ctx.scale(1, 1);

	    ctx.drawImage(this._img,
			  Math.floor(-this._drawWidth  / 2),
			  Math.floor(-this._drawHeight / 2),
			  this._drawWidth,
			  this._drawHeight
			  
			 );
	    
	    ctx.restore()
	}
    }

    initBitmap(img, scaleFactor)
    {
	this._img    = img

	this._drawWidth  = Math.floor(img.width  * scaleFactor)
	this._drawHeight = Math.floor(img.height * scaleFactor)
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
