import Tdiv from "./Tdiv.js"

class TplaybackSlider extends Tdiv
{
    constructor(sliderId) {

	super(sliderId)
	
	this.gPlayPauseBtnId = "playPauseBtn"
	this.gPlaySliderId   = "playSlider"
	this.gPlayFrameId    = "playFrameNumber"
	
	this._playPauseBtn        = document.getElementById(this.gPlayPauseBtnId)
	this._playSliderCtrl      = document.getElementById(this.gPlaySliderId)
	this._playFrameNumberCtrl = document.getElementById(this.gPlayFrameId)

	this._playPauseBtn.addEventListener('click', (e) => {
	    this.playPauseClick(e)
	});

	this._playSliderCtrl.addEventListener('input', (e) => {
	    this.sliderChange(e)
	});
/*
	this._canvas._frameChangeEvent.addListener(data => {
	    this.frameChange(data)
	});

	this._canvas._frameRangeChangeEvent.addListener(data => {
	    this.frameRangeChange(data)
	});
*/
    }

    
    playPauseClick(e)
    {
	if (this.inPauseMode()) {
	    this.setPlayMode()
	} else {
	    this.setPauseMode()
	}
    }

    sliderChange(e)
    {
	let v = String(e.target.value)
	this._playFrameNumberCtrl.value = v
    }

    frameChange(data)
    {
	this._playSliderCtrl.value = data

	this._playFrameNumberCtrl.value = data
    }

    /*
    frameRangeChange(data)
    {
	this._playSliderCtrl.max = data
    }
    */
    setValue(v)
    {
	this._playSliderCtrl.value = v
	this._playFrameNumberCtrl.value = v

    }

    setRange(min, max)
    {
	this._playSliderCtrl.min = min
	this._playSliderCtrl.max = max
    }

    setPlayMode()
    {
	this._playPauseBtn.src = "./icons/Play2.png"	
    }

    setPauseMode()
    {
	this._playPauseBtn.src = "./icons/Pause2.png"	
    }

    inPauseMode()
    {
	return this._playPauseBtn.src.includes("Pause")
    }
    inPlayMode()
    {
	return !(this.inPauseMode())
    }
}


export default TplaybackSlider;

