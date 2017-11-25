import * as cp from "child_process";
import * as fs from "fs";

class Timer
{
    public startEpoch : number;
    public endEpoch : number;
    public constructor()
    {
        this.startEpoch = Date.now();
    }

    public stop() : number
    {
        this.endEpoch = Date.now();
        return Math.abs((<any>new Date(this.endEpoch)) - (<any>new Date(this.startEpoch)));
    }
}

function getFileSize(filePath : string) : number
{
    return fs.readFileSync(filePath).toString().length;
}

export interface TestCaseInit
{
    htmlFile : string;
    jsonFile : string | undefined;
    name : string;
}

export class TestCase
{
    public htmlFile : string;
    public jsonFile : string | undefined;
    public name : string;

    public referenceCompileTime : number;
    public referenceResultSize : number;
    public referenceOptimisationTime : number;
    public referenceOptimisedResultSize : number;

    public referenceResultPath : string;
    public referenceResultOptimisedPath : string;

    public exHTMLToSVGCompileTime : number;
    public exHTMLToSVGOptimisationTime : number;

    public exHTMLToSVGResultPath : string;
    public exHTMLToSVGResultOptimisedPath : string;

    public constructor(init : TestCaseInit)
    {
        this.htmlFile = init.htmlFile;
        this.jsonFile = init.jsonFile;
        this.name = init.name;

        this.referenceResultPath = this.makeReferenceResultPath(this.htmlFile);
        this.referenceResultOptimisedPath = this.makeReferenceResultOptimisedPath(this.htmlFile);

        this.exHTMLToSVGResultPath = this.makeExHTMLToSVGResultPath(this.htmlFile);
        this.exHTMLToSVGResultOptimisedPath = this.makeReferenceResultOptimisedPath(this.htmlFile);
    }

    public makeReferenceResultPath(file : string) : string
    {
        return `${file}Ref.svg`;
    }

    public makeReferenceResultOptimisedPath(file : string) : string
    {
        return `${file}RefO.svg`;
    }

    public makeExHTMLToSVGResultPath(file : string) : string
    {
        return `${file}Ex.svg`;
    }
    public makeExHTMLToSVGResultOptimisedPath(file : string) : string
    {
        return `${file}ExO.svg`;
    }

    public runReferenceCompiler()
    {
        let timer : Timer = new Timer();

        let res = cp.execSync(`node referenceCompiler/index tests/${this.htmlFile}`);

        fs.writeFileSync(this.referenceResultPath,res.toString());

        this.referenceCompileTime = timer.stop();
    }

    public getReferenceResultSize()
    {
        this.referenceResultSize = getFileSize(this.referenceResultPath);
    }

    public optimiseReferenceCompilerResult()
    {
        let timer : Timer = new Timer();

        let res = cp.execSync(`./node_modules/.bin/svgo -i ${this.referenceResultPath} -o ${this.referenceResultOptimisedPath} --multipass --pretty --indent=4`);

        this.referenceOptimisationTime = timer.stop();
    }
}

