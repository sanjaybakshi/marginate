import Tdiv from "./Tdiv.js"

class TpopupWindow extends Tdiv
{
    constructor(divId)
    {
	super(divId)

	this._div.addEventListener('pointerdown', (e) => {

	    // don't propogate, don't want the window to receive the pointerdown
	    // and dismiss the dialog.
	    //
	    e.stopPropagation()
	});

	
	window.addEventListener('pointerdown', (e) => {
	    console.log("window click")

	    if (this.isVisible()) {
		this.hide()
	    } 
	});
	
    }

    show()
    {
	super.show()
	console.log('called show')

	
	
    }

    hide()
    {
	super.hide()
	console.log('called hide')
    }
}


export default TpopupWindow


