import * as fs from "fs";

const PNG = require("pngjs").PNG;
const pixelMatch = require("pixelmatch");

import {loadFromHTMLAndWriteArtifacts} from "./loadFromHTMLAndWriteArtifacts";
import {plasmidToBuffer} from "./plasmidToBuffer";

import {Plasmid} from "../../../lib/plasmid";

let plasmid : Plasmid;

export function setupTest(file : string,diffPixels : number) : void
{
    if((<any>global).beforeAll)
    {
        beforeAll(async function()
        {
            let scope : any = undefined;
            if(fs.existsSync(`tests/canvas/res/${file}.json`))
            {
                scope = JSON.parse(fs.readFileSync(`tests/canvas/res/${file}.json`).toString());
            }
            plasmid = await loadFromHTMLAndWriteArtifacts(`${file}.html`,scope);
        });

        it("should have rendered PNG and SVG from HTML",async function()
        {
            expect(fs.existsSync(`${file}.html.svg`));
        });

        it("should have reference PNG",function()
        {
            expect(fs.existsSync(`tests/canvas/res/${file}.png`));
        });

        it("should render PNG direct from plasmid",async function()
        {
            let buff = plasmidToBuffer(plasmid);
            expect(buff).toBeDefined();
            fs.writeFileSync(`${file}Ex.html.png`,buff);
        });

        it("PNG from plasmid and rasterized SVG should appear the same",async function()
        {
            expect(await new Promise<number>(async (resolve) => 
            {
                let img1 = await new Promise<any>((resolve) => 
                {
                    let png = new PNG();
                    fs.createReadStream(`${file}Ex.html.png`).pipe(png).on("parsed",() => 
                    {
                        return resolve(png);
                    });
                });

                let img2 = await new Promise<any>((resolve) => 
                {
                    let png = new PNG();
                    fs.createReadStream(`tests/canvas/res/${file}.png`).pipe(png).on("parsed",() => 
                    {
                        return resolve(png);
                    });
                });

                let diff = new PNG({
                    width : img1.width,
                    height : img1.height
                });

                let numDiff : number = pixelMatch(img1.data,img2.data,diff.data,img1.width,img1.height,{threshold : 0.1});

                await new Promise<void>((resolve) => 
                {
                    diff.pack().pipe(fs.createWriteStream(`${file}.diff.png`));
                    return resolve();
                });

                return resolve(numDiff ? numDiff : 0);
            }).catch((err) => 
            {
                console.error(err);
            })).toBeLessThanOrEqual(diffPixels);
        });
    }
    else
    {
        (async function()
        {
            let scope : any = undefined;
            if(fs.existsSync(`tests/canvas/res/${file}.json`))
            {
                scope = JSON.parse(fs.readFileSync(`tests/canvas/res/${file}.json`).toString());
            }
            plasmid = await loadFromHTMLAndWriteArtifacts(`${file}.html`,scope);

            let buff = plasmidToBuffer(plasmid);
            fs.writeFileSync(`${file}Ex.html.png`,buff);
        })().catch((err) => 
        {
            console.error(err);
        });
    }
}