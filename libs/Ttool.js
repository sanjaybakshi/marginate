class Ttool
{
    constructor(canvas)
    {
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
