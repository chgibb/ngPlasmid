import * as fs from "fs";

let args = process.argv.slice(2);

import * as html from "./../lib/html";
import * as directives from "./../lib//directives";
import {plasmidToPB} from "./../lib/directiveToPB";
import * as pbDirectives from "./../lib/pb/node";
import {enableMemoization} from "./../lib/services";

if(args[args.length-1] == "memoize")
        enableMemoization();

let plasmid = new directives.Plasmid();
if(args[1] && args[1] != "memoize")
    plasmid.$scope = JSON.parse(fs.readFileSync(args[1]).toString());

let buffer = fs.readFileSync(args[0]);
plasmid.fromNode<any>(
    pbDirectives.Node.decode(buffer)
);
console.log(plasmid.renderStart() + plasmid.renderEnd());