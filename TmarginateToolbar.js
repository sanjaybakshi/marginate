import Ttoolbar             from "./libs/Ttoolbar.js"
import TcssUtils            from "./libs/TcssUtils.js"
import TpopupButton         from "./libs/TpopupButton.js"

import TstrokePropertiesWnd from "./tools/TstrokePropertiesWnd.js"
import TmainMenuOptionsWnd  from "./tools/TmainMenuOptionsWnd.js"
import TpaintTool           from "./tools/TpaintTool.js"
import TselectTool          from "./tools/TselectTool.js"
import TaddObjectTool       from "./tools/TaddObjectTool.js"


class TmarginateToolbar extends Ttoolbar
{
    constructor(toolbarId)
    {
	super(toolbarId)

	this.gPaintColorId            = "paintColorId"
	this.gPaintStrokeId           = "paintStrokeId"

	this.gPaintBrushId            = "paintBrushId"	
	this.gPaintEraserId           = "paintEraserId"

	this.gSelectId                = "selectId"		
	this.gPaintRectangleId        = "paintRectangleId"	
	this.gPaintCircleId           = "paintCircleId"

	this.gPaintStrokePropertiesId = "paintStrokePropertiesId"

	this.gMainMenuId              = "menuButtonId"
	this.gMainMenuOptionsId       = "menuOptionsId"
	
	
	this._paintBrushCtrl  = document.getElementById(this.gPaintBrushId)
	this.respondToClick(this._paintBrushCtrl)

	this._paintEraserCtrl  = document.getElementById(this.gPaintEraserId)
	this.respondToClick(this._paintEraserCtrl)

	this._selectCtrl  = document.getElementById(this.gSelectId)
	this.respondToClick(this._selectCtrl)

	this._paintRectangleCtrl  = document.getElementById(this.gPaintRectangleId)
	this.respondToClick(this._paintRectangleCtrl)

	this._paintCircleCtrl  = document.getElementById(this.gPaintCircleId)
	this.respondToClick(this._paintCircleCtrl)

	this._strokePropertiesWnd      = new TstrokePropertiesWnd(this.gPaintStrokePropertiesId)
	this._paintStrokePropertiesBtn = new TpopupButton(this.gPaintStrokeId,
							  this._strokePropertiesWnd)

	this._mainMenuOptionsWnd       = new TmainMenuOptionsWnd(this.gMainMenuOptionsId)
	this._mainMenuBtn              = new TpopupButton(this.gMainMenuId,
							  this._mainMenuOptionsWnd)
	
	
	this.fPaintTool     = new TpaintTool()
	this.fSelectTool    = new TselectTool()
	this.fAddObjectTool = new TaddObjectTool()		

	this._currentTool   = this.fPaintTool

	this.activateToolStyle(this._paintBrushCtrl)
	
    }

    respondToClick(toolCtrl)
    {
	toolCtrl.addEventListener('pointerdown', (e) => {
	    this.toolChange(e)
	});
    }


    activateToolStyle(toolButtonCtrl)
    {
	const toolButtonPressColor      = TcssUtils.getCssVariableValue('--toolbutton-press-color')
	const toolButtonBorderRad       = TcssUtils.getCssVariableValue('--toolButton-press-border-radius')

	toolButtonCtrl.style.backgroundColor = toolButtonPressColor
	toolButtonCtrl.style.borderRadius    = toolButtonBorderRad
    }

    deactivateToolStyle(toolButtonCtrl)
    {
	const toolButtonBackgroundColor = TcssUtils.getCssVariableValue('--toolbar-background-color')

	toolButtonCtrl.style.backgroundColor = toolButtonBackgroundColor
    }

    
    toolChange(e)
    {

	if (e.target.id == this.gPaintBrushId) {
	    this.activateToolStyle(this._paintBrushCtrl)
	    
	    this.deactivateToolStyle(this._paintEraserCtrl)
	    this.deactivateToolStyle(this._selectCtrl)	    
	    this.deactivateToolStyle(this._paintRectangleCtrl)
	    this.deactivateToolStyle(this._paintCircleCtrl)	    

	    this.fPaintTool.setPaintMode()	    
	    this._currentTool = this.fPaintTool
	    
	} else if (e.target.id == this.gPaintEraserId) {
	    this.activateToolStyle(this._paintEraserCtrl)
	    
	    this.deactivateToolStyle(this._paintBrushCtrl)
	    this.deactivateToolStyle(this._selectCtrl)	    	    
	    this.deactivateToolStyle(this._paintRectangleCtrl)
	    this.deactivateToolStyle(this._paintCircleCtrl)	    

	    this.fPaintTool.setEraserMode()
	    this._currentTool = this.fPaintTool
	    
	} else if (e.target.id == this.gSelectId) {
	    this.activateToolStyle(this._selectCtrl)
	    
	    this.deactivateToolStyle(this._paintRectangleCtrl)	   
	    this.deactivateToolStyle(this._paintBrushCtrl)
	    this.deactivateToolStyle(this._paintEraserCtrl)
	    this.deactivateToolStyle(this._paintCircleCtrl)	    

	    this._currentTool = this.fSelectTool

	} else if (e.target.id == this.gPaintRectangleId) {
	    this.activateToolStyle(this._paintRectangleCtrl)
	    
	    this.deactivateToolStyle(this._paintBrushCtrl)
	    this.deactivateToolStyle(this._selectCtrl)	    	    
	    this.deactivateToolStyle(this._paintEraserCtrl)
	    this.deactivateToolStyle(this._paintCircleCtrl)	    

	    this.fAddObjectTool.setRectangleMode()
	    this._currentTool = this.fAddObjectTool
	    
	} else if (e.target.id == this.gPaintCircleId) {
	    this.activateToolStyle(this._paintCircleCtrl)
	    
	    this.deactivateToolStyle(this._paintBrushCtrl)
	    this.deactivateToolStyle(this._paintEraserCtrl)
	    this.deactivateToolStyle(this._selectCtrl)	    	    
	    this.deactivateToolStyle(this._paintRectangleCtrl)

	    this.fAddObjectTool.setCircleMode()	    	    
	    this._currentTool = this.fAddObjectTool	    
	}

	//this._currentTool.engage()
	
	e.stopPropagation()
    }
    
}

export default TmarginateToolbar
