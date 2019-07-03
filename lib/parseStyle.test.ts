/// <reference types="jest" />

import {parseStyle} from "./services/parseStyle";

it(`should parse style string 1`,() => {
    expect(parseStyle(`fill-opacity:0.0;fill:rgb(0, 0, 0)`)).toEqual({
        "fill-opacity" : "0.0",
        "fill" : "rgb(0, 0, 0)"
    });

    expect(parseStyle(`fill-opacity:0.0;fill:rgb(0, 0, 0);`)).toEqual({
        "fill-opacity" : "0.0",
        "fill" : "rgb(0, 0, 0)"
    });
});

it(`should parse style string 2`,() => {
    expect(parseStyle(`fill:rgb(0, 0, 0);stroke-width:1px;`)).toEqual({
        "fill" : "rgb(0, 0, 0)",
        "stroke-width" : "1px"
    });
});