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

    static saveFile(content, fileName, contentType)
    //
    // Description:
    //	  saveFile(jsonData, 'json.txt', 'text/plain');
    //
    {
	var a = document.createElement("a");
	var file = new Blob([content], {type: contentType});
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
    }

    static saveBase64AsFile(base64, fileName)
    {
	var link = document.createElement("a");

	link.setAttribute('download', fileName)
	link.setAttribute('href', base64)
	link.click();
    }

    static readBlobAsync(blob)
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

    
    static readFileAsync(file)
    {
	return new Promise((resolve, reject) => {
	    
	    let reader = new FileReader()

	    reader.onload = () => {
		resolve(reader.result);
	    };

	    reader.onerror = reject;


	    //reader.readAsDataURL(blob);
	    reader.readAsText(file)
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

