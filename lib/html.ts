import * as fs from "fs";

export interface Node
{
    type : string;
    name : string;
    attribs : any;
    children : Array<Node>;
    next : Node;
    prev : Node;
    parent : Node;
}

export function loadFromString(htmlString : string) : Promise<Array<Node>>
{
    const htmlparser = require("htmlparser2");
    return new Promise<Array<Node>>((resolve,reject) => {

        const handler = new htmlparser.DomHandler(function(error : any,dom : any){
            if(error)
                reject(error);
            else
                resolve(dom);
        });
        const parser = new htmlparser.Parser(handler);
        parser.write(htmlString);
        parser.end();

    });
}