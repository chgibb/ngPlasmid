/// <reference path="./../directives" />
/// <reference path="./../parseStyle" />
/// <reference path="./utils.ts" />

import {PlasmidTrack} from "./../directives";
import {parseStyle} from "./../parseStyle";
import {drawSVGarcOnCanvas,splitRGBA} from "./utils";

export function plasmidTrackToCanvas(track : PlasmidTrack,ctx : CanvasRenderingContext2D) : void
{
    ctx.save();
    
    track.interpolateAttributes();
    
    let style = parseStyle(track.trackstyle);    
    if(style && style["fill"])
    {
        //rgb or rgba colour
        if(style["fill"][0] != "#")
        {
            let components = splitRGBA(style["fill"]);

            //set default alpha channel if it was not provided
            if(!components[3])
            {
                ctx.fillStyle = `rgba(${components[0]},${components[1]},${components[2]},0.0)`;
                ctx.strokeStyle =`rgba(${components[0]},${components[1]},${components[2]},0.0)`;
            }
            else
            {
                ctx.fillStyle = `rgba(${components[0]},${components[1]},${components[2]},${components[3]})`;
                ctx.strokeStyle = `rgba(${components[0]},${components[1]},${components[2]},${components[3]})`;
            }
        }
        //hex colour
        else
        {
            ctx.fillStyle = style["fill"];
            ctx.strokeStyle = ctx.fillStyle;
        }
    }

    let d = track.generateSVGPathNumeric();

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

    ctx.moveTo(d[12],d[13]);

    drawSVGarcOnCanvas(
        ctx,
        d[12],
        d[13],
        d[15],
        d[16],
        d[17],
        d[18],
        d[19],
        d[20],
        d[21]
    );

    ctx.fill("evenodd");
    ctx.stroke();

    ctx.restore();

    for(let i = 0; i != track.children.length; ++i)
    {
        track.children[i].toCanvas(ctx);
    }
}