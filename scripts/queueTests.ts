import {TestCase,TestCaseInit} from "./testCase";

export function queueTests() : Array<TestCase>
{
    let testCases : Array<TestCase> = new Array<TestCase>();

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "2Labels.html",
        jsonFile : undefined,
        name : "2 Track Labels"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "2TrackMarkers.html",
        jsonFile : undefined,
        name : "2 Track Markers"
    }));

    return testCases;
}