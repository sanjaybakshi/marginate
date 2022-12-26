import Trect from "../libs/Trect.js";

class TimageUtils
{

    static makeImage(width, height)
    {
	let i = new Image(width*this.numPixels2device(),height*this.numPixels2device())
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

    static img2String(img) {
	// Create an empty canvas element
	var canvas = document.createElement("canvas");
	canvas.width  = img.width;
	canvas.height = img.height;
	
	// Copy the image contents to the canvas
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	
	// Get the data-URL formatted image
	// Firefox supports PNG and JPEG. You could check img.src to
	// guess the original format, but be aware the using "image/jpg"
	// will re-encode the image.
	var dataURL = canvas.toDataURL("image/png");
	
	return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    static string2Img(s) {
	let image = new Image();
	image.src = 'data:image/png;base64,' + s
	return image
    }
    
    static crop(img, cropRect)
    {
	let inMemoryCanvas = new OffscreenCanvas(cropRect.width(), cropRect.height())
	let inMemoryContext = inMemoryCanvas.getContext("2d");

	inMemoryContext.drawImage(img, cropRect._x1, cropRect._y1, cropRect.width(), cropRect.height(),
				  0, 0, cropRect.width(), cropRect.height())
	return(inMemoryCanvas.transferToImageBitmap())
    }

    static numPixels2device()
    //
    // Description:
    //		Number of image pixels that get mapped to 1 device pixel.
    //
    //		Will probably return 2. Which means 2 pixels in the image will map
    //		to 1 pixel on the device.
    //
    {
	return window.devicePixelRatio
    }
}

export default TimageUtils
