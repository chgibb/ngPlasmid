import * as fs from "fs";

const ngcompile = require("@chgibb/ng-node-compile");

let args = process.argv.slice(2);

function compile() : void
{
    if(!ngcompile.prototype.envReady)
    {
        setTimeout(function()
        {
            compile();
        },100);
    }
    let ngEnvironment = new ngcompile([{name : "app", path : "@chgibb/angularplasmid"}]);
    let input = fs.readFileSync(args[0]).toString();
    
    let output : string = ngEnvironment.$compile(input)(args[1] ? JSON.parse(fs.readFileSync(args[1]).toString()) : undefined);

    //emitting of <textPath> elements is broken for some reason
    output = output.replace(/<textpath /g,"<textPath ");
    output = output.replace(/<\/textpath>/g,"</textPath>");
    console.log(output);
}
setTimeout(function()
{
    compile();
},10);