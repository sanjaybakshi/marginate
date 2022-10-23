class TfileUtils
{
    
    static filePicker()
    {
	return new Promise((resolve, reject) => {
	    
	    let input = document.createElement('input');
	    input.type = 'file';
	    
	    
	    function getFiles()
	    {
	    }
	    
	    input.onchange = () => resolve(input.files)
	    
	    input.click();
	})
    }

    static saveBase64AsFile(base64, fileName)
    {
	var link = document.createElement("a");

	link.setAttribute('download', fileName)
	link.setAttribute('href', base64)
	link.click();
    }
}

export default TfileUtils

