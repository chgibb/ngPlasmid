import * as fs from "fs";
import * as cp from "child_process";

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
        cp.execSync(`./node_modules/.bin/canvgc ${file}.svg ${file}Cmds.js`);

        let rawCmds = fs.readFileSync(`${file}Cmds.js`);
        fs.writeFileSync(`${file}Cmds.js`,`
        let cmds = ${rawCmds}
        const Canvas = require("canvas");
        let canvas = new Canvas.createCanvas(cmds.w,cmds.h);
        let p = {
            stack : 0
        };
        cmds.d[0](canvas.getContext("2d"),p);
        const fs = require("fs");
        fs.writeFileSync("${file}Cmds.js.png",canvas.toBuffer());
        `);
        cp.execSync(`node ${file}Cmds.js`);

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