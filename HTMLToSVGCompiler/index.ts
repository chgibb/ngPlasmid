require("./../lib/ngPlasmid");

import * as fs from "fs";

let args = process.argv.slice(2);

import * as html from "./../lib/html";
import { Plasmid } from "../lib/plasmid";

(async function(){
    let nodes = await html.loadFromString(fs.readFileSync(args[0]).toString());

    let plasmid = new Plasmid();

    if(args[1] && args[1] != "batched")
        plasmid.$scope = JSON.parse(fs.readFileSync(args[1]).toString());

    for(let i = 0; i != nodes.length; ++ i)
    {
        if(nodes[i].name == "plasmid")
        {
            plasmid.fromNode(nodes[i]);
            break;
        }
    }

    if(args[args.length-1] == "batched")
    {
        plasmid.changeRenderingStrategy("preCalculateBatch");
    }

    console.log(plasmid.renderStart() + plasmid.renderEnd());
})().catch((err) => {
    console.error(err);
});