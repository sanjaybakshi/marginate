import Ttoolbar  from "./libs/Ttoolbar.js"
import TcssUtils from "./libs/TcssUtils.js"

import TpaintTool from "./TpaintTool.js"


class TmarginateToolbar extends Ttoolbar
{
    constructor(toolbarId)
    {
	super(toolbarId)

	this.gPaintColorId            = "paintColorId"
	this.gPaintStrokeId           = "paintStrokeId"

	this.gPaintBrushId            = "paintBrushId"	
	this.gPaintEraserId           = "paintEraserId"

	this._paintBrushCtrl  = document.getElementById(this.gPaintBrushId)
	this.respondToClick(this._paintBrushCtrl)

	this._paintEraserCtrl  = document.getElementById(this.gPaintEraserId)
	this.respondToClick(this._paintEraserCtrl)

	this.fPaintTool = new TpaintTool()
	this._currentTool = this.fPaintTool
	
    }

    respondToClick(toolCtrl)
    {
	toolCtrl.addEventListener('pointerdown', (e) => {
	    this.toolChange(e)
	});
    }

    toolChange(e)
    {
	const toolButtonPressColor      = TcssUtils.getCssVariableValue('--toolbutton-press-color')
	const toolButtonBackgroundColor = TcssUtils.getCssVariableValue('--toolbar-background-color')
	const toolButtonBorderRad       = TcssUtils.getCssVariableValue('--toolButton-press-border-radius')

	if (e.target.id == this.gPaintBrushId) {
	    this._paintBrushCtrl.style.backgroundColor = toolButtonPressColor
	    this._paintBrushCtrl.style.borderRadius    = toolButtonBorderRad

	    this._paintEraserCtrl.style.backgroundColor = toolButtonBackgroundColor


	    console.log("paint mode")
	    this.fPaintTool.setPaintMode()	    
	} else if (e.target.id == this.gPaintEraserId) {
	    this._paintEraserCtrl.style.backgroundColor = toolButtonPressColor
	    this._paintEraserCtrl.style.borderRadius    = toolButtonBorderRad

	    this._paintBrushCtrl.style.backgroundColor = toolButtonBackgroundColor
	    this._paintBrushCtrl.style.borderRadius    = toolButtonBorderRad


	    this.fPaintTool.setEraserMode()
	    
	    console.log("eraser mode")	    
	}

	//this._currentTool.engage()
	
	e.stopPropagation()
    }
    
}

export default TmarginateToolbar
