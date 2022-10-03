class Ttool
{
    constructor()
    {
	console.log("what")
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
