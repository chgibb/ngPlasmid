import * as fs from "fs";

let args = process.argv.slice(2);

import * as html from "./html";
import * as tags from "./tags";
import * as directives from "./directives";

(async function(){

    let nodes = await html.load(args[0]);

    let res = directives.plasmidStart(tags.toPlasmid(nodes[0]));
    res += "\n";
    res += directives.plasmidEnd();

    console.log(res);

})();