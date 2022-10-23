import TpopupWindow from "../libs/TpopupWindow.js"
import Tbutton      from "../libs/Tbutton.js"

import TimageUtils  from "../libs/TimageUtils.js"
import TfileUtils   from "../libs/TfileUtils.js"
import Tsprite      from "../libs/Tsprite.js"


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

	    


	    let base_image = new Image();
	    base_image.src = URL.createObjectURL(files[0])

	    base_image.onload = () => {
		//this._paintCanvas.setBackgroundImage(base_image)

		//var ratio = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.		
		//this._paintCanvas._paintImage = new Tsprite()
		//this._paintCanvas._paintImage.initBitmap(base_image, 1/ratio)

		//this._paintCanvas.setWidthHeight({width: 256, height: 256})


		//this._paintCanvas.resetUsingImage(base_image)
		window.dispatchEvent(new Event('resize'));

		
	    }
	}	
    }

    async save(e)
    {
	this.hide()

	//let base64Img = TimageUtils.canvas2base64Image(this._paintCanvas._div)
	//TfileUtils.saveBase64AsFile(base64Img,"img22.png")
	
    }
}



export default TmainMenuOptionsWnd


