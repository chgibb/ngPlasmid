/// <reference types="jest" />

import {trimTrailingChars} from "./utils";

it("should trim correctly 1",() => 
{
    expect(trimTrailingChars("150px",2)).toBe("150");
});
