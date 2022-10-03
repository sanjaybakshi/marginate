class TimageUtils
{

    static makeImage(width, height)
    {
	let i = new Image(width,height)
	return i
    }

    static async canvas2img(canvas)
    {
	const img = await createImageBitmap(canvas, 0, 0, canvas.width, canvas.height,
					    {resizeQuality:"high"})
	return img
    }

    static canvas2base64Image(canvas)
    {
	/*
	  var dataURL = canvas.toDataURL("image/png");	
	  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	*/

	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	
    }
}

export default TimageUtils
