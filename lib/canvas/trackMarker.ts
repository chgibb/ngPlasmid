import {TrackMarker} from "./../directives";
import {parseStyle} from "./../parseStyle";
import {drawSVGarcOnCanvas} from "./utils";

export function trackMarkerToCanvas(marker : TrackMarker,ctx : CanvasRenderingContext2D) : void
{
    marker.interpolateAttributes();
    
    let style = parseStyle(marker.markerstyle);    
    if(style && style["fill"])
        ctx.fillStyle = style["fill"];
    if(style && style["stroke"])
        ctx.strokeStyle = style["stroke"];
    
    let d = marker.getSVGPath()!.split(" ");

    //line
    if(d.length == 6)
    {
        //indexes; path compontents
        //0 1 2; M 123 123
        //3 4 5; L 123 123

        ctx.beginPath();
        ctx.lineWidth = 2;

        ctx.moveTo(parseFloat(d[1]),parseFloat(d[2]));
        ctx.lineTo(parseFloat(d[4]),parseFloat(d[5]));

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

        ctx.lineTo(parseFloat(d[12]),parseFloat(d[13]));
        ctx.lineTo(parseFloat(d[15]),parseFloat(d[16]));
        ctx.lineTo(parseFloat(d[18]),parseFloat(d[19]));
        ctx.lineTo(parseFloat(d[21]),parseFloat(d[22]));
        
        drawSVGarcOnCanvas(
            ctx,
            parseFloat(d[21]),
            parseFloat(d[22]),
            parseFloat(d[24]),
            parseFloat(d[25]),
            parseFloat(d[26]),
            parseFloat(d[27]),
            parseFloat(d[28]),
            parseFloat(d[29]),
            parseFloat(d[30])
        );

        ctx.lineTo(parseFloat(d[32]),parseFloat(d[33]));
        ctx.lineTo(parseFloat(d[35]),parseFloat(d[36]));
        ctx.lineTo(parseFloat(d[38]),parseFloat(d[39]));
        ctx.lineTo(parseFloat(d[41]),parseFloat(d[42]));

        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
}