import * as fs from "fs";

let args = process.argv.slice(2);

import {Plasmid} from "../lib/plasmid";

import * as html from "./../lib/html";

(async function()
{
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

    console.log(plasmid.renderStart() + plasmid.renderEnd());
})().catch((err) => 
{
    console.error(err);
});