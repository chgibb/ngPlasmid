/// <reference path="./../lib/pb/node.d.ts" />

import * as fs from "fs";

let args = process.argv.slice(2);

import * as html from "./../lib/html";
import * as ngDirectives from "./../lib//directives";
import {plasmidToPB} from "./../lib/directiveToPB";
import * as pbDirectives from "./../lib/pb/node";

(async function(){
    let nodes = await html.loadFromString(fs.readFileSync(args[0]).toString());
    
        let plasmid = new ngDirectives.Plasmid();

        for(let i = 0; i != nodes.length; ++ i)
        {
            if(nodes[i].name == "plasmid")
            {
                plasmid.fromNode(nodes[i]);
                break;
            }
        }
        let pb = pbDirectives.Node.create(plasmidToPB(plasmid));
        fs.writeFileSync(args[1],pbDirectives.Node.encode(pb).finish());
})();