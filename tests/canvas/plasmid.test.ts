/// <reference types="jest" />

import * as fs from "fs";

const Canvas = require("canvas");
const svg2img = require("svg2img");

import {loadFromHTMLAndWriteArtifacts} from "./util/loadFromHTMLAndWriteArtifacts";

let refCanvas;
let compCanvas;

it(`should render buffer from HTML`,async function(){
    let plasmid = await loadFromHTMLAndWriteArtifacts("plasmid.html",undefined);

    expect(fs.existsSync("plasmid.html.svg"));
    expect(fs.existsSync("plasmid.html.png"));
});