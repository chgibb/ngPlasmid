import * as fs from "fs";

let args = process.argv.slice(2);

import * as html from "./req/html";
import * as directives from "./req/directives";

(async function(){

    let nodes = await html.load(args[0]);

    let plasmid = new directives.Plasmid();
    plasmid.fromNode(nodes[0]);
    console.log(plasmid);
})();