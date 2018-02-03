require("./../lib/ngPlasmid");

import * as fs from "fs";

let args = process.argv.slice(2);

import * as html from "./../lib/html";
import * as directives from "./../lib//directives";

(async function(){
    if(args[args.length-1] == "batched")
    {}
        
    let nodes = await html.loadFromString(fs.readFileSync(args[0]).toString());

    let plasmid = new directives.Plasmid();
    if(args[1] && args[1] != "native")
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
})();