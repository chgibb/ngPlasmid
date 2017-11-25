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
        testCases[i].runReferenceCompiler();
        testCases[i].optimiseReferenceCompilerResult();
        console.log(testCases[i].referenceCompileTime);
        console.log(testCases[i].referenceOptimisationTime);
    }

})();