import {PlasmidTrack} from "./../directives";
import {parseStyle} from "./../parseStyle";
import {drawSVGarcOnCanvas} from "./utils";

export function plasmidTrackToCanvas(track : PlasmidTrack,ctx : CanvasRenderingContext2D) : void
{
    let style = parseStyle(track.trackstyle);    
    if(style && style["fill"])
        ctx.fillStyle = style["fill"];

    let d = track.getSVGPath()!.split(" ");

    /*ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.beginPath();
    ctx.moveTo(parseInt(d[1]),parseInt(d[2]));

    drawSVGarcOnCanvas(
        ctx,
        parseInt(d[0]),
        parseInt(d[1]),
        parseFloat(d[4]),
        parseFloat(d[5]),
        parseFloat(d[6]),
        parseFloat(d[7]),
        parseFloat(d[8]),
        parseFloat(d[9]),
        parseFloat(d[10])
    );

    ctx.fill("evenodd");
    ctx.stroke();
    ctx.restore();*/
let $ = ctx;
   // $.save();
$.strokeStyle = "rgba(0,0,0,0)";
//$.lineCap = "butt";
//$.lineJoin = "miter";
//$.miterLimit = 4;
//$.font = "   10px sans-serif";
//$.translate(0,0);
//$.save();
$.fillStyle = "#ccc";
$.font = "   10px sans-serif";
$.beginPath();
//$.moveTo(187.479056,67.500002);
ctx.moveTo(parseFloat(d[1]),parseFloat(d[2]));
//$.translate(187.49999999996874,187.5);
ctx.translate(parseFloat(d[1]),parseFloat(d[1]));
$.rotate(0);
$.scale(1,1);
$.arc(0,0,120,-1.5709708597198357,-1.570796326794939,<any>1);
$.scale(1,1);
$.rotate(0);
$.translate(-187.49999999996874,-187.5);
$.moveTo(187.478183,62.500002);
$.translate(187.49999999994367,187.5);
$.rotate(0);
$.scale(1,1);
$.arc(0,0,125,-1.5709708597196457,-1.570796326794749,<any>1);
$.scale(1,1);
$.rotate(0);
$.translate(-187.49999999994367,-187.5);
$.fill("evenodd");
$.stroke();
$.restore();
$.restore();
}