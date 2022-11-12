import TpropertiesPanel from "./libs/TpropertiesPanel.js"
import Tslider          from "../libs/Tslider.js"
import TcheckBox        from "../libs/TcheckBox.js"


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


	this.gStaticCheckboxId               = "checkbox.staticId"
	this.gStaticUntilCollisionCheckboxId = "checkbox.staticUntilCollisionId"	
	
	this._staticCheckBox = new TcheckBox(this.gStaticCheckboxId,
					     this.staticChanged)
	this._staticUntilCollisionCheckBox = new TcheckBox(this.gStaticUntilCollisionCheckboxId,
							   this.staticUntilCollisionChanged)


	
	fModel.fSelectionList.fSelectionChangeEvent.addListener(data => {
	    this.selectionChange(data)
	});

	this._massSlider.disable()
	this._staticCheckBox.disable()
	this._staticUntilCollisionCheckBox.disable()		
    }

    massChanged(v)
    {
	console.log(v)
    }

    staticChanged(v)
    {
	console.log(v)

	let sList = fModel.fSelectionList._sList
	for (const sObj of sList) {

	    if (v == true) {
		sObj.setStatic()
	    } else {
		sObj.setDynamic()
	    }
	}
    }

    staticUntilCollisionChanged(v)
    {
	console.log(v)
	
	let sList = fModel.fSelectionList._sList	
	for (const sObj of sList) {
	    
	    sObj.setActivateOnCollision(v)
	}	
    }
    
    selectionChange(sList)
    {
	console.log("selection change")

	if (sList.length == 0) {
	    // Disable the ui-controls.
	    //
	    this._massSlider.disable()

	    this._staticCheckBox.disable()
	    this._staticUntilCollisionCheckBox.disable()		
	    
	} else {
	    this._massSlider.enable()

	    this._staticCheckBox.enable()
	    this._staticUntilCollisionCheckBox.enable()		

	    let allStatic               = true
	    let allStaticUntilCollision = true

	    for (const sObj of sList) {

		if (sObj.isDynamic()) {
		    allStatic = false
		}

		if (sObj.isActivatedOnCollision()) {
		    allStaticUntilCollision = false
		}
	    }

	    this._staticCheckBox.setValue(allStatic)
	    this._staticUntilCollisionCheckBox.setValue(allStaticUntilCollision)
	}
    }
}

export default TmarginatePropertiesPanel
