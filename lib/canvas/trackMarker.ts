import {parseStyle} from "../services/parseStyle";

import {TrackMarker} from "./../trackMarker";
import {drawSVGarcOnCanvas,trimTrailingChars} from "./utils";

export function trackMarkerToCanvas(marker : TrackMarker,ctx : CanvasRenderingContext2D) : void
{
    ctx.save();

    marker.interpolateAttributes();
    
    ctx.strokeStyle = "rgba(0,0,0,0)";

    let style = parseStyle(marker.markerstyle);    
    if(style && style["fill"])
        ctx.fillStyle = style["fill"];
    if(style && style["stroke"])
        ctx.strokeStyle = style["stroke"];
    if(style && style["stroke-width"])
        ctx.lineWidth = parseInt(trimTrailingChars(style["stroke-width"],2));
    
    let d = marker.generateSVGPathNumeric();

    //line
    if(d.length == 6)
    {
        //indexes; path compontents
        //0 1 2; M 123 123
        //3 4 5; L 123 123

        ctx.beginPath();
        ctx.lineWidth = 2;

        ctx.moveTo(d[1],d[2]);
        ctx.lineTo(d[4],d[5]);

        ctx.fill();
        ctx.stroke();
    }

    if(d.length == 11)
    {
        console.log("other; todo");
    }

    //pathComplexArc
    if(d.length == 44)
    {
        //indexes; path compontents
        //0 1 2; M 123 123
        //3 4 5 6 7 8 9 10; A 123 123 0 0 0 123 123 
        //11 12 13; L 123 123
        //14 15 16; L 123 123
        //17 18 19; L 123 123
        //20 21 22; L 123 123
        //23 24 25 26 27 28 29 30; A 123 123 0 0 0 123 123
        //31 32 33; L 123 123
        //34 35 36; L 123 123
        //37 38 39; L 123 123
        //40 41 42; L 123 123
        //43; z

        ctx.beginPath();

        ctx.moveTo(d[1],d[2]);
        drawSVGarcOnCanvas(
            ctx,
            d[1],
            d[2],
            d[4],
            d[5],
            d[6],
            d[7],
            d[8],
            d[9],
            d[10]
        );

        ctx.lineTo(d[12],d[13]);
        ctx.lineTo(d[15],d[16]);
        ctx.lineTo(d[18],d[19]);
        ctx.lineTo(d[21],d[22]);
        
        drawSVGarcOnCanvas(
            ctx,
            d[21],
            d[22],
            d[24],
            d[25],
            d[26],
            d[27],
            d[28],
            d[29],
            d[30]
        );

        ctx.lineTo(d[32],d[33]);
        ctx.lineTo(d[35],d[36]);
        ctx.lineTo(d[38],d[39]);
        ctx.lineTo(d[41],d[42]);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
}