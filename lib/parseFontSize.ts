/**
 * Parses the value of font-size:valuepx out of the CSS string style.
 * font-size must be specified in px and not %
 * 
 * @export
 * @param {string} style 
 * @returns {number} 
 */
export function parseFontSize(style : string) : number
{
    //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L973
    let str = "";
    let res = 0;
    let gettingValue = false;
    for(let i = 0; i != style.length; ++i)
    {
        //trying to parse out "font-size:"
        if(!gettingValue)
        {
            if(style[i] == ":")
            {
                if(str == "font-size")
                {
                    gettingValue = true;
                    str = "";
                    continue;
                }
            }
            if(style[i] != " ")
            {
                str += style[i];
                continue;
            }
        }
        //getting actual font-size value. Stop after reaching p
        if(gettingValue)
        {
            if(style[i] != " " && style[i] != "p")
            {
                str += style[i];
                continue;
            }
            if(style[i] == "p")
            {
                return parseInt(str);
            }

        }
    }

    return res;
}