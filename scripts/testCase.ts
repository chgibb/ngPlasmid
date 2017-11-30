import * as cp from "child_process";
import * as fs from "fs";

import {TestSummary,TestStatus} from "./testSummary";

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

export function getFileSize(filePath : string) : number
{
    return fs.readFileSync(filePath).toString().length;
}

export interface TestCaseInit
{
    htmlFile : string;
    jsonFile : string | undefined;
    name : string;
    type : "directive" | "example" | "interpolation" | "stress";
}

export function cleanRawProfiles() : void
{
    cp.execSync("rm *.log");
}

export class TestCase
{
    public type : "directive" | "example" | "interpolation" | "stress"
    public htmlFile : string;
    public jsonFile : string | undefined;
    public name : string;
    public inputSize : number;

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

    public exPBToSVGCompileTime : number;
    public exPBToSVGOptimisationTime : number;
    public exPBToSVGResultSize : number;
    public exPBToSVGOptimisedResultSize : number;
    public exPBToSVGResultPath : string;
    public exPBToSVGResultOptimisedPath : string;

    public summary : TestSummary;

    public constructor(init : TestCaseInit)
    {
        this.htmlFile = init.htmlFile;
        this.jsonFile = init.jsonFile;
        this.name = init.name;
        this.type = init.type;
        this.inputSize = getFileSize("tests/"+this.htmlFile);

        this.summary = new TestSummary(this.name,this.inputSize);

        this.referenceResultPath = this.makeReferenceResultPath(this.htmlFile);
        this.referenceResultOptimisedPath = this.makeReferenceResultOptimisedPath(this.htmlFile);

        this.exHTMLToSVGResultPath = this.makeExHTMLToSVGResultPath(this.htmlFile);
        this.exHTMLToSVGResultOptimisedPath = this.makeExHTMLToSVGResultOptimisedPath(this.htmlFile);

        this.exHTMLTOPBResultPath = this.makeEXHTMLToPBResultPath(this.htmlFile);

        this.exPBToSVGResultPath = this.makeExPBToSVGResultPath(this.htmlFile);
        this.exPBToSVGResultOptimisedPath = this.makeExPBToSVGResultOptimisedPath(this.htmlFile);
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

    public makeExPBToSVGResultPath(file : string) : string
    {
        return `${file}Ex.pb.svg`;
    }

    public makeExPBToSVGResultOptimisedPath(file : string) : string
    {
        return `${file}ExO.pb.svg`;
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

    public runExPBToSVGCompiler()
    {
        let timer : Timer = new Timer();

        let res : Buffer 
        
        if(!this.jsonFile)
            res = cp.execSync(`node PBToSVGCompiler/index ${this.exHTMLTOPBResultPath}`);
        else 
            res = cp.execSync(`node PBToSVGCompiler/index ${this.exHTMLTOPBResultPath} tests/${this.jsonFile}`);

        fs.writeFileSync(this.exPBToSVGResultPath,res.toString());

        this.exPBToSVGCompileTime = timer.stop();
    }

    public getProfilingInformationForExPBToSVGCompiler()
    {
        if(!this.jsonFile)
            cp.execSync(`node --prof PBToSVGCompiler/index ${this.exHTMLTOPBResultPath}`);
        else 
            cp.execSync(`node --prof PBToSVGCompiler/index ${this.exHTMLTOPBResultPath} tests/${this.jsonFile}`);
        
        return cp.execSync(`node --prof-process *.log`).toString();
    }

    public getExPBTOSVGREsultSize()
    {
        this.exPBToSVGResultSize = getFileSize(this.exPBToSVGResultPath);   
    }

    public getExPBToSVGResultOptimisedSize()
    {
        this.exPBToSVGOptimisedResultSize = getFileSize(this.exPBToSVGResultOptimisedPath);
    }

    public optimiseExPBToSVGCompilerResult()
    {
        let timer : Timer = new Timer();

        let res = cp.execSync(`./node_modules/.bin/svgo -i ${this.exPBToSVGResultPath} -o ${this.exPBToSVGResultOptimisedPath} --multipass --enable=sortAttrs --pretty --indent=4`);

        this.exPBToSVGOptimisationTime = timer.stop();
    }
}

