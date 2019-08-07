import {TestCase} from "./testCase";

export function validateCompileTime(testCase : TestCase,factor : number) : boolean
{
    if(testCase.exHTMLToSVGCompileTime!*factor < testCase.referenceCompileTime!)
        return true;
    return false;
}