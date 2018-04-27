import {Plasmid} from "./../directives";

export function plasmidToCanvas(plasmid : Plasmid,ctx : CanvasRenderingContext2D) : void
{
    for(let i = 0; i != plasmid.tracks.length; ++i)
    {
        plasmid.tracks[i].toCanvas(ctx);
    }
}