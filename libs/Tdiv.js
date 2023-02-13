
// This should be renamed ThtmlElement
//

class Tdiv
{
    _div          = null
    _displayStyle = null
    
    constructor(id)
    {
	this._div = document.getElementById(id)
	if (this._div != null) {
	    this._displayStyle = this._div.style.getPropertyValue('display')
	}
    }

    static constructFromElement(element)
    {
	let newDiv = new Tdiv("")
	newDiv._div = element
	newDiv._displayStyle = element.style.getPropertyValue('display')	
	return newDiv
    }
    
    toggleDisplay()
    {
	if (this.isVisible()) {
	    this.hide()
	} else {
	    this.show()
	}
    }

    toggleDisplayAt(pos)
    {
	if (this.isVisible()) {
	    this.hide()
	} else {
	    this.showAt(pos)
	}
    }

    isVisible()
    {
	if (this._div.offsetWidth >= 0 && this._div.offsetHeight >= 0 && this._div.getClientRects().length > 0) {
	    return true
	}

	return false

	/*
	if (this._div.style.display == "")
	    // This means it's the default (which is probably visible)
	    return true
	else if (this._div.style.display == "none") {
	    return false
	}
	return true;
	*/
    }

    hide()
    {
	// Cache the display style.
	//
	this._displayStyle = this._div.style.getPropertyValue('display')
	this._div.style.display = "none"
    }

    show()
    {
	//this._div.style.display = "inline-grid"
	//this._div.style.display = this._displayStyle
	this._div.style.display = "block"
    }

    showAt(pos)
    {
	this._div.style.left = (pos.x + 'px')
	this._div.style.top  = (pos.y + 'px')

	this.show()
    }

    getPosition()
    {
	let r = this._div.getBoundingClientRect()
	return ({x:r.left, y:r.top})
    }

    getWidthHeight()
    {
	let r = this._div.getBoundingClientRect()
	return ({width:r.width, height:r.height})
    }

    getBorderSize()
    {
	let r = this._div.style.border
	return r
    }
    
    setWidthHeight(wh)
    {
	this._div.style.width  = wh.width  + "px"
	this._div.style.height = wh.height + "px"
    }
/*
    getCenter()
    {
	let wh = this.getWidthHeight();

	return ({x:wh.width/2
    }
*/

    enable()
    {
	this._div.disabled = false
    }

    disable()
    {
	this._div.disabled = true
    }
}

export default Tdiv

