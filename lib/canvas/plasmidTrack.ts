import {PlasmidTrack} from "./../directives";
import {parseStyle} from "./../parseStyle";
import {drawSVGarcOnCanvas} from "./utils";

export function plasmidTrackToCanvas(track : PlasmidTrack,ctx : CanvasRenderingContext2D) : void
{
    track.interpolateAttributes();
    
    let style = parseStyle(track.trackstyle);    
    if(style && style["fill"])
        ctx.fillStyle = style["fill"];

    let d = track.getSVGPath()!.split(" ");

    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.beginPath();
    ctx.moveTo(parseFloat(d[1]),parseFloat(d[2]));

    drawSVGarcOnCanvas(
        ctx,
        parseFloat(d[1]),
        parseFloat(d[2]),
        parseFloat(d[4]),
        parseFloat(d[5]),
        parseFloat(d[6]),
        parseFloat(d[7]),
        parseFloat(d[8]),
        parseFloat(d[9]),
        parseFloat(d[10])
    );

    ctx.moveTo(parseFloat(d[12]),parseFloat(d[13]));

    drawSVGarcOnCanvas(
        ctx,
        parseFloat(d[12]),
        parseFloat(d[13]),
        parseFloat(d[15]),
        parseFloat(d[16]),
        parseFloat(d[17]),
        parseFloat(d[18]),
        parseFloat(d[19]),
        parseFloat(d[20]),
        parseFloat(d[21]),
    );

    ctx.fill("evenodd");
    ctx.stroke();

    ctx.restore();

    for(let i = 0; i != track.children.length; ++i)
    {
        track.children[i].toCanvas(ctx);
    }
}