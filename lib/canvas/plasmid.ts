import {Plasmid} from "../plasmid";

export function plasmidToCanvas(plasmid : Plasmid,ctx : CanvasRenderingContext2D) : void
{
    plasmid.interpolateAttributes();
    ctx.save();
    for(let i = 0; i != plasmid.tracks.length; ++i)
    {
        plasmid.tracks[i].toCanvas(ctx);
    }
    ctx.restore();
}
