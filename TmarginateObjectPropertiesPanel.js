import Tslider          from "./libs/Tslider.js"
import TcheckBox        from "./libs/TcheckBox.js"
import TnumberField     from "./libs/TnumberField.js"
import Tdiv             from "./libs/Tdiv.js"

import { fModel } from './TmarginateModel.js'


class TmarginateObjectPropertiesPanel extends Tdiv
{
    constructor(objectPropertiesPanelId)
    {
	super(objectPropertiesPanelId)

	this.gSliderParentMassId = "sliderParent.massId"
	
	this.gSliderMassId    = "slider.massId"
	this.gNumberMassId    = "number.massId"

	this._massSlider = new Tslider(this.gSliderParentMassId,
				       this.gSliderMassId,
				       this.gNumberMassId,
				       this.massChanged)


	this.gActiveCheckboxId               = "checkbox.activeId"	
	this.gDynamicCheckboxId              = "checkbox.dynamicId"
	this.gActivateOnCollisionCheckboxId  = "checkbox.activateOnCollisionId"	
	
	this._activeCheckBox = new TcheckBox(this.gActiveCheckboxId,
					     this.activeChanged.bind(this))
	this._dynamicCheckBox = new TcheckBox(this.gDynamicCheckboxId,
					      this.dynamicChanged.bind(this))
	this._activateOnCollisionCheckBox = new TcheckBox(this.gActivateOnCollisionCheckboxId,
							  this.activateOnCollisionChanged)


	this.gPositionXId = "number.posX"
	this.gPositionYId = "number.posY"	

	this._positionXfield = new TnumberField(this.gPositionXId,
						this.positionChanged.bind(this))
	this._positionYfield = new TnumberField(this.gPositionYId,
						this.positionChanged.bind(this))

	this.gWidthId  = "number.width"
	this.gHeightId = "number.height"	

	this._widthField = new TnumberField(this.gWidthId,
					    this.widthChanged.bind(this))
	this._heightField = new TnumberField(this.gHeightId,
					     this.heightChanged.bind(this))


	this.gShowSpriteCheckboxId  = "checkbox.showSpriteId"	
	
	this._showSpriteCheckBox = new TcheckBox(this.gShowSpriteCheckboxId,
						 this.showSpriteChanged.bind(this))

	this.gShowBorderCheckboxId  = "checkbox.showBorderId"	
	
	this._showBorderCheckBox = new TcheckBox(this.gShowBorderCheckboxId,
						 this.showBorderChanged.bind(this))
	
	this._activeCheckBox.disable()	
	this._dynamicCheckBox.disable()
	this._activateOnCollisionCheckBox.disable()		
	this._massSlider.disable()

	this._positionXfield.disable()
	this._positionYfield.disable()	
	this._widthField.disable()
	this._heightField.disable()

	this._showSpriteCheckBox.disable()
	this._showBorderCheckBox.disable()	
	
    }
    massChanged(v)
    {
	console.log(v)
    }

    activeChanged(v)
    {
	let sList = fModel.fSelectionList._sList
	for (const sObj of sList) {
	    
	    if (v == true) {
		sObj.setActive()
	    } else {
		sObj.setInActive()
	    }
	}
	
    }

    dynamicChanged(v)
    {
	let sList = fModel.fSelectionList._sList
	for (const sObj of sList) {
	    
	    if (v == true) {
		sObj.setDynamic()
	    } else {
		sObj.setStatic()
	    }
	}
	
    }

    activateOnCollisionChanged(v)
    {
	let sList = fModel.fSelectionList._sList	
	for (const sObj of sList) {	    
	    sObj.setActivateOnCollision(v)
	}	
    }

    positionChanged(v)
    {
	let sList = fModel.fSelectionList._sList
	for (const sObj of sList) {
	    sObj.setPosition()
	}
    }

    widthChanged(v)
    {
	let d = {}
	let sList = fModel.fSelectionList._sList
	for (const sObj of sList) {
	    fModel.editObject(sObj, {width: v})
	}	
    }
    heightChanged(v)
    {
	let d = {}
	let sList = fModel.fSelectionList._sList
	for (const sObj of sList) {
	    fModel.editObject(sObj, {height: v})
	}	
    }

    showSpriteChanged(v)
    {
	let sList = fModel.fSelectionList._sList
	for (const sObj of sList) {
	    
	    sObj.setShowSprite(v)
	}
    }

    showBorderChanged(v)
    {
	let sList = fModel.fSelectionList._sList
	for (const sObj of sList) {
	    
	    sObj.setShowBorder(v)
	}
    }
    
    enableControls()
    {
	this.show()

	let sList = fModel.fSelectionList._sList

	this._activeCheckBox.enable()	    
	this._dynamicCheckBox.enable()
	this._activateOnCollisionCheckBox.enable()		
	this._massSlider.enable()
	this._massSlider.show()
	
	this._positionXfield.enable()
	this._positionYfield.enable()	    
	this._widthField.enable()
	this._heightField.enable()	    
	this._showSpriteCheckBox.enable()
	this._showBorderCheckBox.enable()
	
	let allActive               = true
	let allDynamic              = true
	let allActivateOnCollision  = true
	let allShowSprite           = true
	let allShowBorder           = true
	
	for (const sObj of sList) {
	    
	    if (sObj.constructor.name == "TplanckObject") {
		if (sObj.isActive() != true) {
		    allActive = false
		}
		
		if (sObj.isDynamic() != true) {
		    allDynamic = false
		}
		
		if (sObj.isActivatedOnCollision() != true) {
		    allActivateOnCollision = false
		}
		
		if (sObj.isShowingSprite() != true) {
		    allShowSprite = false
		}
		if (sObj.isShowingBorder() != true) {
		    allShowBorder = false
		}
		this._widthField.setValue(sObj.widthInPixels())
		this._heightField.setValue(sObj.heightInPixels())
	    }
	}
	
	this._activeCheckBox.setValue(allActive)	    
	this._dynamicCheckBox.setValue(allDynamic)
	this._activateOnCollisionCheckBox.setValue(allActivateOnCollision)
	this._showSpriteCheckBox.setValue(allShowSprite)
	this._showBorderCheckBox.setValue(allShowBorder)
	
	if (allDynamic == false) {
	    // All are static so disable activateOnCollision.
	    //
	    this._activateOnCollisionCheckBox.disable()		
	    
	}	
    }

    
    disableControls()
    {
	this.hide()


	/*
	// Disable the ui-controls.
	//
	this._activeCheckBox.disable()	    
	this._dynamicCheckBox.disable()
	this._activateOnCollisionCheckBox.disable()		
	
	this._massSlider.disable()

	this._massSlider.hide()
	
	this._positionXfield.disable()
	this._positionYfield.disable()	    
	this._widthField.disable()
	this._heightField.disable()
	
	this._showSpriteCheckBox.disable()

	this.fObjectPanel.hide()
	*/
    }

}

export default TmarginateObjectPropertiesPanel

	
