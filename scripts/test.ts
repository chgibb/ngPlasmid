const chalk = require("chalk");

import {TestCase,cleanRawProfiles,getFileSize} from "./testCase";
import {queueTests} from "./queueTests";
import {validateCompileTime} from "./validateCompileTime"
import {validateOutputSize} from "./validateOutputSize"
import {validateFileEquality} from "./validateFileEquality";

let testCases : Array<TestCase> = new Array<TestCase>();

(async function(){
    testCases = queueTests();

    for(let i = 0; i != testCases.length; ++i)
    {
        console.log(`${chalk.blue("Testing")} ${chalk.yellow(testCases[i].name)}`);
        console.log(`${chalk.blue("Size:")} ${chalk.yellow(testCases[i].inputSize)}`);

        if(testCases[i].type != "noref")
        {
            try
            {
                console.log(`   ${chalk.cyan(`Running reference compiler`)}`);    
                testCases[i].runReferenceCompiler();
                testCases[i].optimiseReferenceCompilerResult();
                testCases[i].getReferenceResultSize();
                testCases[i].getReferenceResultOptimisezSize();
                console.log(`   ${chalk.blue(`Compile time:`)} ${chalk.yellow(testCases[i].referenceCompileTime+"ms")}`);
                console.log(`   ${chalk.blue(`Output size:`)} ${chalk.yellow(testCases[i].referenceResultSize+"b")}`);
                console.log(`   ${chalk.blue(`Optimisation time:`)} ${chalk.yellow(testCases[i].referenceOptimisationTime+"ms")}`);
                console.log(`   ${chalk.blue(`Optimised Output size:`)} ${chalk.yellow(testCases[i].referenceOptimisedResultSize+"b")}`);
            }
            catch(err)
            {
                console.log(chalk.red("Reference compiler chrashed"));
                console.log(chalk.red(err));
            }
        


            console.log(`   ${chalk.cyan(`Running HTML to SVG compiler`)}`);    
            testCases[i].runExHTMLToSVGCompiler();
            testCases[i].optimiseExHTMLToSVGCompilerResult();
            testCases[i].getExHTMLTOSVGREsultSize();
            testCases[i].getExHTMLToSVGResultOptimisedSize();
            console.log(`   ${chalk.blue(`Compile time:`)} ${chalk.yellow(testCases[i].exHTMLToSVGCompileTime+"ms")}`);
            console.log(`   ${chalk.blue(`Output size:`)} ${chalk.yellow(testCases[i].exHTMLToSVGResultSize+"b")}`);
            console.log(`   ${chalk.blue(`Optimisation time:`)} ${chalk.yellow(testCases[i].exHTMLToSVGOptimisationTime+"ms")}`);
            console.log(`   ${chalk.blue(`Optimised Output size:`)} ${chalk.yellow(testCases[i].exHTMLToSVGOptimisedResultSize+"b")}`);

            console.log(`   ${chalk.cyan(`Validating`)}`);
        
            let compileTimeFactor = 5;
            if(testCases[i].htmlFile == "HPV165CovTracks.html")
                compileTimeFactor = 35;
            if(testCases[i].htmlFile == "HPV1615CovTracks.html")
                compileTimeFactor = 85;
            console.log(`       ${chalk.yellow(`Compile time was ${(testCases[i].referenceCompileTime/testCases[i].exHTMLToSVGCompileTime).toFixed(2)}x faster than the reference`)}`);
            let outString = `HTML to SVG Compile Time At Least ${compileTimeFactor}x Faster Than Reference`;

        
            if(testCases[i].exHTMLToSVGCompileTime*compileTimeFactor < testCases[i].referenceCompileTime)
            {
                console.log(`       ${chalk.green(outString)}`);
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : true
                });
            }
            else
            {
                console.log(`       ${chalk.red(outString)}`);
                //console.log(`       ${chalk.red(`Re-running and collecting profiling information`)}`);
                //console.log(`${chalk.yellow(testCases[i].getProfilingInformationForExHTMLToSVGCompiler())}`);
                //cleanRawProfiles();
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : false
                });
            }
        
            outString = `HTML to SVG Compiler Output Size Less Than Reference's Output Size`;
            if(testCases[i].exHTMLToSVGResultSize < testCases[i].referenceResultSize)
            {
                console.log(`       ${chalk.green(outString)}`);
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : true
                });
            }
            else
            {
                console.log(`       ${chalk.red(outString)}`);
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : false
                });
                process.exit(1);
            }

            outString = `HTML to SVG Compiler Output Can Be Reduced to the Same as the Reference`;
            let res = validateFileEquality(testCases[i].referenceResultOptimisedPath,testCases[i].exHTMLToSVGResultOptimisedPath);
            if(res)
            {
                console.log(`       ${chalk.green(outString)}`);
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : true
                });
            }
            else
            {
                console.log(`       ${chalk.red(outString)}`);
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : false
                });
                //if test is not HPV1630CovTracks.html, consider this a failure
                //output SVG from this test is massive and causes non-determinism in SVGO
                if(testCases[i].htmlFile != "HPV1630CovTracks.html" && testCases[i].htmlFile != "saccharomycesSim.html")
                    process.exit(1);
            }

            console.log(`   ${chalk.cyan(`Running HTML to Protocol Buffer compiler`)}`);  
            testCases[i].runExHTMLToPBCompiler();
            testCases[i].getExHTMLToPBResultSize();
            console.log(`   ${chalk.blue(`Compile time:`)} ${chalk.yellow(testCases[i].exHTMLtoPBCompileTime+"ms")}`);
            console.log(`   ${chalk.blue(`Output size:`)} ${chalk.yellow(testCases[i].exHTMLToPBResultSize+"b")}`);
            console.log(`   ${chalk.cyan(`Validating`)}`);
            console.log(`       ${chalk.yellow(`Compile time was ${(testCases[i].referenceCompileTime/testCases[i].exHTMLtoPBCompileTime).toFixed(2)}x faster than the reference`)}`);
            compileTimeFactor = 4;
            outString = `HTML to Protocol Buffer Compile Time At Least ${compileTimeFactor}x Faster Than Reference`;
            if(testCases[i].exHTMLtoPBCompileTime*compileTimeFactor < testCases[i].referenceCompileTime)
            {
                console.log(`       ${chalk.green(outString)}`);
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : true
                });
            }
            else
            {
                console.log(`       ${chalk.red(outString)}`);
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : false
                });
                //process.exit(1);
            }

            console.log(`   ${chalk.cyan(`Running Protocol Buffer to SVG compiler`)}`);
            testCases[i].runExPBToSVGCompiler();
            testCases[i].optimiseExPBToSVGCompilerResult();
            testCases[i].getExPBTOSVGREsultSize();
            testCases[i].getExPBToSVGResultOptimisedSize();
            console.log(`   ${chalk.blue(`Compile time:`)} ${chalk.yellow(testCases[i].exPBToSVGCompileTime+"ms")}`);
            console.log(`   ${chalk.blue(`Output size:`)} ${chalk.yellow(testCases[i].exPBToSVGResultSize+"b")}`);
            console.log(`   ${chalk.blue(`Optimisation time:`)} ${chalk.yellow(testCases[i].exPBToSVGOptimisationTime+"ms")}`);
            console.log(`   ${chalk.blue(`Optimised Output size:`)} ${chalk.yellow(testCases[i].exPBToSVGOptimisedResultSize+"b")}`);

            console.log(`   ${chalk.cyan(`Validating`)}`);
        
            compileTimeFactor = 5;
            if(testCases[i].htmlFile == "HPV165CovTracks.html")
                compileTimeFactor = 35;
            if(testCases[i].htmlFile == "HPV1615CovTracks.html")
                compileTimeFactor = 85;
            console.log(`       ${chalk.yellow(`Compile time was ${(testCases[i].referenceCompileTime/testCases[i].exPBToSVGCompileTime).toFixed(2)}x faster than the reference`)}`);
            outString = `Protocol Buffer to SVG Compile Time Faster Than HTML to SVG Compiler`;

        
            if(testCases[i].exPBToSVGCompileTime < testCases[i].exHTMLToSVGCompileTime)
            {
                console.log(`       ${chalk.green(outString)}`);
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : true
                });
            }
            else
            {
                console.log(`       ${chalk.red(outString)}`);
                //console.log(`       ${chalk.red(`Re-running and collecting profiling information`)}`);
                //console.log(`${chalk.yellow(testCases[i].getProfilingInformationForExPBToSVGCompiler())}`);
                //cleanRawProfiles();
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : false
                });
            }

            outString = `PB to SVG Compiler Output Size Less Than Reference's Output Size`;
            if(testCases[i].exPBToSVGResultSize < testCases[i].referenceResultSize)
            {
                console.log(`       ${chalk.green(outString)}`);
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : true
                });
            }
            else
            {
                console.log(`       ${chalk.red(outString)}`);
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : false
                });
                process.exit(1);
            }

            outString = `PB to SVG Compiler Output Can Be Reduced to the Same as the Reference`;
            res = validateFileEquality(testCases[i].referenceResultOptimisedPath,testCases[i].exPBToSVGResultOptimisedPath);
            if(res)
            {
                console.log(`       ${chalk.green(outString)}`);
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : true
                });
            }
            else
            {
                console.log(`       ${chalk.red(outString)}`);
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : false
                });
                //if test is not HPV1630CovTracks.html, consider this a failure
                //output SVG from this test is massive and causes non-determinism in SVGO
                if(testCases[i].htmlFile != "HPV1630CovTracks.html")
                    process.exit(1);
            }

            console.log(``);
            console.log(``);
        }
        else if(testCases[i].type == "noref")
        {
            console.log(`   ${chalk.cyan(`Running HTML to SVG compiler`)}`);  
            testCases[i].runExHTMLToSVGCompiler();
            testCases[i].getExHTMLTOSVGREsultSize();
            console.log(`   ${chalk.blue(`Compile time:`)} ${chalk.yellow(testCases[i].exHTMLToSVGCompileTime+"ms")}`);
            console.log(`   ${chalk.blue(`Output size:`)} ${chalk.yellow(testCases[i].exHTMLToSVGResultSize+"b")}`);
            console.log(`   ${chalk.cyan(`Validating`)}`);
            let outString = `HTML to SVG Compile Time Less Than 15 Seconds`;
            if(testCases[i].exHTMLToSVGCompileTime < 15000)
            {
                console.log(`       ${chalk.green(outString)}`);
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : true
                });
            }
            else
            {
                console.log(`       ${chalk.red(outString)}`);
                //console.log(`       ${chalk.red(`Re-running and collecting profiling information`)}`);
                //console.log(`${chalk.yellow(testCases[i].getProfilingInformationForExHTMLToSVGCompiler())}`);
                //cleanRawProfiles();
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : false
                });
            }
            outString = `HTML to SVG Compiler Didn't Crash`;
            console.log(`       ${chalk.green(outString)}`);
            testCases[i].summary.statuses.push({
                message : outString,
                status : true
            });

            console.log(`   ${chalk.cyan(`Running HTML to Protocol Buffer compiler`)}`);  
            testCases[i].runExHTMLToPBCompiler();
            testCases[i].getExHTMLToPBResultSize();
            console.log(`   ${chalk.blue(`Compile time:`)} ${chalk.yellow(testCases[i].exHTMLtoPBCompileTime+"ms")}`);
            console.log(`   ${chalk.blue(`Output size:`)} ${chalk.yellow(testCases[i].exHTMLToPBResultSize+"b")}`);

            console.log(`   ${chalk.cyan(`Running Protocol Buffer to SVG compiler`)}`);
            testCases[i].runExPBToSVGCompiler();
            testCases[i].getExPBTOSVGREsultSize();
            console.log(`   ${chalk.blue(`Compile time:`)} ${chalk.yellow(testCases[i].exPBToSVGCompileTime+"ms")}`);
            console.log(`   ${chalk.blue(`Output size:`)} ${chalk.yellow(testCases[i].exPBToSVGResultSize+"b")}`);

            outString = `Protocol Buffer to SVG Compile Time Faster Than HTML to SVG Compiler`;
            if(testCases[i].exPBToSVGCompileTime < testCases[i].exHTMLToSVGCompileTime)
            {
                console.log(`       ${chalk.green(outString)}`);
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : true
                });
            }
            else
            {
                console.log(`       ${chalk.red(outString)}`);
                //console.log(`       ${chalk.red(`Re-running and collecting profiling information`)}`);
                //console.log(`${chalk.yellow(testCases[i].getProfilingInformationForExPBToSVGCompiler())}`);
                //cleanRawProfiles();
                testCases[i].summary.statuses.push({
                    message : outString,
                    status : false
                });
            }
        }

        console.log(`   ${chalk.magentaBright(`Running HTML to SVG Compiler With Native Services`)}`);
        testCases[i].runExNativeHTMLToSVGCompiler();
        testCases[i].optimiseExNativeHTMLToSVGCompilerResult();
        testCases[i].getExNativeHTMLTOSVGREsultSize();
        testCases[i].getExNativeHTMLToSVGResultOptimisedSize();
        console.log(`   ${chalk.magenta(`Compile time:`)} ${chalk.yellow(testCases[i].exNativeHTMLToSVGCompileTime+"ms")}`);
        console.log(`   ${chalk.magenta(`Output size:`)} ${chalk.yellow(testCases[i].exNativeHTMLToSVGResultSize+"b")}`);
        console.log(`   ${chalk.magenta(`Optimisation time:`)} ${chalk.yellow(testCases[i].exNativeHTMLToSVGOptimisationTime+"ms")}`);
        console.log(`   ${chalk.magenta(`Optimised Output size:`)} ${chalk.yellow(testCases[i].exNativeHTMLToSVGOptimisedResultSize+"b")}`);
        let outString = `HTML to SVG Compiler With Native Services Compile Time Faster Than HTML to SVG Compiler`;
        if(testCases[i].exNativeHTMLToSVGCompileTime < testCases[i].exHTMLToSVGCompileTime)
        {
            console.log(`       ${chalk.green(outString)}`);
            testCases[i].summary.statuses.push({
                message : outString,
                status : true
            });
        }
        else
        {
            console.log(`       ${chalk.red(outString)}`);
            testCases[i].summary.statuses.push({
                message : outString,
                status : false
            });
            if(testCases[i].type == "stress")
            {
                process.exit(1);
            }
        }

        console.log(`-----------------------------------------------------------------------------------------------------`);

    }
    console.log(`Summaries:`);
    console.log(``)
    console.log(``);
    for(let i = 0; i != testCases.length; ++i)
    {
        console.log(`${chalk.yellow(testCases[i].name)} ${chalk.yellow(testCases[i].inputSize)}b`);
        for(let k = 0; k != testCases[i].summary.statuses.length; ++k)
        {
            if(testCases[i].summary.statuses[k].status)
                console.log(`   ${chalk.green(testCases[i].summary.statuses[k].message)}`);
            else
            console.log(`   ${chalk.red(testCases[i].summary.statuses[k].message)}`);
        }
        console.log(``);
        console.log(``);
    }

})().catch((err : any) => {
    console.error(err);
    process.exit(1);
});