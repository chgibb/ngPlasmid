import * as fs from "fs";

const looksSame = require("looks-same");

import {loadFromHTMLAndWriteArtifacts} from "./loadFromHTMLAndWriteArtifacts";
import {plasmidToBuffer} from "./plasmidToBuffer";
import {Plasmid} from "../../../lib/directives";

let plasmid : Plasmid;

export function setupTest(file : string) : void
{
    if((<any>global).beforeAll)
    {
        beforeAll(async function(){
            let scope : any = undefined;
            if(fs.existsSync(`tests/canvas/res/${file}.json`))
            {
                scope = JSON.parse(fs.readFileSync(`tests/canvas/res/${file}.json`).toString());
            }
            plasmid = await loadFromHTMLAndWriteArtifacts(`${file}.html`,scope);
        });

        it(`should have rendered PNG and SVG from HTML`,async function(){
            expect(fs.existsSync(`${file}.html.svg`));
            expect(fs.existsSync(`${file}.html.png`));
        });

        it(`should have generated canvas commands from SVG`,async function(){
            expect(fs.existsSync(`${file}Cmds.js`));
        });

        it(`should be able to execute generated canvas commands`,async function(){
            expect(fs.existsSync(`${file}Cmds.js.png`));
        });

        it(`should render PNG direct from plasmid`,async function(){
            let buff = plasmidToBuffer(plasmid);
            expect(buff).toBeDefined();
            fs.writeFileSync(`${file}Ex.html.png`,buff);
        });

        it(`PNG from plasmid and rasterized SVG should appear the same`,async function(){
            expect(await new Promise<boolean>((resolve,reject) => {
                looksSame(`${file}Ex.html.png`,`${file}.html.png`,{tolerance:5},function(error : string,equal : boolean){
                    if(error)
                        return reject(error);
                    resolve(equal);
                });
            }).catch((err) => {
                console.error(err);
            })).toBe(true);
        });
    }
    else
    {
        (async function(){
            let scope : any = undefined;
            if(fs.existsSync(`tests/canvas/res/${file}.json`))
            {
                scope = JSON.parse(fs.readFileSync(`tests/canvas/res/${file}.json`).toString());
            }
            plasmid = await loadFromHTMLAndWriteArtifacts(`${file}.html`,scope);

            let buff = plasmidToBuffer(plasmid);
            fs.writeFileSync(`${file}Ex.html.png`,buff);
        })().catch((err) => {
            console.error(err);
        });
    }
}