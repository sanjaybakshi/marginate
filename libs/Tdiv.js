
// This should be renamed ThtmlElement
//

class Tdiv
{
    constructor(divId)
    {
	this._div = document.getElementById(divId)

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
	this._div.style.display = "none"
    }

    show()
    {
	this._div.style.display = "inline-grid"
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

