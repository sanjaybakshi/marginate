import Tdiv      from "./Tdiv.js"

import Ttool from "./Ttool.js"

class Ttoolbar extends Tdiv
{
    constructor(toolbarId, canvas)
    {
	super(toolbarId)

	this._defTool = new Ttool()

	this._currentTool = this._defTool;

	this.fCanvas = canvas
    }

    draw(ctx)
    {
	this._currentTool.draw(ctx)
    }    

    pointerDown(e)
    {
	this._currentTool.pointerDown(e)
    }
    pointerMove(e)
    {
	this._currentTool.pointerMove(e)	
    }
    
    pointerUp(e)
    {
	this._currentTool.pointerUp(e)		
    }

    setTool(t)
    {
	if (this._currentTool != null) {
	    this._currentTool.dismiss()
	}

	this._currentTool = t
	this._currentTool.engage()
    }
}


export default Ttoolbar


