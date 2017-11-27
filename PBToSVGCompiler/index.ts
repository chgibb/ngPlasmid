/// <reference path="./../lib/pb/node.d.ts" />

import * as fs from "fs";

let args = process.argv.slice(2);

import * as html from "./../lib/html";
import * as directives from "./../lib//directives";
import {plasmidToPB} from "./../lib/directiveToPB";
import * as pbDirectives from "./../lib/pb/node";

(async function(){
    let plasmid = new directives.Plasmid();
    if(args[1])
        plasmid.$scope = JSON.parse(fs.readFileSync(args[1]).toString());

    let buffer = fs.readFileSync(args[0]);
    plasmid.fromNode<any>(
        pbDirectives.Node.decode(buffer)
    );    
})();