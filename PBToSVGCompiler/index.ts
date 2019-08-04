require("./../lib/ngPlasmid");

import * as fs from "fs";

let args = process.argv.slice(2);

import {Plasmid} from "../lib/plasmid";

import * as pbDirectives from "./../lib/pb/node";

let plasmid = new Plasmid();

if(args[1] && args[1] != "native")
    plasmid.$scope = JSON.parse(fs.readFileSync(args[1]).toString());

let buffer = fs.readFileSync(args[0]);

plasmid.fromNode<any>(
    pbDirectives.Node.decode(buffer)
);

if(args[args.length-1] == "batched")
{
    plasmid.changeRenderingStrategy("preCalculateBatch");
}

console.log(plasmid.renderStart() + plasmid.renderEnd());