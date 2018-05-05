import {TrackMarker} from "./../directives";
import {parseStyle} from "./../parseStyle";
import {drawSVGarcOnCanvas} from "./utils";

export function trackMarkerToCanvas(marker : TrackMarker,ctx : CanvasRenderingContext2D) : void
{
    marker.interpolateAttributes();
    
    let style = parseStyle(marker.markerstyle);    
    if(style && style["fill"])
        ctx.fillStyle = style["fill"];
    
    let d = marker.getSVGPath()!.split(" ");

    //pathComplexArc
    if(d.length == 44)
    {
        
    }
}