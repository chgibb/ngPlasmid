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
        });

        it(`should have reference PNG`,function(){
            expect(fs.existsSync(`tests/canvas/res/${file}.png`));
        });

        it(`should render PNG direct from plasmid`,async function(){
            let buff = plasmidToBuffer(plasmid);
            expect(buff).toBeDefined();
            fs.writeFileSync(`${file}Ex.html.png`,buff);
        });

        it(`PNG from plasmid and rasterized SVG should appear the same`,async function(){
            expect(await new Promise<boolean>(async (resolve,reject) => {
                looksSame(`${file}Ex.html.png`,`tests/canvas/res/${file}.png`,{tolerance:35},async function(error : string,equal : boolean){
                    if(error)
                        return reject(error);
                    if(!equal)
                    {
                        await new Promise<void>((resolve,reject) => {
                            looksSame.createDiff({
                                reference: `tests/canvas/res/${file}.png`,
                                current: `${file}Ex.html.png`,
                                diff: `${file}.diff.png`,
                                highlightColor: '#ff00ff', 
                                strict: false,
                                tolerance: 35
                            },function(error : string){
                                if(error)
                                    return reject(error);
                                return resolve();
                            });
                        });
                    }
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