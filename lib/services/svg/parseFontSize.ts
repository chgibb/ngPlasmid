import {parseStyle} from "../parseStyle";

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

    let styles = parseStyle(style);
    if(!styles)
        return 0;
    for(let i in styles)
    {
        if(i == "font-size")
        {
            return parseInt(styles[i]);
        }
    }
    return 0;

}
