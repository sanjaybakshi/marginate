import Tdiv      from "./Tdiv.js"

import Ttool from "./Ttool.js"

class Ttoolbar extends Tdiv
{
    constructor(toolbarId)
    {
	super(toolbarId)

	this._defTool = new Ttool()

	this._currentTool = this._defTool;
    }

    draw(ctx)
    {
	this._currentTool.draw(ctx)
    }    

    pointerDown(e, canvas)
    {
	this._currentTool.pointerDown(e, canvas)
    }
    pointerMove(e, canvas)
    {
	this._currentTool.pointerMove(e, canvas)	
    }
    
    pointerUp(e, canvas)
    {
	this._currentTool.pointerUp(e, canvas)		
    }
    
}


export default Ttoolbar


