import * as fs from "fs";

const svg2img = require("svg2img");

import {Plasmid} from "./../../../lib/directives";
import * as html from "./../../../lib/html";

export function loadFromHTMLAndWriteArtifacts(file : string,scope : any) : Promise<Plasmid>
{
    return new Promise<Plasmid>(async (resolve) => {
        let res = new Plasmid();

        let nodes = await html.loadFromString(fs.readFileSync(`tests/canvas/res/${file}`).toString());

        for(let i = 0; i != nodes.length; ++ i)
        {
            if(nodes[i].name == "plasmid")
            {
                res.fromNode(nodes[i]);
                break;
            }
        }

        if(scope)
            res.$scope = scope;

        fs.writeFileSync(`${file}.svg`,res.renderStart()+res.renderEnd());

        await new Promise<void>((innerResolve) => {
            svg2img(res.renderStart()+res.renderEnd(),function(err : any,buff : Buffer){
                if(err)
                    throw err;
                else
                {
                    fs.writeFileSync(`${file}.png`,buff);
                    return innerResolve();
                }
            });
        });

        return resolve(res);
    });

}