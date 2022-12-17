import Ttoolbar             from "./libs/Ttoolbar.js"
import TcssUtils            from "./libs/TcssUtils.js"
import TpopupButton         from "./libs/TpopupButton.js"

import TstrokePropertiesWnd from "./tools/TstrokePropertiesWnd.js"
import TmainMenuOptionsWnd  from "./tools/TmainMenuOptionsWnd.js"
import TpaintTool           from "./tools/TpaintTool.js"
import TselectTool          from "./tools/TselectTool.js"
import TxformTool           from "./tools/TxformTool.js"

import TaddObjectTool       from "./tools/TaddObjectTool.js"

import TscissorsTool        from "./tools/TscissorsTool.js"
import TjointTool           from "./tools/TjointTool.js"

class TmarginateToolbar extends Ttoolbar
{
    constructor(toolbarId, canvas)
    {
	super(toolbarId, canvas)

	this.gPaintColorId            = "paintColorId"
	this.gPaintStrokeId           = "paintStrokeId"

	this.gPaintBrushId            = "paintBrushId"	
	this.gPaintEraserId           = "paintEraserId"

	this.gSelectId                = "selectId"
	this.gXformId                 = "xformId"			
	this.gScissorsId              = "scissorsId"
	this.gJointId                 = "jointId"

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

	this._xformCtrl  = document.getElementById(this.gXformId)
	this.respondToClick(this._xformCtrl)

	this._scissorsCtrl  = document.getElementById(this.gScissorsId)
	this.respondToClick(this._scissorsCtrl)

	this._jointCtrl  = document.getElementById(this.gJointId)
	this.respondToClick(this._jointCtrl)

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
	
	
	this.fPaintTool     = new TpaintTool(this.fCanvas)
	this.fSelectTool    = new TselectTool(this.fCanvas)
	this.fXformTool     = new TxformTool(this.fCanvas)
	this.fScissorsTool  = new TscissorsTool(this.fCanvas)
	this.fJointTool     = new TjointTool(this.fCanvas)

	

	this.fAddObjectTool = new TaddObjectTool(this.fCanvas)		

	this.setTool(this.fPaintTool)

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
    
    deactivateAllToolStyles()
    {
	this.deactivateToolStyle(this._paintBrushCtrl)	    
	this.deactivateToolStyle(this._paintEraserCtrl)
	this.deactivateToolStyle(this._selectCtrl)
	this.deactivateToolStyle(this._xformCtrl)
	this.deactivateToolStyle(this._scissorsCtrl)
	this.deactivateToolStyle(this._jointCtrl)
	this.deactivateToolStyle(this._paintRectangleCtrl)
	this.deactivateToolStyle(this._paintCircleCtrl)	    
    }
    
    toolChange(e)
    {

	if (e.target.id == this.gPaintBrushId) {
	    this.deactivateAllToolStyles()
	    this.activateToolStyle(this._paintBrushCtrl)

	    this.fPaintTool.setPaintMode()	    
	    this.setTool(this.fPaintTool)
	    
	} else if (e.target.id == this.gPaintEraserId) {
	    this.deactivateAllToolStyles()
	    this.activateToolStyle(this._paintEraserCtrl)

	    this.fPaintTool.setEraserMode()
	    this.setTool(this.fPaintTool)
	    
	} else if (e.target.id == this.gSelectId) {
	    this.deactivateAllToolStyles()
	    this.activateToolStyle(this._selectCtrl)

	    this.setTool(this.fSelectTool)

	} else if (e.target.id == this.gXformId) {
	    this.deactivateAllToolStyles()
	    this.activateToolStyle(this._xformCtrl)

	    this.setTool(this.fXformTool)

	} else if (e.target.id == this.gScissorsId) {
	    this.deactivateAllToolStyles()
	    this.activateToolStyle(this._scissorsCtrl)	    

	    this.setTool(this.fScissorsTool)

	} else if (e.target.id == this.gJointId) {
	    this.deactivateAllToolStyles()
	    this.activateToolStyle(this._jointCtrl)	    

	    this.setTool(this.fJointTool)
	    
	} else if (e.target.id == this.gPaintRectangleId) {
	    this.deactivateAllToolStyles()
	    this.activateToolStyle(this._paintRectangleCtrl)

	    this.fAddObjectTool.setRectangleMode()
	    this.setTool(this.fAddObjectTool)
	    
	} else if (e.target.id == this.gPaintCircleId) {
	    this.deactivateAllToolStyles()
	    this.activateToolStyle(this._paintCircleCtrl)
	    
	    this.fAddObjectTool.setCircleMode()	    	    
	    this.setTool(this.fAddObjectTool)
	}

	//this._currentTool.engage()
	
	e.stopPropagation()
    }
    
}

export default TmarginateToolbar
