import TpopupWindow from "../libs/TpopupWindow.js"
import Tbutton      from "../libs/Tbutton.js"

import TimageUtils  from "../libs/TimageUtils.js"
import TfileUtils   from "../libs/TfileUtils.js"

import { fModel }   from '../TmarginateModel.js'


class TmainMenuOptionsWnd extends TpopupWindow
{
    constructor(windowId)
    {
	super(windowId)

	this.gLoadOptionId = "menuOptionLoadId"
	this.gSaveOptionId = "menuOptionSaveId"

	this._loadMenuButton = new Tbutton(this.gLoadOptionId,
					   this.load.bind(this))
	this._saveMenuButton = new Tbutton(this.gSaveOptionId,
					   this.save.bind(this))

    }



    

    async load(e)
    {
	this.hide()
	
	// Let the user pick the zip file.
	//
	let files = await TfileUtils.filePicker()

	if (files.length > 0) {
	   
	    let jsonFile = await TfileUtils.readFileAsync(files[0])

	    let modelDict = JSON.parse(jsonFile)

	    fModel.fPlanckWorld.reset()
	    fModel.dict2Model(modelDict)
	    
	    //console.log(worldInfo)

	    //let objDict = worldInfo.objs
	    //console.log(objDict)
	}	
    }

    async save(e)
    {
	this.hide()


	let modelDict = fModel.model2Dict()
	
	//let base64Img = TimageUtils.canvas2base64Image(this._paintCanvas._div)
	//TfileUtils.saveBase64AsFile(base64Img,"img22.png")

	let world_strings = JSON.stringify(modelDict, undefined, 2)
	console.log(world_strings)

	TfileUtils.saveFile(world_strings, "test.json", "text/plain")
    }
}



export default TmainMenuOptionsWnd


