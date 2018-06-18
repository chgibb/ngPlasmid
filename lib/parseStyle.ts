/**
 * Parses the given style attribute string into a JSON object of name:value pairs.
 * Adapted from answer given by Matt Ball https://stackoverflow.com/questions/5503610/convert-html-elements-style-attribute-to-json
 * 
 * @export
 * @param {string} styleAttrib 
 * @returns {({[k : string] : string} | undefined)} 
 */
export function parseStyle(styleAttrib : string) : {[k : string] : string} | undefined
{
    if(!styleAttrib)
        return undefined;

    let styles = styleAttrib.split(";");
    let i = styles.length;
    let res : {[k : string] : string} = {};

    while(i--)
    {
        let style = styles[i].split(":");
        if(!style[0] || !style[1])
            return undefined;
        let k = style[0].trim();
        let v = style[1].trim();
        if(k.length > 0 && v.length > 0)
        {
            res[k] = v;
        }
    }

    return res;
}