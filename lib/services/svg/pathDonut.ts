import {polarToCartesian} from "./polarToCartesian";
import {Ring} from "./ring";

export function pathDonut(
    x : number,
    y : number,
    radius : number,
    width : number
) : string 
{
    let innerRing : Ring;
    let outerRing : Ring;
    let path;

    x = Number(x || 0);
    y = Number(y || 0);
    radius = Number(radius || 0);
    width = Number(width || 0);

    innerRing = {
        start : polarToCartesian(x, y, radius, 359.99),
        end : polarToCartesian(x, y, radius, 0)
    };

    outerRing = {
        start : polarToCartesian(x, y, radius + width, 359.99),
        end : polarToCartesian(x, y, radius + width, 0)
    };

    path = [
        "M", innerRing.start.x, innerRing.start.y,
        "A", radius, radius, 0, 1, 0, innerRing.end.x, innerRing.end.y,
        "M", outerRing.start.x, outerRing.start.y,
        "A", radius + width, radius + width, 0, 1, 0, outerRing.end.x, outerRing.end.y
    ].join(" ");
    return path;
}
