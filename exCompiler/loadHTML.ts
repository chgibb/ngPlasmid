import * as fs from "fs";

const htmlparser = require("htmlparser2");

export interface Node
{
    type : string;
    name : string;
    attribs : Array<any>;
    children : Array<Node>;
    next : Node;
    prev : Node;
    parent : Node;
}

export function load(filePath : string) : Promise<Array<Node>>
{
    return new Promise<Array<Node>>((resolve,reject) => {

        const handler = new htmlparser.DomHandler(function(error : any,dom : any){
            if(error)
                reject(error);
            else
                resolve(dom);
        });
        const parser = new htmlparser.Parser(handler);
        parser.write(
            fs.readFileSync(filePath).toString()
        );
        parser.end();

    });
}