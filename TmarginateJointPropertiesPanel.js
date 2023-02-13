import Tdiv             from "./libs/Tdiv.js"
import TcheckBox        from "./libs/TcheckBox.js"

import { fModel } from './TmarginateModel.js'

class TmarginateJointPropertiesPanel extends Tdiv
{
    constructor(jointPropertiesPanelId)
    {
	super(jointPropertiesPanelId)
	
	this.gCollideConnectedCheckboxId = "checkbox.collideConnectedId"

	this._collideConnectedCheckBox = new TcheckBox(this.gCollideConnectedCheckboxId,
						       this.collideConnectedChanged.bind(this))
	

	this._collideConnectedCheckBox.disable()
	
    }

    collideConnectedChanged(v)
    {
	let sList = fModel.fSelectionList._sList
	for (const sObj of sList) {

	    if (sObj.constructor.name == "TplanckJoint") {
		sObj.setCollideConnected(v)
		console.log(v)
	    }
	}	
    }
    
    
    enableControls()
    {
	this.show()

	let sList = fModel.fSelectionList._sList

	this._collideConnectedCheckBox.enable()	    

	let allCollideConnected = true

	for (const sObj of sList) {
	    
	    if (sObj.constructor.name == "TplanckJoint") {
		if (sObj.collideConnected() != true) {
		    allCollideConnected = false
		}
	    }
	}

	console.log(allCollideConnected)
	this._collideConnectedCheckBox.setValue(allCollideConnected)	
    }

    
    disableControls()
    {
	this.hide()
    }
}

export default TmarginateJointPropertiesPanel

	
