import {TestCase,TestCaseInit} from "./testCase";

export function queueTests() : Array<TestCase>
{
    let testCases : Array<TestCase> = new Array<TestCase>();

    /*testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "2Labels.html",
        jsonFile : undefined,
        name : "2 Track Labels",
        type : "directive"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "2TrackMarkers.html",
        jsonFile : undefined,
        name : "2 Track Markers",
        type : "directive"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "trackMarkers.html",
        jsonFile : undefined,
        name : "Track Markers",
        type : "directive"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "2trackScales.html",
        jsonFile : undefined,
        name : "2 Track Scales",
        type : "directive"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "3trackScales.html",
        jsonFile : undefined,
        name : "3 Track Scales",
        type : "directive"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "1MarkerLabel.html",
        jsonFile : undefined,
        name : "1 Marker Label",
        type : "directive"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "1MarkerLabel2.html",
        jsonFile : undefined,
        name : "1 Marker Label 2",
        type : "directive"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "1MarkerLabel3.html",
        jsonFile : undefined,
        name : "1 Marker Label 3",
        type : "directive"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "dashedArray.html",
        jsonFile : "dashedArray.json",
        name : "Dashed Array",
        type : "directive"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "sectionIndicator.html",
        jsonFile : "sectionIndicator.json",
        name : "Section Indicator",
        type : "directive"
    }))

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "HSP70.html",
        jsonFile : undefined,
        name : "Angular Plasmid Example: HSP70",
        type : "example"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "pBCA-RLuc.html",
        jsonFile : undefined,
        name : "Angular Plasmid Example: pBCA-RLuc",
        type : "example"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "pBR322.html",
        jsonFile : undefined,
        name : "Angular Plasmid Example: pBR322",
        type : "example"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "pLVG440.html",
        jsonFile : undefined,
        name : "Angular Plasmid Example: pLVG440",
        type : "example"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "pPMA43C.html",
        jsonFile : undefined,
        name : "Angular Plasmid Example: pPMA43C",
        type : "example"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "pUC19.html",
        jsonFile : undefined,
        name : "Angular Plasmid Example: pUC19",
        type : "example"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "strPropPlusStrLit.html",
        jsonFile :"strPropPlusStrLit.json",
        name : "Interpolation: String Property + String Literal",
        type : "interpolation"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "OTBStrPropPlusStrLit.html",
        jsonFile :"OTBStrPropPlusStrLit.json",
        name : "Interpolation: One-Time-Bound String Property + String Literal",
        type : "interpolation"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "strLitPlusStrProp.html",
        jsonFile :"strLitPlusStrProp.json",
        name : "Interpolation: String Literal + String Property",
        type : "interpolation"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "numPropPlusNumLit.html",
        jsonFile :"numPropPlusNumLit.json",
        name : "Interpolation: Number Property + Number Literal",
        type : "interpolation"
    }));*/

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "HPV16L6R1BareSNPs.html",
        jsonFile :"HPV16L6R1BareSNPs.json",
        name : "L6R1 SNPs on HPV16",
        type : "example"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "HPV16WithL6R1SNPs.html",
        jsonFile :"HPV16WithL6R1SNPs.json",
        name : "HPV16 With L6R1 SNPs",
        type : "example"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "ch38.html",
        jsonFile :"ch38.json",
        name : "Stress Test: ch38",
        type : "stress"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "L6R1HPV16Cov.html",
        jsonFile :"L6R1HPV16Cov.json",
        name : "Stress Test: HPV16 L6R1 Coverage Track",
        type : "stress"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "HPV165CovTracks.html",
        jsonFile :"HPV165CovTracks.json",
        name : "Stress Test: HPV16 With 5 L6R1 Coverage Tracks",
        type : "stress"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "HPV1615CovTracks.html",
        jsonFile :"HPV1615CovTracks.json",
        name : "Stress Test: HPV16 With 15 L6R1 Coverage Tracks",
        type : "stress"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "HPV1630CovTracks.html",
        jsonFile :"HPV1630CovTracks.json",
        name : "Stress Test: HPV16 With 30 L6R1 Coverage Tracks",
        type : "stress"
    }));

    testCases.push(new TestCase(<TestCaseInit>{
        htmlFile : "saccharomycesSim.html",
        jsonFile : "saccharomycesSim.json",
        name : "Saccharomyces Simulated Alignment",
        type : "noref"
    }));

    return testCases;
}
