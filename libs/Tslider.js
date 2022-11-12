class Tslider
{
    constructor(sliderId, sliderDataId, callOnChangeFn) {
	this._sliderCtrl     = document.getElementById(sliderId)
	this._sliderDataCtrl = document.getElementById(sliderDataId)
	
	this._callOnSliderChangeFn = callOnChangeFn;
	
	this._sliderCtrl.addEventListener('input', (e) => {
	    this.sliderChange(e)
	});
	
	this._sliderDataCtrl.addEventListener('input', (e) => {
	    this.numberChange(e)
	});
	
    }
    
    sliderChange(e)
    {
	this._sliderDataCtrl.value = e.target.value
	this._callOnSliderChangeFn(e.target.value)
    }
    numberChange(e)
    {
	this._sliderCtrl.value = e.target.value
	this._callOnSliderChangeFn(e.target.value)	
    }
    setValue(v)
    {
	this._sliderCtrl.value = v
	this._sliderDataCtrl.value = v
    }
    
    getValue()
    {
	return this._sliderCtrl.value
    }

    enable()
    {
	this._sliderCtrl.disabled = false
	this._sliderDataCtrl.disabled = false
    }

    disable()
    {
	this._sliderCtrl.disabled = true
	this._sliderDataCtrl.disabled = true
    }
}


export default Tslider;
	
