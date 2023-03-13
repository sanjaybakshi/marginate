import TpopupWindow from "../libs/TpopupWindow.js"
import Tbutton      from "../libs/Tbutton.js"

import { fModel }   from '../TmarginateModel.js'


class TdrawToolTypesWnd extends TpopupWindow
{
    constructor(windowId, marginateToolbar)
    {
	super(windowId)

	this._marginateToolbar = marginateToolbar
	
	this.gPencilId       = "pencilDrawId"
	this.gPenId          = "penDrawId"
	this.gEraserId       = "eraserDrawId"
	this.gRectangleId    = "rectangleDrawId"	

	this._pencilCtrl  = document.getElementById(this.gPencilId)
	this.respondToClick(this._pencilCtrl)

	this._penCtrl  = document.getElementById(this.gPenId)
	this.respondToClick(this._penCtrl)

	this._eraserCtrl  = document.getElementById(this.gEraserId)
	this.respondToClick(this._eraserCtrl)

	this._rectangleCtrl  = document.getElementById(this.gRectangleId)
	this.respondToClick(this._rectangleCtrl)
    }


    respondToClick(toolCtrl)
    {
	toolCtrl.addEventListener('pointerdown', (e) => {
	    //this.toolChange(e)


	    if (e.target.id == this.gPencilId) {
		console.log("pencil")
		this._marginateToolbar._drawCtrl._div.src = "./icons/Pencil.png"
		this._marginateToolbar.fDrawTool.setPencilMode()
	    } else if (e.target.id == this.gPenId) {
		console.log("pen")
		this._marginateToolbar._drawCtrl._div.src = "./icons/Pencil.png"
		this._marginateToolbar.fDrawTool.setPenMode()
	    } else if (e.target.id == this.gEraserId) {
		console.log("eraser")
		this._marginateToolbar._drawCtrl._div.src = "./icons/Eraser.png"
		this._marginateToolbar.fDrawTool.setEraserMode()
	    } else if (e.target.id == this.gRectangleId) {
		console.log("rectangle")
		this._marginateToolbar._drawCtrl._div.src = "./icons/Rectangle.png"
		this._marginateToolbar.fDrawTool.setRectangleMode()
	    }
	    
	    this._marginateToolbar.toolChange(this._marginateToolbar.fDrawTool,
					      this._marginateToolbar._drawCtrl._div)
	    

	    this.hide()
	});
    }
    
}



export default TdrawToolTypesWnd


