import Tcanvas      from "./libs/Tcanvas.js";
import TplanckWorld from "./planck/TplanckWorld.js";

import { fModel }   from './TmarginateModel.js'


class TmarginateCanvas extends Tcanvas
{
    constructor(canvasId, parentVC)
    {
	super(canvasId)

	this.fParentVC = parentVC
	
	window.requestAnimationFrame(this.draw);

	this._div.addEventListener('pointerdown', (e) => {
	    this.pointerDown(e)
	});
	
	this._div.addEventListener('pointermove', (e) => {
	    this.pointerMove(e);
	});

	this._div.addEventListener('pointerup', (e) => {
	    this.pointerUp(e);
	});

	this._div.addEventListener('pointerleave', (e) => {
	    this.pointerUp(e);
	});

	this.fLastFrameImage = null
    }

    draw = () => {

	if (fModel.inPlayMode()) {
	    this.drawPlayMode()
	} else {
	    this.drawPauseMode()
	}
    }

    drawPlayMode()
    {
	fModel.fPlanckWorld.step()
	
	this.incrementFrame()

	let wh = this.getWidthHeight()
	this.fContext.clearRect(0, 0, wh.width, wh.height)

	let img = fModel.getFrameImage()

	if (img == null && this.fLastFrameImage != null) {
	    img = this.fLastFrameImage
	}

	if (img != null) {
	    this.fContext.drawImage(img, 0, 0, img.width/2, img.height/2)
	    this.fLastFrameImage = img
	} 

	fModel.fPlanckWorld.draw(this.fContext, false)

	
	this.fContext.save()
	
	this.fContext.font = '18px ' + 'Avenir'
	this.fContext.textBaseline = 'top';
	this.fContext.fillText('A B CDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz Sanjay Dutt', 256,256)
	this.fContext.restore()	
	
	this.fParentVC.vcDraw(this.fContext)
	
	window.requestAnimationFrame(this.draw);	
    }

    drawPauseMode()
    {
	let wh = this.getWidthHeight()
	this.fContext.clearRect(0, 0, wh.width, wh.height)

	let ghostImages = fModel.getGhostFrameImages()

	for (const gImg of ghostImages) {
	    this.fContext.globalAlpha = 0.5
	    this.fContext.drawImage(gImg, 0, 0, gImg.width/2, gImg.height/2)
	}

	this.fContext.globalAlpha = 1.0
	
	let img = fModel.getFrameImage()
	
	if (img != null) {
	    this.fContext.drawImage(img, 0, 0, img.width/2, img.height/2)
	    this.fLastFrameImage = img
	} 


	fModel.fPlanckWorld.draw(this.fContext, true)
	
	this.fContext.save()
	
	this.fContext.font = '18px ' + 'Avenir'
	this.fContext.textBaseline = 'top';
	this.fContext.fillText('ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz Sanjay Dutt', 256,256)
	this.fContext.restore()	

	this.fParentVC.vcDraw(this.fContext)
	
	window.requestAnimationFrame(this.draw);
    }

    incrementFrame()
    {
	let f = fModel.getCurrentFrame()

	f = f + 1
	
	if (f >= fModel.fTotalNumFrames) {
	    f = 0
	    this.fLastFrameImage = null

	    fModel.fPlanckWorld.reset()
	    
	} else if (f < 0) {
	    f = 0
	    this.fLastFrameImage = null	    
	}

	fModel.fPlanckWorld.setFrame(f)
	
	fModel.setFrame(f)
    }
    
    setWidthHeight(wh)
    {
	super.setWidthHeight(wh)
	
	var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.	
    }

    pointerDown(e)
    {
	this.fParentVC.vcPointerDown(e, this)	
    }

    pointerUp(e)
    {
	this.fParentVC.vcPointerUp(e, this)		
    }

    pointerMove(e)
    {
	this.fParentVC.vcPointerMove(e, this)
    }    
    

}

export default TmarginateCanvas
