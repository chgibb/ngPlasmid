import * as cp from "child_process";
import * as fs from "fs";

import {TestSummary,TestStatus} from "./testSummary";

import * as html from "./../lib/html";
import {Plasmid,AdaptiveRenderingUpdates} from "./../lib/directives";

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
    type : "directive" | "example" | "interpolation" | "stress" | "noref";
}

export function cleanRawProfiles() : void
{
    try
    {
        cp.execSync("rm *.log");
    }
    catch(err){}
}

export class TestCase
{
    public type : "directive" | "example" | "interpolation" | "stress" | "noref"
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

    public exBatchedHTMLToSVGCompileTime : number;
    public exBatchedHTMLToSVGOptimisationTime : number;
    public exBatchedHTMLToSVGResultSize : number;
    public exBatchedHTMLToSVGOptimisedResultSize : number;
    public exBatchedHTMLToSVGResultPath : string;
    public exBatchedHTMLToSVGResultOptimisedPath : string;

    public exHTMLtoPBCompileTime : number;
    public exHTMLToPBResultSize : number;
    public exHTMLTOPBResultPath : string;

    public exPBToSVGCompileTime : number;
    public exPBToSVGOptimisationTime : number;
    public exPBToSVGResultSize : number;
    public exPBToSVGOptimisedResultSize : number;
    public exPBToSVGResultPath : string;
    public exPBToSVGResultOptimisedPath : string;

    public exBatchedPBToSVGCompileTime : number;
    public exBatchedPBToSVGOptimisationTime : number;
    public exBatchedPBToSVGResultSize : number;
    public exBatchedPBToSVGOptimisedResultSize : number;
    public exBatchedPBToSVGResultPath : string;
    public exBatchedPBToSVGResultOptimisedPath : string;

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

        this.exBatchedHTMLToSVGResultPath = this.makeExBatchedHTMLToSVGResultPath(this.htmlFile);
        this.exBatchedHTMLToSVGResultOptimisedPath = this.makeExBatchedHTMLToSVGResultOptimisedPath(this.htmlFile);

        this.exHTMLTOPBResultPath = this.makeEXHTMLToPBResultPath(this.htmlFile);

        this.exPBToSVGResultPath = this.makeExPBToSVGResultPath(this.htmlFile);
        this.exPBToSVGResultOptimisedPath = this.makeExPBToSVGResultOptimisedPath(this.htmlFile);

        this.exBatchedPBToSVGResultPath = this.makeExBatchedPBToSVGResultPath(this.htmlFile);
        this.exBatchedPBToSVGResultOptimisedPath = this.makeExBatchedPBToSVGResultOptimisedPath(this.htmlFile);
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

    public makeExBatchedHTMLToSVGResultPath(file : string) : string
    {
        return `${file}ExBatched.svg`;
    }

    public makeExHTMLToSVGResultOptimisedPath(file : string) : string
    {
        return `${file}ExO.svg`;
    }

    public makeExBatchedHTMLToSVGResultOptimisedPath(file : string) : string
    {
        return `${file}ExBatchedO.svg`;
    }
    
    public makeEXHTMLToPBResultPath(file : string) : string
    {
        return `${file}.pb`;
    }

    public makeExPBToSVGResultPath(file : string) : string
    {
        return `${file}Ex.pb.svg`;
    }

    public makeExBatchedPBToSVGResultPath(file : string) : string
    {
        return `${file}ExBatched.pb.svg`;
    }

    public makeExPBToSVGResultOptimisedPath(file : string) : string
    {
        return `${file}ExO.pb.svg`;
    }

    public makeExBatchedPBToSVGResultOptimisedPath(file : string) : string
    {
        return `${file}ExBatchedO.pb.svg`;
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

        let res = cp.execSync(`node node_modules/svgo/bin/svgo -i ${this.referenceResultPath} -o ${this.referenceResultOptimisedPath} --multipass --enable=sortAttrs --enable=cleanupNumericValues --pretty --indent=4`);

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

    public runExBatchedHTMLToSVGCompiler()
    {
        let timer : Timer = new Timer();

        let res : Buffer 
        
        if(!this.jsonFile)
            res = cp.execSync(`node HTMLToSVGCompiler/index tests/${this.htmlFile} batched`);
        else 
            res = cp.execSync(`node HTMLToSVGCompiler/index tests/${this.htmlFile} tests/${this.jsonFile} batched`);

        fs.writeFileSync(this.exBatchedHTMLToSVGResultPath,res.toString());

        this.exBatchedHTMLToSVGCompileTime = timer.stop();
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

    public getExBatchedHTMLTOSVGREsultSize()
    {
        this.exBatchedHTMLToSVGResultSize = getFileSize(this.exBatchedHTMLToSVGResultPath);   
    }

    public getExHTMLToSVGResultOptimisedSize()
    {
        this.exHTMLToSVGOptimisedResultSize = getFileSize(this.exHTMLToSVGResultOptimisedPath);
    }

    public getExBatchedHTMLToSVGResultOptimisedSize()
    {
        this.exBatchedHTMLToSVGOptimisedResultSize = getFileSize(this.exBatchedHTMLToSVGResultOptimisedPath);
    }

    public optimiseExHTMLToSVGCompilerResult()
    {
        let timer : Timer = new Timer();

        let res = cp.execSync(`node node_modules/svgo/bin/svgo -i ${this.exHTMLToSVGResultPath} -o ${this.exHTMLToSVGResultOptimisedPath} --multipass --enable=sortAttrs --enable=cleanupNumericValues --pretty --indent=4`);

        this.exHTMLToSVGOptimisationTime = timer.stop();
    }

    public optimiseExBatchedHTMLToSVGCompilerResult()
    {
        let timer : Timer = new Timer();

        let res = cp.execSync(`node node_modules/svgo/bin/svgo -i ${this.exBatchedHTMLToSVGResultPath} -o ${this.exBatchedHTMLToSVGResultOptimisedPath} --multipass --enable=sortAttrs --enable=cleanupNumericValues --pretty --indent=4`);

        this.exBatchedHTMLToSVGOptimisationTime = timer.stop();
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

    public runExBatchedPBToSVGCompiler()
    {
        let timer : Timer = new Timer();

        let res : Buffer 
        
        if(!this.jsonFile)
            res = cp.execSync(`node PBToSVGCompiler/index ${this.exHTMLTOPBResultPath} batched`);
        else 
            res = cp.execSync(`node PBToSVGCompiler/index ${this.exHTMLTOPBResultPath} tests/${this.jsonFile} batched`);

        fs.writeFileSync(this.exPBToSVGResultPath,res.toString());

        this.exBatchedPBToSVGCompileTime = timer.stop();
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

    public getExBatchedPBTOSVGREsultSize()
    {
        this.exBatchedPBToSVGResultSize = getFileSize(this.exBatchedPBToSVGResultPath);   
    }

    public getExPBToSVGResultOptimisedSize()
    {
        this.exPBToSVGOptimisedResultSize = getFileSize(this.exPBToSVGResultOptimisedPath);
    }


    public getExBatchedPBToSVGResultOptimisedSize()
    {
        this.exBatchedPBToSVGOptimisedResultSize = getFileSize(this.exBatchedPBToSVGResultOptimisedPath);
    }
    public optimiseExPBToSVGCompilerResult()
    {
        let timer : Timer = new Timer();

        let res = cp.execSync(`node node_modules/svgo/bin/svgo -i ${this.exPBToSVGResultPath} -o ${this.exPBToSVGResultOptimisedPath} --multipass --enable=sortAttrs --enable=cleanupNumericValues --pretty --indent=4`);

        this.exPBToSVGOptimisationTime = timer.stop();
    }

    public optimiseExBatchedPBToSVGCompilerResult()
    {
        let timer : Timer = new Timer();

        let res = cp.execSync(`node node_modules/svgo/bin/svgo -i ${this.exBatchedPBToSVGResultPath} -o ${this.exBatchedPBToSVGResultOptimisedPath} --multipass --enable=sortAttrs --enable=cleanupNumericValues --pretty --indent=4`);

        this.exBatchedPBToSVGOptimisationTime = timer.stop();
    }

    public findBestStrategy() : Promise<void>
    {
        return new Promise<void>(async (resolve) => {
            let nodes = await html.loadFromString(`tests/${this.htmlFile}`);

            let plasmid = new Plasmid();

            if(this.jsonFile)
                plasmid.$scope = JSON.parse(fs.readFileSync(`tests/${this.jsonFile}`).toString());
            
            for(let i = 0; i != nodes.length; ++i)
            {
                if(nodes[i].name == "plasmid")
                {
                    plasmid.fromNode(nodes[i]);
                    break;
                }
            }

            plasmid.enableAdaptiveRendering();
            plasmid.adaptIterations = 10;

            plasmid.adaptiveRenderingUpdates.on("render",function(name : string,time : number){
                console.log(`Using ${name} took ${time}ms`);
            });

            plasmid.adaptiveRenderingUpdates.on("selectedStrategy",function(name :string){
                console.log(`Selected strategy ${name}`);
                resolve();
            });

            for(let i = 0; i != plasmid.adaptIterations*2+1; ++i)
            {
                plasmid.renderStart();
                plasmid.renderEnd();
            }
        });
    }
}

