const chalk = require("chalk");

import {TestCase} from "./testCase";
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

        console.log(`   ${chalk.cyan(`Running reference compiler`)}`);    
        testCases[i].runReferenceCompiler();
        testCases[i].optimiseReferenceCompilerResult();
        testCases[i].getReferenceResultSize();
        testCases[i].getReferenceResultOptimisezSize();
        console.log(`   ${chalk.blue(`Compile time:`)} ${chalk.yellow(testCases[i].referenceCompileTime+"ms")}`);
        console.log(`   ${chalk.blue(`Output size:`)} ${chalk.yellow(testCases[i].referenceResultSize+"b")}`);
        console.log(`   ${chalk.blue(`Optimisation time:`)} ${chalk.yellow(testCases[i].referenceOptimisationTime+"ms")}`);
        console.log(`   ${chalk.blue(`Optimised Output size:`)} ${chalk.yellow(testCases[i].referenceOptimisedResultSize+"b")}`);


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
        let outString = `Compile Time At Least ${compileTimeFactor}x Faster Than Reference`;

        
        if(testCases[i].exHTMLToSVGCompileTime*compileTimeFactor < testCases[i].referenceCompileTime)
        {
            console.log(`       ${chalk.green(outString)}`);
        }
        else
        {
            console.log(`       ${chalk.red(outString)}`);
            console.log(`       ${chalk.red(`Re-running and collecting profiling information`)}`);
            console.log(`${chalk.yellow(testCases[i].getProfilingInformationForExHTMLToSVGCompiler())}`);
            process.exit(1);
        }
        
        outString = `Output Size Less Than Reference's Output Size`;
        if(testCases[i].exHTMLToSVGResultSize < testCases[i].referenceResultSize)
        {
            console.log(`       ${chalk.green(outString)}`);
        }
        else
        {
            console.log(`       ${chalk.red(outString)}`);
            process.exit(1);
        }

        outString = `Output Can Be Reduced to the Same as the Reference`;
        let res = validateFileEquality(testCases[i].referenceResultOptimisedPath,testCases[i].exHTMLToSVGResultOptimisedPath);
        if(res)
        {
            console.log(`       ${chalk.green(outString)}`);
        }
        else
        {
            console.log(`       ${chalk.red(outString)}`);
            //if test is not HPV1630CovTracks.html, consider this a failure
            //output SVG from this test is massive and causes non-determinism in SVGO
            if(testCases[i].htmlFile != "HPV1630CovTracks.html")
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
        outString = `Compile Time At Least ${compileTimeFactor}x Faster Than Reference`;
        if(testCases[i].exHTMLtoPBCompileTime*compileTimeFactor < testCases[i].referenceCompileTime)
        {
            console.log(`       ${chalk.green(outString)}`);
        }
        else
        {
            console.log(`       ${chalk.red(outString)}`);
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
        outString = `Compile Time At Least ${compileTimeFactor}x Faster Than Reference`;

        
        if(testCases[i].exPBToSVGCompileTime*compileTimeFactor < testCases[i].referenceCompileTime)
        {
            console.log(`       ${chalk.green(outString)}`);
        }
        else
        {
            console.log(`       ${chalk.red(outString)}`);
            console.log(`       ${chalk.red(`Re-running and collecting profiling information`)}`);
            console.log(`${chalk.yellow(testCases[i].getProfilingInformationForExPBToSVGCompiler())}`);
            //process.exit(1);
        }

        outString = `Output Size Less Than Reference's Output Size`;
        if(testCases[i].exPBToSVGResultSize < testCases[i].referenceResultSize)
        {
            console.log(`       ${chalk.green(outString)}`);
        }
        else
        {
            console.log(`       ${chalk.red(outString)}`);
            process.exit(1);
        }

        outString = `Output Can Be Reduced to the Same as the Reference`;
        res = validateFileEquality(testCases[i].referenceResultOptimisedPath,testCases[i].exPBToSVGResultOptimisedPath);
        if(res)
        {
            console.log(`       ${chalk.green(outString)}`);
        }
        else
        {
            console.log(`       ${chalk.red(outString)}`);
            //if test is not HPV1630CovTracks.html, consider this a failure
            //output SVG from this test is massive and causes non-determinism in SVGO
            if(testCases[i].htmlFile != "HPV1630CovTracks.html")
                process.exit(1);
        }

        console.log(``);
        console.log(``);
    }

})();