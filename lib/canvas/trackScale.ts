/// <reference path="./../directives" />
/// <reference path="./../parseStyle" />

import {TrackScale} from "./../directives";
import {parseStyle} from "./../parseStyle";

export function trackScaleToCanvas(scale : TrackScale,ctx : CanvasRenderingContext2D) : void
{
    ctx.save();
    
    scale.interpolateAttributes();

    let style = parseStyle(scale.style);    

    if(style && style["stroke"])
        ctx.strokeStyle = style["stroke"];
    
    let d = scale.getSVGPath()!.split(" ");

    ctx.beginPath();
    ctx.lineWidth = 2;
    
    for(let i = 0; i != d.length; ++i)
    {
        if(!d[i])
            continue;
        
        let l = "";
        let r = "";
        let comma : number | undefined = undefined;
        for(let k = 1; k != d[i].length; ++k)
        {   
            if(d[i][k] == ",")
            {
                comma = k;
                break;
            }
            l += d[i][k];
        }
        
        if(!comma)
            throw new Error(`Failed to parse SVG path string for trackscale ${d}`);

        for(let k = comma + 1; k != d[i].length; ++k)
        {
            r += d[i][k];
        }

        if(d[i][0] == "M")
            ctx.moveTo(parseFloat(l),parseFloat(r));
        else if(d[i][0] == "L")
            ctx.lineTo(parseFloat(l),parseFloat(r));
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}