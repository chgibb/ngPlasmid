import * as fs from "fs";

let args = process.argv.slice(2);

import * as html from "./../lib/html";
import * as directives from "./../lib//directives";
import {enableMemoization} from "./../lib/services";

(async function(){
    if(args[args.length-1] == "memoize")
        enableMemoization();

    let nodes = await html.loadFromString(fs.readFileSync(args[0]).toString());

    let plasmid = new directives.Plasmid();
    if(args[1] && args[1] != "memoize")
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