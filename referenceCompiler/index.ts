import * as fs from "fs";

const ngcompile = require('@chgibb/ng-node-compile');

let args = process.argv.slice(2);

function compile() : void
{
    if(!ngcompile.prototype.envReady)
    {
        setTimeout(function(){
            compile();
        },100);
    }
    let ngEnvironment = new ngcompile([{name : "app", path : "@chgibb/angularplasmid"}]);
    let input = fs.readFileSync(args[0]).toString();
    console.log(
        ngEnvironment.$compile(input)()
    );
}
setTimeout(function(){
    compile();
},10);