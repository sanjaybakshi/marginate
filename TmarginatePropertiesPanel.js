import TpropertiesPanel                from "./libs/TpropertiesPanel.js"
import TmarginateObjectPropertiesPanel from "./TmarginateObjectPropertiesPanel.js"
import TmarginateJointPropertiesPanel  from "./TmarginateJointPropertiesPanel.js"

import { fModel } from './TmarginateModel.js'

class TmarginatePropertiesPanel extends TpropertiesPanel
{
    constructor(propertiesPanelId, objectPropertiesPanelId, jointPropertiesPanelId)
    {
	super(propertiesPanelId)
	
	this.fObjectPanel = new TmarginateObjectPropertiesPanel(objectPropertiesPanelId)
	this.fJointPanel  = new TmarginateJointPropertiesPanel (jointPropertiesPanelId)
	
	
	fModel.fSelectionList.fSelectionChangeEvent.addListener(data => {
	    this.selectionChange(data)
	});
    }

    selectionChange()
    {
	let sList = fModel.fSelectionList._sList
	
	let allObjects = true
	let allJoints  = true
	
	for (const sObj of sList) {
	    if (sObj.constructor.name != "TplanckObject") {
		allObjects = false
	    }
	    if (sObj.constructor.name != "TplanckJoint") {
		allJoints = false
	    }
	}

	if (sList.length == 0) {
	    this.fObjectPanel.disableControls()
	    this.fJointPanel.disableControls()
	} else {

	    if (allObjects == true) {
		this.fJointPanel.disableControls()
		this.fObjectPanel.enableControls()
	    } else if (allJoints == true) {
		this.fJointPanel.enableControls()
		this.fObjectPanel.disableControls()
	    } else {
		this.fObjectPanel.disableControls()
		this.fJointPanel.disableControls()		
	    }	
	}
    }
}

export default TmarginatePropertiesPanel
