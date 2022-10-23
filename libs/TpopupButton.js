import Tbutton      from "./Tbutton.js"
import TpopupWindow from "./TpopupWindow.js"

class TpopupButton extends Tbutton
{
    constructor(btnId, wndCtrl)
    {
	super(btnId, null)
	
	this._wnd = wndCtrl // Has to be of type TpopupWindow

	this.Placements = {
	    gUnder: 0,
	    gOver:  1,
	    gLeft:  2,
	    gRight: 3	    
	}
	
	this._placeHint = this.Placements.gUnder

	this._placementOffset = 15
    }

    executeClick(e)
    {
	super.executeClick(e)
	

	if (this._wnd.isVisible()) {
	    this._wnd.hide()
	} else {

	    
	    let btnPos = this.getPosition()
	    let btnSz  = this.getWidthHeight()
	    
	    
	    // show it so we can compute the size properly.
	    //
	    this._wnd.show()


	    if (this._placeHint == this.Placements.gUnder) {

		let wndSz = this._wnd.getWidthHeight()

		let xPos, yPos
		
		// Check to see if popping up this window would be to the right of the parent window.
		//
		if (btnPos.x + wndSz.width > window.innerWidth) {
		    xPos = window.innerWidth - wndSz.width - this._placementOffset
		    console.log("need to move it to the left so it's on the screen")
		} else {
		    xPos = btnPos.x
		}
		yPos = btnPos.y + btnSz.height + this._placementOffset
		this._wnd.showAt({x:xPos,y:yPos})

	    } else {
		let wndSize = this._wnd.getWidthHeight()
	    
		//let xPos = btnPos[0] - wndSize[0]
		let xPos = btnPos.x + btnSz.width
	    
		let yPos = btnPos.y
	    
		console.log(xPos,yPos)
		this._wnd.showAt([xPos,yPos])
	    }
	}
	console.log("click")

	
    }

}


export default TpopupButton


