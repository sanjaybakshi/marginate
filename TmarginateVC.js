import TmarginateCanvas         from "./TmarginateCanvas.js";
import TmarginateToolbar        from "./TmarginateToolbar.js";
import TmarginatePlaybackSlider from "./TmarginatePlaybackSlider.js";

import { fModel } from './TmarginateModel.js'

class TmarginateVC
{
    constructor()
    {
	this.gCanvasId         = 'paintCanvasId' // Change this to marginateCanvasId
	this.gPlaybackSliderId = 'playBackCtrl'
	this.gToolbarId        = 'playBackCtrl' 
	
	this.fCanvas         = new TmarginateCanvas(this.gCanvasId, this)
	this.fToolbar        = new TmarginateToolbar(this.gToolbarId)
	this.fPlaybackSlider = new TmarginatePlaybackSlider(this.gPlaybackSliderId)

	this.fCanvas.setWidthHeight(fModel.fFrameDimensions)
	
	this.layoutControls()

	

	window.addEventListener('resize', this.layoutControls.bind(this));	
    }

    layoutControls()
    {
	let newWindowWidth  = window.innerWidth
	let newWindowHeight = window.innerHeight
	
	let canvasWidthHeight = this.fCanvas.getWidthHeight()
	let x = newWindowWidth  / 2 - canvasWidthHeight.width/2
	let y = newWindowHeight / 2 - canvasWidthHeight.height/2
	
	this.fCanvas.showAt({x:x,y:y})
	
	let sliderWH = this.fPlaybackSlider.getWidthHeight()
	this.fPlaybackSlider.setWidthHeight({width: window.innerWidth, height: sliderWH.height})
	
	this.fPlaybackSlider.showAt({x:0, y:window.innerHeight - sliderWH.height})
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
