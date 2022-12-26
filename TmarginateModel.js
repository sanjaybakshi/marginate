import Tevent         from "./libs/Tevent.js"
import TimageUtils    from "./libs/TimageUtils.js";
import TselectionList from "./libs/TselectionList.js";

import TplanckWorld   from "./planck/TplanckWorld.js";
import TplanckObject  from "./planck/TplanckObject.js";



class TmarginateModel {
    constructor()
    {
	this.fStrokeColor   = "#0000ff"
	this.fStrokeSize    = 2.0;
	this.fStrokeOpacity = 100;


	this.fFrameChangeEvent      = new Tevent()
	//this.fFrameRangeChangeEvent = new Tevent()

	this.fPauseAnim      = true
	
	this.fFrameDimensions = {width:1024,height:512}

	this.fFrameImages = []

	this.fCurrentFrame   = 0
	this.setFrameRange(250)

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
	this.fFrameImages[this.fCurrentFrame] = TimageUtils.makeImage(this.fFrameDimensions.width,
								      this.fFrameDimensions.height)
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

	    this.fPlanckWorld.reset()
	    
	} else if (this.fCurrentFrame < 0) {
	    this.fCurrentFrame = 0
	}
	
	this.fPlanckWorld.setFrame(this.fCurrentFrame)	    

	this.fFrameChangeEvent.trigger(this.fCurrentFrame)
    }

    incrementFrame()
    {
	let f = this.fCurrentFrame

	f = f + 1
	
	if (f >= this.fTotalNumFrames) {
	    f = 0
	    this.fPlanckWorld.reset()
	    this.fPlanckWorld.setFrame(f)
	    
	} else if (f < 0) {
	    f = 0
	    this.fPlanckWorld.setFrame(f)
	    
	} else {
	    this.fPlanckWorld.setFrame(f)	    
	    this.fPlanckWorld.step()
	}
	this.fCurrentFrame = f
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

    addObject(objDict, updateSelectionList=true)
    {
	let newObj = fModel.fPlanckWorld.addObject(objDict)

	if (updateSelectionList == true) {
	    fModel.fSelectionList.replace([newObj])
	}
	return newObj
    }

    addObjects(objDictList)
    {
	let newObjects = []
	for (const objDict of objDictList) {
	    let newOne = this.addObject(objDict, false)
	    newObjects.push(newOne)
	}
	fModel.fSelectionList.replace(newObjects)	
    }
    
    removeObject(obj)
    {
	fModel.fSelectionList.remove(obj)	
	fModel.fPlanckWorld.removeObject(obj)
    }

    addJoint(jointDict, updateSelectionList=true)
    {
	let obj1 = null
	let obj1Pos = {x:0,y:0}
	let obj2 = null
	let obj2Pos = {x:0,y:0}

	if ('obj1' in jointDict) {
	    obj1 = jointDict.obj1
	}

	if ('obj1Pos' in jointDict) {
	    obj1Pos = jointDict.obj1Pos
	}

	if ('obj2' in jointDict) {
	    obj2 = jointDict.obj2
	}

	if ('obj2Pos' in jointDict) {
	    obj2Pos = jointDict.obj2Pos
	}
	
	let newJoint = fModel.fPlanckWorld.addJoint(obj1, obj1Pos, obj2, obj2Pos,
						    fModel.getCurrentFrame(),
						    fModel.getCurrentFrame())
	
	if (updateSelectionList == true) {
	    fModel.fSelectionList.replace([newJoint])
	}
	
	return newJoint
    }

    editObject(obj, objDict)
    {	
	fModel.fPlanckWorld.editObject(obj, objDict)
    }

    dict2Model(mDict)
    {
	let modelInfo  = mDict.model
	let planckInfo = mDict.planck

	
	this.fPlanckWorld.dict2world(planckInfo)	
    }

    model2Dict()
    {
	let modelInfo  = {name: "sanjay"}
	let planckInfo = this.fPlanckWorld.world2dict()

	return {model: modelInfo,
		planck: planckInfo}
    }
}

const fModel = new TmarginateModel()

export { fModel };
