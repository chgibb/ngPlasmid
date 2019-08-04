import {TestCase} from "./testCase";

export function validateOutputSize(testCase : TestCase) : boolean
{
    if(testCase.exHTMLToSVGResultSize! < testCase.referenceResultSize!)
        return true;
    return false;
}
