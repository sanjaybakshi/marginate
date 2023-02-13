import Tdiv from "./Tdiv.js"

class Tslider
{
    constructor(sliderParentId, sliderId, sliderDataId, callOnChangeFn)
    {

	this._sliderParentCtrl = new Tdiv(sliderParentId)

	this._sliderCtrl     = null
	this._sliderDataCtrl = null
	
	var elements = this._sliderParentCtrl._div.getElementsByTagName('*');
	for (const e of elements) {
	    if (e.type == "range") {
		this._sliderCtrl = Tdiv.constructFromElement(e)
	    }

	    if (e.type == "number") {
		this._sliderDataCtrl = Tdiv.constructFromElement(e)
	    }
	}

	//console.log(elements[2])
	//console.log(elements.length)

	//this._sliderCtrl     = new Tdiv(sliderId)
	//this._sliderDataCtrl = new Tdiv(sliderDataId)
	
	this._callOnSliderChangeFn = callOnChangeFn;
	
	this._sliderCtrl._div.addEventListener('input', (e) => {
	    this.sliderChange(e)
	});
	
	this._sliderDataCtrl._div.addEventListener('input', (e) => {
	    this.numberChange(e)
	});
	
    }
    
    sliderChange(e)
    {
	this._sliderDataCtrl._div.value = e.target.value
	this._callOnSliderChangeFn(e.target.value)
    }
    numberChange(e)
    {
	this._sliderCtrl._div.value = e.target.value
	this._callOnSliderChangeFn(e.target.value)	
    }
    setValue(v)
    {
	this._sliderCtrl._div.value = v
	this._sliderDataCtrl._div.value = v
    }
    
    getValue()
    {
	return this._sliderCtrl._div.value
    }

    enable()
    {
	this._sliderCtrl.enable()
	this._sliderDataCtrl.enable()
    }

    disable()
    {
	this._sliderCtrl.disable()
	this._sliderDataCtrl.disable()
    }

    hide()
    {
	this._sliderParentCtrl.hide()
	//this._sliderCtrl.hide()
	//this._sliderDataCtrl.hide()
    }

    show()
    {
	this._sliderParentCtrl.show()	
	//this._sliderCtrl.show()
	//this._sliderDataCtrl.show()
    }
}


export default Tslider;
	
