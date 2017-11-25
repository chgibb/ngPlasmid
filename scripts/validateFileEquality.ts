import * as fs from "fs";

export function validateFileEquality(file1Path : string,file2Path : string) : boolean
{
    let file1 = fs.readFileSync(file1Path).toString();
    let file2 = fs.readFileSync(file2Path).toString();

    if(file1 == file2)
        return true;
    else
        return false;
}