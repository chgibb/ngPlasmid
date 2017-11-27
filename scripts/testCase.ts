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
    public exHTMLToSVGResultSize : number;
    public exHTMLToSVGOptimisedResultSize : number;
    public exHTMLToSVGResultPath : string;
    public exHTMLToSVGResultOptimisedPath : string;

    public exHTMLtoPBCompileTime : number;
    public exHTMLToPBResultSize : number;
    public exHTMLTOPBResultPath : string;

    public constructor(init : TestCaseInit)
    {
        this.htmlFile = init.htmlFile;
        this.jsonFile = init.jsonFile;
        this.name = init.name;

        this.referenceResultPath = this.makeReferenceResultPath(this.htmlFile);
        this.referenceResultOptimisedPath = this.makeReferenceResultOptimisedPath(this.htmlFile);

        this.exHTMLToSVGResultPath = this.makeExHTMLToSVGResultPath(this.htmlFile);
        this.exHTMLToSVGResultOptimisedPath = this.makeExHTMLToSVGResultOptimisedPath(this.htmlFile);

        this.exHTMLTOPBResultPath = this.makeEXHTMLToPBResultPath(this.htmlFile);
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
    
    public makeEXHTMLToPBResultPath(file : string) : string
    {
        return `${file}.pb`;
    }

    public runReferenceCompiler()
    {
        let timer : Timer = new Timer();

        let res : Buffer 
        
        if(!this.jsonFile)
            res = cp.execSync(`node referenceCompiler/index tests/${this.htmlFile}`);
        else 
        res = cp.execSync(`node referenceCompiler/index tests/${this.htmlFile} tests/${this.jsonFile}`);

        fs.writeFileSync(this.referenceResultPath,res.toString());

        this.referenceCompileTime = timer.stop();
    }

    public getReferenceResultSize()
    {
        this.referenceResultSize = getFileSize(this.referenceResultPath);
    }

    public getReferenceResultOptimisezSize()
    {
        this.referenceOptimisedResultSize = getFileSize(this.referenceResultOptimisedPath);
    }

    public optimiseReferenceCompilerResult()
    {
        let timer : Timer = new Timer();

        let res = cp.execSync(`./node_modules/.bin/svgo -i ${this.referenceResultPath} -o ${this.referenceResultOptimisedPath} --multipass --enable=sortAttrs --pretty --indent=4`);

        this.referenceOptimisationTime = timer.stop();
    }

    public runExHTMLToSVGCompiler()
    {
        let timer : Timer = new Timer();

        let res : Buffer 
        
        if(!this.jsonFile)
            res = cp.execSync(`node HTMLToSVGCompiler/index tests/${this.htmlFile}`);
        else 
            res = cp.execSync(`node HTMLToSVGCompiler/index tests/${this.htmlFile} tests/${this.jsonFile}`);

        fs.writeFileSync(this.exHTMLToSVGResultPath,res.toString());

        this.exHTMLToSVGCompileTime = timer.stop();
    }

    public getProfilingInformationForExHTMLToSVGCompiler()
    {
        if(!this.jsonFile)
            cp.execSync(`node --prof HTMLToSVGCompiler/index tests/${this.htmlFile}`);
        else 
            cp.execSync(`node --prof HTMLToSVGCompiler/index tests/${this.htmlFile} tests/${this.jsonFile}`);
        
        return cp.execSync(`node --prof-process *.log`).toString();
    }

    public getExHTMLTOSVGREsultSize()
    {
        this.exHTMLToSVGResultSize = getFileSize(this.exHTMLToSVGResultPath);   
    }

    public getExHTMLToSVGResultOptimisedSize()
    {
        this.exHTMLToSVGOptimisedResultSize = getFileSize(this.exHTMLToSVGResultOptimisedPath);
    }

    public optimiseExHTMLToSVGCompilerResult()
    {
        let timer : Timer = new Timer();

        let res = cp.execSync(`./node_modules/.bin/svgo -i ${this.exHTMLToSVGResultPath} -o ${this.exHTMLToSVGResultOptimisedPath} --multipass --enable=sortAttrs --pretty --indent=4`);

        this.exHTMLToSVGOptimisationTime = timer.stop();
    }

    public runExHTMLToPBCompiler()
    {
        let timer : Timer = new Timer();

        let res = cp.execSync(`node HTMLToPBCompiler/index tests/${this.htmlFile} ${this.exHTMLTOPBResultPath}`);

        this.exHTMLtoPBCompileTime = timer.stop();
    }

    public getExHTMLToPBResultSize()
    {
        this.exHTMLToPBResultSize = fs.readFileSync(this.exHTMLTOPBResultPath).length;
    }
}

