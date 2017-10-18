import * as fs from "fs";

let args = process.argv.slice(2);

let file1 = fs.readFileSync(args[0]).toString();
let file2 = fs.readFileSync(args[1]).toString();

if(file1 == file2)
{
    console.log(`${args[0]} and ${args[1]} have the same content`);
    process.exit(0);
}

else
{
    console.log(`${args[0]} and ${args[1]} differ`);
    process.exit(1);
}