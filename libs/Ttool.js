import Tdiv from "./Tdiv.js";

class Ttool
{
    constructor(canvas)
    {
	this.gToolInfoDivId        = "toolInfo.DivId"
	this.gToolInfoTxtId        = "toolInfo.TxtId"	

	this.fToolInfoDiv          = new Tdiv(this.gToolInfoDivId)
	this.fToolInfoTxt          = new Tdiv(this.gToolInfoTxtId)


	this.fCanvas = canvas
    }

    draw(ctx)
    {
    }

    pointerDown(e, canvas)
    {
	e.stopPropagation()	
    }

    pointerMove(e, canvas)
    {
	e.stopPropagation()	
    }

    pointerUp(e, canvas)
    {
	e.stopPropagation()	
    }

    engage()
    {
    }

    dismiss()
    {
    }

    hideToolbars()
    {
    }

    undo()
    {

    }

    redo()
    {

    }
}

export default Ttool
