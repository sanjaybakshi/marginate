import TmarginateCanvas          from "./TmarginateCanvas.js";
import TmarginatePropertiesPanel from "./TmarginatePropertiesPanel.js";
import TmarginateToolbar         from "./TmarginateToolbar.js";
import TmarginatePlaybackSlider  from "./TmarginatePlaybackSlider.js";

import { fModel } from './TmarginateModel.js'

class TmarginateVC
{
    constructor()
    {
	this.gCanvasId          = 'paintCanvasId' // Change this to marginateCanvasId
	this.gPlaybackSliderId  = 'playBackCtrl'
	this.gToolbarId         = 'paintToolbarId'

	this.gPropertiesPanelId       = 'propertiesId'
	this.gObjectPropertiesPanelId = 'objectPropertiesId' 
	this.gJointPropertiesPanelId  = 'jointPropertiesId' 
	
	this.fCanvas          = new TmarginateCanvas(this.gCanvasId, this)
	this.fPropertiesPanel = new TmarginatePropertiesPanel(this.gPropertiesPanelId,
							      this.gObjectPropertiesPanelId,
							      this.gJointPropertiesPanelId,
							      this)	
	this.fToolbar         = new TmarginateToolbar(this.gToolbarId, this.fCanvas)
	this.fPlaybackSlider  = new TmarginatePlaybackSlider(this.gPlaybackSliderId)

	this.fCanvas.setWidthHeight(fModel.fFrameDimensions)
	
	this.layoutControls()

	

	window.addEventListener('resize', this.layoutControls.bind(this));	
    }

    layoutControls()
    {
	let propertiesPanelWidth = 250
	
	let newWindowWidth  = window.innerWidth
	let newWindowHeight = window.innerHeight
		
	let sliderWH = this.fPlaybackSlider.getWidthHeight()
	this.fPlaybackSlider.setWidthHeight({width: window.innerWidth, height: sliderWH.height})
	
	this.fPlaybackSlider.showAt({x:0, y:window.innerHeight - sliderWH.height - 0})

	let toolbarWidthHeight = this.fToolbar.getWidthHeight()
	let toolbarPos         = this.fToolbar.getPosition()

	let timeSliderPos      = this.fPlaybackSlider.getPosition()


	
	let canvasWidthHeight = this.fCanvas.getWidthHeight()

	let x = newWindowWidth  / 2 - (canvasWidthHeight.width+propertiesPanelWidth)/2
	let y = newWindowHeight / 2 - (canvasWidthHeight.height)/2

	let heightAvailable = timeSliderPos.y - (toolbarPos.y + toolbarWidthHeight.height)
	let middleHeightY = (toolbarPos.y + toolbarWidthHeight.height) + (heightAvailable/2)
	
	y = middleHeightY - canvasWidthHeight.height/2

	this.fCanvas.showAt({x:x,y: y})

	
	//let ppHeight = timeSliderPos.y - (toolbarPos.y+toolbarWidthHeight.height)
	//let ppHeight = timeSliderPos.y - (toolbarPos.y + toolbarWidthHeight.height+20);

	//ppHeight = timeSliderPos.y - (toolbarPos.y + toolbarWidthHeight.height);

	//let ppHeight = timeSliderPos.y - (toolbarPos.y + toolbarWidthHeight.height)
	let ppHeight = timeSliderPos.y - (toolbarPos.y + toolbarWidthHeight.height)
	
	this.fPropertiesPanel.setWidthHeight({width:propertiesPanelWidth, height: ppHeight})

	this.fPropertiesPanel.showAt({x:window.innerWidth - propertiesPanelWidth, y: toolbarPos.y+toolbarWidthHeight.height})
	//this.fPropertiesPanel.showAt({x:window.innerWidth - propertiesPanelWidth, y: toolbarPos.y+toolbarWidthHeight.height-100})
    }

    vcDraw(ctx)
    {
	this.fToolbar.draw(ctx)
    }

    vcPointerDown(e)
    {
	this.fToolbar.pointerDown(e, this)	
    }

    vcPointerUp(e)
    {
	this.fToolbar.pointerUp(e, this)		
    }

    vcPointerMove(e)
    {
	this.fToolbar.pointerMove(e, this)
    }    
    
}    


export default TmarginateVC
