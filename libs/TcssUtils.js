class TcssUtils
{

    static getCssVariableValue(cssVar)
    {
	var rootCtrl = document.querySelector(':root');
	const v = getComputedStyle(rootCtrl).getPropertyValue(cssVar);
	return v
    }

}

export default TcssUtils
