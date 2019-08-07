import {Plasmid} from "./../../../lib/plasmid";

const Canvas = require("canvas");


export function plasmidToBuffer(plasmid : Plasmid) : Buffer | undefined
{
    let res : Buffer | undefined = undefined;

    let canvas = Canvas.createCanvas(plasmid.dimensions.width,plasmid.dimensions.height);

    plasmid.toCanvas(<CanvasRenderingContext2D>canvas.getContext("2d"));

    res = canvas.toBuffer();

    return res;
}