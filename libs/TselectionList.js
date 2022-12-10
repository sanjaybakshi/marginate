import Tevent from "./Tevent.js"

class TselectionList
{
    constructor()
    {
	this._sList = []

	this.fSelectionChangeEvent = new Tevent()
	
    }

    clear()
    {
	this._sList = []

	this.fSelectionChangeEvent.trigger(this._sList)
    }

    replace(l)
    {
	this._sList = l

	this.fSelectionChangeEvent.trigger(this._sList)	
    }

    add(addList)
    {
	this.fSelectionChangeEvent.trigger(this._sList)	
    }

    remove(item)
    {
	this._sList = this._sList.filter(obj => obj != item);	
	this.fSelectionChangeEvent.trigger(this._sList)	
    }
}

export default TselectionList
