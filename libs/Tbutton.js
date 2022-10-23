import TpopupWindow from "./TpopupWindow.js"
import Tdiv         from "./Tdiv.js"

class Tbutton extends Tdiv
{
    constructor(btnId, btnClickFn)
    {

	super(btnId)
	
	this._callOnClickFn = btnClickFn

	this._div.addEventListener('pointerdown', (e) => {
	    this.executeClick(e)
	});
    }
    
    executeClick(e)
    {
	
	e.stopPropagation()
	
	if (this._callOnClickFn != null) {
	    this._callOnClickFn(e)
	}
    }

}


export default Tbutton


