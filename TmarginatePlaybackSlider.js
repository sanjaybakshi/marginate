import TplaybackSlider from "./libs/TplaybackSlider.js"

import { fModel } from './TmarginateModel.js'


class TmarginatePlaybackSlider extends TplaybackSlider
{
    constructor(playbackSliderId)
    {
	super(playbackSliderId)


	this.setRange(1, fModel.getDurationInFrames())
	this.setValue(fModel.getCurrentFrame()+1)

	
	this.setPlayMode(fModel.inPlayMode())

	fModel.fFrameChangeEvent.addListener(data => {
	    this.frameChange(data)
	});
    }

    sliderChange(e)
    {
	super.sliderChange(e)

	fModel.setFrame(e.target.value-1)
    }

    playPauseClick(e)
    {
	super.playPauseClick(e)

	if (this.inPlayMode()) {
	    fModel.setPauseMode()
	} else {
	    fModel.setPlayMode()
	}
    }

    frameChange(data)
    {
	this.setValue(data+1)
    }
}

export default TmarginatePlaybackSlider
