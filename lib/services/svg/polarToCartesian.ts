import {Point} from "./point";

export function polarToCartesian(
    centerX : number,
    centerY : number,
    radius : number,
    angleInDegrees : number
) : Point 
{
    let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x : centerX + (radius * Math.cos(angleInRadians)),
        y : centerY + (radius * Math.sin(angleInRadians))
    };
}
