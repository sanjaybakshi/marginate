import TpropertiesPanel from "./libs/TpropertiesPanel.js"
import Tslider          from "./libs/Tslider.js"
import TcheckBox        from "./libs/TcheckBox.js"


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


	
	fModel.fSelectionList.fSelectionChangeEvent.addListener(data => {
	    this.selectionChange(data)
	});

	this._activeCheckBox.disable()	
	this._dynamicCheckBox.disable()
	this._activateOnCollisionCheckBox.disable()		
	this._massSlider.disable()
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
	    
	} else {
	    this._activeCheckBox.enable()	    
	    this._dynamicCheckBox.enable()
	    this._activateOnCollisionCheckBox.enable()		
	    this._massSlider.enable()

	    let allActive               = true
	    let allDynamic              = true
	    let allActivateOnCollision  = true

	    for (const sObj of sList) {

		if (sObj.isActive() != true) {
		    allActive = false
		}
		
		if (sObj.isDynamic() != true) {
		    allDynamic = false
		}

		if (sObj.isActivatedOnCollision() != true) {
		    allActivateOnCollision = false
		}
	    }

	    this._activeCheckBox.setValue(allActive)	    
	    this._dynamicCheckBox.setValue(allDynamic)
	    this._activateOnCollisionCheckBox.setValue(allActivateOnCollision)

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
