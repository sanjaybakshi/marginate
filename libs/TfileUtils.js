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

    static readFileAsync(blob)
    {
	return new Promise((resolve, reject) => {
	    
	    let reader = new FileReader()

	    reader.onload = () => {
		resolve(reader.result);
	    };

	    reader.onerror = reject;


	    reader.readAsDataURL(blob);	
	})
    }

    static readImageAsync(file)
    {
	return new Promise((resolve, reject) => {

	    let image = new Image()
	    image.src = file

	    image.onload  = () => {
		resolve(image)
	    };
	    
	    image.onerror = () => reject
	})
    }    
}

export default TfileUtils

