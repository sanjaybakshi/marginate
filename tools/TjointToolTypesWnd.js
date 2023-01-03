import TpopupWindow from "../libs/TpopupWindow.js"
import Tbutton      from "../libs/Tbutton.js"

import { fModel }   from '../TmarginateModel.js'


class TjointToolTypesWnd extends TpopupWindow
{
    constructor(windowId, marginateToolbar)
    {
	super(windowId)

	this._marginateToolbar = marginateToolbar
	
	this.gMotorId              = "motorJointId"
	this.gPrismaticId          = "prismaticJointId"
	this.gDistanceId           = "distanceJointId"
	this.gRevoluteId           = "revoluteJointId"	

	this._motorCtrl  = document.getElementById(this.gMotorId)
	this.respondToClick(this._motorCtrl)

	this._prismaticCtrl  = document.getElementById(this.gPrismaticId)
	this.respondToClick(this._prismaticCtrl)

	this._distanceCtrl  = document.getElementById(this.gDistanceId)
	this.respondToClick(this._distanceCtrl)

	this._revoluteCtrl  = document.getElementById(this.gRevoluteId)
	this.respondToClick(this._revoluteCtrl)
    }


    respondToClick(toolCtrl)
    {
	toolCtrl.addEventListener('pointerdown', (e) => {
	    //this.toolChange(e)


	    if (e.target.id == this.gMotorId) {
		console.log("motor")
		this._marginateToolbar._jointCtrl._div.src = "./icons/Link.png"
		this._marginateToolbar.fJointTool.setMotorMode()
	    } else if (e.target.id == this.gPrismaticId) {
		console.log("prismatic")
		this._marginateToolbar._jointCtrl._div.src = "./icons/A.png"
		this._marginateToolbar.fJointTool.setPrismaticMode()
	    } else if (e.target.id == this.gDistanceId) {
		console.log("distance")
		this._marginateToolbar._jointCtrl._div.src = "./icons/B.png"
		this._marginateToolbar.fJointTool.setDistanceMode()
	    } else if (e.target.id == this.gRevoluteId) {
		console.log("revolute")
		this._marginateToolbar._jointCtrl._div.src = "./icons/C.png"
		this._marginateToolbar.fJointTool.setRevoluteMode()		
	    }
	    
	    this._marginateToolbar.toolChange(this._marginateToolbar.fJointTool,
					      this._marginateToolbar._jointCtrl._div)
	    

	    this.hide()
	});
    }
    
}



export default TjointToolTypesWnd


