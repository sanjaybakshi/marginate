import TpopupWindow from "../libs/TpopupWindow.js"
import Tslider      from "../libs/Tslider.js"
import Tdiv         from "../libs/Tdiv.js"

import { fModel } from '../TmarginateModel.js'


class TstrokePropertiesWnd extends TpopupWindow
{
    constructor(windowId)
    {
	super(windowId)

	this.gStrokeColorId         = "paintColorId"

	this.gSliderStrokeSizeParentId    = "slider.parentStrokeSizeId"	
	this.gSliderStrokeSizeId    = "slider.strokeSizeId"
	this.gNumberStrokeSizeId    = "number.strokeSizeId"

	this.gSliderStrokeOpacityParentId    = "slider.parentStrokeOpacityId"		
	this.gSliderStrokeOpacityId = "slider.strokeOpacityId"
	this.gNumberStrokeOpacityId = "number.strokeOpacityId"
	

	this._strokeColorCtrl = new Tdiv(this.gStrokeColorId)
	this._strokeColorCtrl._div.addEventListener('change', (e) => {
	    this.strokeColorChanged(e)
	});
					       
	this._strokeSizeSlider = new Tslider(this.gSliderStrokeSizeParentId,
					     this.gSliderStrokeSizeId,
					     this.gNumberStrokeSizeId,
					     this.strokeSizeChanged)

	this._strokeOpacitySlider = new Tslider(this.gSliderStrokeOpacityParentId,
						this.gSliderStrokeOpacityId,
						this.gNumberStrokeOpacityId,
						this.strokeOpacityChanged)

	// Set the UI from the defaults.
	//
	this._strokeColorCtrl._div.value = fModel.fStrokeColor
	
	this._strokeSizeSlider.setValue(fModel.fStrokeSize)
	this._strokeOpacitySlider.setValue(fModel.fStrokeOpacity)
    }

    strokeColorChanged(e)
    {
	console.log("shit changed")
	console.log(e.target.value)
	fModel.fStrokeColor = e.target.value
    }
	
    strokeSizeChanged(v)
    {
	fModel.fStrokeSize = v
    }
    strokeOpacityChanged(v)
    {
	fModel.fStrokeOpacity = v
    }
}


export default TstrokePropertiesWnd


