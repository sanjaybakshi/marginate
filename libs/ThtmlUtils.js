import TfileUtils from "./TfileUtils.js"

class ThtmlUtils
{

    static async clipboard2image(e)
    {
	var img = null
	
	var items = (e.clipboardData || e.originalEvent.clipboardData).items;
	for (var index in items) {
	    var item = items[index];

	    
	    if (item.kind === 'file') {

		var blob = item.getAsFile();

		var f = await TfileUtils.readFileAsync(blob)
		var i = await TfileUtils.readImageAsync(f)
		img = i

	    }
	}

	return img
    }
}

export default ThtmlUtils

