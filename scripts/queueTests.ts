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

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "trackMarkers.html",
        jsonFile : undefined,
        name : "Track Markers"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "2trackScales.html",
        jsonFile : undefined,
        name : "2 Track Scales"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "3trackScales.html",
        jsonFile : undefined,
        name : "3 Track Scales"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "1MarkerLabel.html",
        jsonFile : undefined,
        name : "1 Marker Label"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "HSP70.html",
        jsonFile : undefined,
        name : "Angular Plasmid Example: HSP70"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "pBCA-RLuc.html",
        jsonFile : undefined,
        name : "Angular Plasmid Example: pBCA-RLuc"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "pBR322.html",
        jsonFile : undefined,
        name : "Angular Plasmid Example: pBR322"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "pLVG440.html",
        jsonFile : undefined,
        name : "Angular Plasmid Example: pLVG440"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "pPMA43C.html",
        jsonFile : undefined,
        name : "Angular Plasmid Example: pPMA43C"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "pUC19.html",
        jsonFile : undefined,
        name : "Angular Plasmid Example: pUC19"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "strPropPlusStrLit.html",
        jsonFile :"strPropPlusStrLit.json",
        name : "Interpolation: String Property + String Literal"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "OTBStrPropPlusStrLit.html",
        jsonFile :"OTBStrPropPlusStrLit.json",
        name : "Interpolation: One-Time-Bound String Property + String Literal"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "strLitPlusStrProp.html",
        jsonFile :"strLitPlusStrProp.json",
        name : "Interpolation: String Literal + String Property"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "numPropPlusNumLit.html",
        jsonFile :"numPropPlusNumLit.json",
        name : "Interpolation: Number Property + Number Literal"
    }));

    return testCases;
}