import Tdiv         from "./Tdiv.js"


class TcheckBox extends Tdiv
{
    constructor(checkBoxId, callOnChangeFn) {

	super(checkBoxId)
	
	this._callOnCheckBoxChangeFn = callOnChangeFn;
	
	this._div.addEventListener('input', (e) => {
	    this.checkBoxChange(e)
	});
    }
    
    checkBoxChange(e)
    {
	//this._div.value = e.target.value
	this._callOnCheckBoxChangeFn(e.target.checked)
    }
    
    setValue(v)
    {
	this._div.checked = v
    }
    
    getValue()
    {
	return this._div.checked
    }
}


export default TcheckBox;
	
