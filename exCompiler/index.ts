import * as fs from "fs";

let args = process.argv.slice(2);

import * as html from "./loadHTML";

(async function(){

    let nodes = await html.load(args[0]);
    console.log(nodes[0].children);

})();