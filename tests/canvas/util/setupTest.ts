import * as fs from "fs";

const svg2img = require("svg2img");

import {loadFromHTMLAndWriteArtifacts} from "./loadFromHTMLAndWriteArtifacts";
import {plasmidToBuffer} from "./plasmidToBuffer";
import {Plasmid} from "../../../lib/directives";

let plasmid : Plasmid;

export function setupTest(file : string) : void
{
    beforeAll(async function(){
        plasmid = await loadFromHTMLAndWriteArtifacts(`${file}.html`,undefined);
    });

    it(`should have rendered PNG and SVG from HTML`,async function(){
        expect(fs.existsSync(`${file}.html.svg`));
        expect(fs.existsSync(`${file}.html.png`));
    });

    it(`should have generated canvas commands from SVG`,async function(){
        expect(fs.existsSync(`${file}Cmds.js`));
    });

    it(`should render PNG direct from plasmid`,async function(){
        let buff = plasmidToBuffer(plasmid);
        expect(buff).toBeDefined();
        fs.writeFileSync(`${file}Ref.html.png`,buff);
    });

    it(`buffers should have the same content`,async function(){
        expect(fs.readFileSync(`${file}.html.png`)).toEqual(fs.readFileSync(`${file}Ref.html.png`));
    });
}