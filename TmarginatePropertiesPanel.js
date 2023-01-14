import TpropertiesPanel from "./libs/TpropertiesPanel.js"
import Tslider          from "./libs/Tslider.js"
import TcheckBox        from "./libs/TcheckBox.js"
import TnumberField     from "./libs/TnumberField.js"


import { fModel } from './TmarginateModel.js'


class TmarginatePropertiesPanel extends TpropertiesPanel
{
    constructor(propertiesPanelId)
    {
	super(propertiesPanelId)

	this.gSliderMassId    = "slider.massId"
	this.gNumberMassId    = "number.massId"

	this._massSlider = new Tslider(this.gSliderMassId,
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
	
	
	fModel.fSelectionList.fSelectionChangeEvent.addListener(data => {
	    this.selectionChange(data)
	});

	this._activeCheckBox.disable()	
	this._dynamicCheckBox.disable()
	this._activateOnCollisionCheckBox.disable()		
	this._massSlider.disable()

	this._positionXfield.disable()
	this._positionYfield.disable()	
	this._widthField.disable()
	this._heightField.disable()

	this._showSpriteCheckBox.disable()	
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
	
	this.updateUI()
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
	
	this.updateUI()
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
	
	this.updateUI()
    }

    widthChanged(v)
    {
	let d = {}
	let sList = fModel.fSelectionList._sList
	for (const sObj of sList) {
	    fModel.editObject(sObj, {width: v})
	}	
	this.updateUI()
    }
    heightChanged(v)
    {
	let d = {}
	let sList = fModel.fSelectionList._sList
	for (const sObj of sList) {
	    fModel.editObject(sObj, {height: v})
	}	
	this.updateUI()
    }

    showSpriteChanged(v)
    {
	let sList = fModel.fSelectionList._sList
	for (const sObj of sList) {
	    
	    sObj.setShowSprite(v)
	}
	
	this.updateUI()
    }
    
    updateUI()
    {
	let sList = fModel.fSelectionList._sList
	
	if (sList.length == 0) {
	    // Disable the ui-controls.
	    //
	    this._activeCheckBox.disable()	    
	    this._dynamicCheckBox.disable()
	    this._activateOnCollisionCheckBox.disable()		

	    this._massSlider.disable()

	    this._positionXfield.disable()
	    this._positionYfield.disable()	    
	    this._widthField.disable()
	    this._heightField.disable()

	    this._showSpriteCheckBox.disable()
	    
	} else {
	    this._activeCheckBox.enable()	    
	    this._dynamicCheckBox.enable()
	    this._activateOnCollisionCheckBox.enable()		
	    this._massSlider.enable()

	    this._positionXfield.enable()
	    this._positionYfield.enable()	    
	    this._widthField.enable()
	    this._heightField.enable()	    
	    this._showSpriteCheckBox.enable()
	    
	    let allActive               = true
	    let allDynamic              = true
	    let allActivateOnCollision  = true
	    let allShowSprite           = true
	    
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
		    this._widthField.setValue(sObj.widthInPixels())
		    this._heightField.setValue(sObj.heightInPixels())
		}
	    }

	    this._activeCheckBox.setValue(allActive)	    
	    this._dynamicCheckBox.setValue(allDynamic)
	    this._activateOnCollisionCheckBox.setValue(allActivateOnCollision)
	    this._showSpriteCheckBox.setValue(allShowSprite)
	    
	    if (allDynamic == false) {
		// All are static so disable activateOnCollision.
		//
		this._activateOnCollisionCheckBox.disable()		

	    }
	}	
    }
    
    selectionChange(sList)
    {
	this.updateUI()
    }
}

export default TmarginatePropertiesPanel
