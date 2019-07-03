import { polarToCartesian } from "./polarToCartesian";
import { Point } from "./point";
import { Arrow } from "./arrow";
import { pathComplexArcNumeric } from "./pathComplexArcNumeric";

export function pathArcNumeric(
    x : number,
    y : number,
    radius : number,
    startAngle : number,
    endAngle : number,
    width : number,
    arrowStart? : Arrow,
    arrowEnd? : Arrow
) : Array<number> {
    let d : Array<number>;
    let start : Point; 
    let end : Point;
    let arcSweep : number;
    x = Number(x);
    y = Number(y);
    radius = Number(radius);
    startAngle = Number(startAngle);
    endAngle = Number(endAngle);
    width = Number(width);
    arrowStart = arrowStart || {width : 0, length : 0, angle: 0};
    arrowEnd = arrowEnd || {width : 0, length : 0, angle: 0};

    if (startAngle === endAngle) {
        // Draw a line
        start = polarToCartesian(x, y, radius, startAngle);
        end = polarToCartesian(x, y, radius + width, startAngle);
        d = [0, start.x, start.y, 0, end.x, end.y];
    } else {
        //Draw a "simple" arc if the width is 1
        if (width === 1) {
            start = polarToCartesian(x, y, radius, startAngle);
            end = polarToCartesian(x, y, radius, endAngle);
            if (startAngle < endAngle) {
                arcSweep = endAngle - startAngle <= 180 ? 0 : 1;
            } else {
                arcSweep = endAngle - startAngle <= 180 ? 1 : 0;
            }
            d = [
                0, start.x, start.y,
                0, radius, radius, 0, arcSweep, 1, end.x, end.y
            ];
        } else {

            // Draw a "complex" arc (We start drawing in reverse, which is why start uses endAngle)
            return pathComplexArcNumeric(x,y,radius,startAngle,endAngle,width,arrowStart,arrowEnd);
        }
    }

    return d;
}
