const chalk = require("chalk");

import {TestCase,TestCaseInit} from "./testCase";

let testCases : Array<TestCase> = new Array<TestCase>();

(async function(){
    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "2Labels.html",
        jsonFile : undefined,
        name : "2 Track Labels"
    }));

    for(let i = 0; i != testCases.length; ++i)
    {
        console.log(`${chalk.blue("Testing")} ${chalk.yellow(testCases[i].htmlFile)}`);
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

})();