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


	this.gDynamicCheckboxId              = "checkbox.dynamicId"
	this.gActivateOnCollisionCheckboxId  = "checkbox.activateOnCollisionId"	
	
	this._dynamicCheckBox = new TcheckBox(this.gDynamicCheckboxId,
					      this.dynamicChanged.bind(this))
	this._activateOnCollisionCheckBox = new TcheckBox(this.gActivateOnCollisionCheckboxId,
							  this.activateOnCollisionChanged)


	
	fModel.fSelectionList.fSelectionChangeEvent.addListener(data => {
	    this.selectionChange(data)
	});

	this._massSlider.disable()
	this._dynamicCheckBox.disable()
	this._activateOnCollisionCheckBox.disable()		
    }

    massChanged(v)
    {
	console.log(v)
    }

    dynamicChanged(v)
    {
	let sList = fModel.fSelectionList._sList
	for (const sObj of sList) {
	    
	    console.log(sObj)
	    
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
	    this._massSlider.disable()

	    this._dynamicCheckBox.disable()
	    this._activateOnCollisionCheckBox.disable()		
	    
	} else {
	    this._massSlider.enable()

	    this._dynamicCheckBox.enable()
	    this._activateOnCollisionCheckBox.enable()		

	    let allDynamic              = true
	    let allActivateOnCollision  = true

	    for (const sObj of sList) {

		if (sObj.isDynamic() != true) {
		    allDynamic = false
		}

		if (sObj.isActivatedOnCollision() != true) {
		    allActivateOnCollision = false
		}
	    }	    
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
	console.log("selection change")
	this.updateUI()
    }
}

export default TmarginatePropertiesPanel
