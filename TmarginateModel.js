import Tevent         from "./libs/Tevent.js"
import TimageUtils    from "./libs/TimageUtils.js";
import TselectionList from "./libs/TselectionList.js";

import TplanckWorld from "./planck/TplanckWorld.js";



class TmarginateModel {
    constructor()
    {
	this.fStrokeColor   = "#0000ff"
	this.fStrokeSize    = 2.0;
	this.fStrokeOpacity = 100;


	this.fFrameChangeEvent      = new Tevent()
	//this.fFrameRangeChangeEvent = new Tevent()

	this.fPauseAnim      = true
	
	this.fFrameDimensions = {width:512,height:512}

	this.fFrameImages = []

	this.fCurrentFrame   = 0
	this.setFrameRange(120)

	this.fPlanckWorld = new TplanckWorld(this.fFrameDimensions.width, this.fFrameDimensions.height, 10)

	this.fSelectionList = new TselectionList()
    }

    setPlayMode()
    {
	this.fPauseAnim = false
    }

    setPauseMode()
    {
	this.fPauseAnim = true
    }

    inPlayMode()
    {
	return !(this.inPauseMode())
    }
    inPauseMode()
    {
	return this.fPauseAnim
    }
    
    makeFrameImage()
    {
	var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
	
	this.fFrameImages[this.fCurrentFrame] = TimageUtils.makeImage(this.fFrameDimensions.width*scale,
								      this.fFrameDimensions.height*scale)
    }

    getGhostFrameImages()
    {
	let ghostImages = []
	for (let i=0; i < this.fCurrentFrame; i++) {
	    if (this.fFrameImages[i] != null) {
		ghostImages.push(this.fFrameImages[i])
	    }
	}
	return ghostImages
    }

    
    getFrameImage()
    {
	return this.fFrameImages[this.fCurrentFrame]
    }

    setFrameImage(img)
    {
	this.fFrameImages[this.fCurrentFrame] = img
    }
    
    setFrame(f)
    {
	this.fCurrentFrame = f
	
	if (this.fCurrentFrame >= this.fTotalNumFrames) {
	    this.fCurrentFrame = 0
	} else if (this.fCurrentFrame < 0) {
	    this.fCurrentFrame = 0
	}
	
	this.fFrameChangeEvent.trigger(this.fCurrentFrame)
    }
    
    setFrameRange(fr)
    {
	this.fTotalNumFrames = fr
	//this._frameRangeChangeEvent.trigger(this._totalNumFrames);

	for (let i=0; i < this.fTotalNumFrames; i++) {
	    this.fFrameImages.push(null)
	}
    }
    
    getCurrentFrame()
    {
	return this.fCurrentFrame
    }
    
    setSimulationDuration(durationInFrames)
    {
	this.fTotalNumFrames = durationInFrames
    }
    
    getDurationInFrames()
    {
	return this.fTotalNumFrames
    }	
}

const fModel = new TmarginateModel()

export { fModel };
