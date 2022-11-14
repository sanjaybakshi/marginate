import Tcanvas      from "./libs/Tcanvas.js";
import TplanckWorld from "./planck/TplanckWorld.js";

import Tpointer     from "./libs/Tpointer.js";
import ThtmlUtils   from "./libs/ThtmlUtils.js"

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

	// Hand drag and drop.
	//
	this._div.addEventListener('drop', (e) => {
	    this.onDrop(e);
	});

	this._div.addEventListener('dragover', (e) => {
	    this.onDragOver(e);
	});

	this._div.addEventListener('dragenter', (e) => {
	    this.onDragEnter(e);
	});

	// Handle copy and paste.
	//
	document.onpaste = this.onPaste.bind(this)

	this.fMousePosition = null

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
	fModel.incrementFrame()

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

	// Draw the selected objects with different draw characteristics.
	///
	fModel.fPlanckWorld.drawAnnotated(this.fContext, fModel.fSelectionList._sList)
	
	this.fContext.save()
	
	this.fContext.font = '18px ' + 'Avenir'
	this.fContext.textBaseline = 'top';
	this.fContext.fillText('ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz Sanjay Dutt', 256,256)
	this.fContext.restore()	

	this.fParentVC.vcDraw(this.fContext)
	
	window.requestAnimationFrame(this.draw);
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


	let pointerInfo = Tpointer.getPointer(e)
	this.fMousePosition = pointerInfo	
    }    

    // Handle drag and drop.
    //
    onDragOver(e)
    {

	console.log(pointerInfo)
	
	e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.	
	e.preventDefault()
    }

    onDragEnter(e)
    {
	e.preventDefault()
    }

    onDrop(e)
    {
	e.preventDefault()
    }

    // Handle copy and paste.
    //	
    async onPaste(e)
    {
	e.preventDefault()
	
	var pastedImage = await ThtmlUtils.clipboard2image(e)

	fModel.addObject({center: {x:this.fMousePosition.x, y: this.fMousePosition.y},
			  sprite:  pastedImage})
	
    }
}

export default TmarginateCanvas
