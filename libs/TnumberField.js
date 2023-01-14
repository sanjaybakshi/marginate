import Tdiv         from "./Tdiv.js"


class TnumberField extends Tdiv
{
    constructor(numberId, callOnChangeFn) {

	super(numberId)
	
	this._callOnNumberChangeFn = callOnChangeFn;
	
	this._div.addEventListener('change', (e) => {
	    this.numberChange(e)
	});

	this._div.addEventListener('keydown', (e) => {
	    e.stopPropagation()
	});
    }
    
    numberChange(e)
    {
	console.log("number change")
	e.stopPropagation()
	//this._div.value = e.target.value
	this._callOnNumberChangeFn(e.target.value)
    }
    
    setValue(v)
    {
	console.log(v)
	this._div.value = parseFloat(v).toFixed(0)
    }
    
    getValue()
    {
	return this._div.value
    }
    enable()
    {
	this._div.disabled = false
    }

    disable()
    {
	this._div.disabled = true
    }
    
}


export default TnumberField;
	
