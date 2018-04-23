const Canvas = require("canvas");

import {Plasmid} from "./../../../lib/directives";

export function plasmidToBuffer(plasmid : Plasmid) : Buffer | undefined
{
    let res : Buffer | undefined = undefined;

    let canvas = Canvas.createCanvas(plasmid.dimensions.width,plasmid.dimensions.height);

    res = canvas.toBuffer();

    return res;
}