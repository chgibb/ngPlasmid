import { Arrow } from "./arrow";
import { Point } from "./point";
import { polarToCartesian } from "./polarToCartesian";

export function pathComplexArcNumeric(
    x : number,
    y : number,
    radius : number,
    startAngle : number,
    endAngle : number,
    width : number,
    arrowStart : Arrow,
    arrowEnd : Arrow
) : Array<number> {
    //https://github.com/vixis/angularplasmid/blob/master/src/js/js#L155

    let start : Point; 
    let start2 : Point
    let end : Point;
    let arcSweep : number | string;
    let arrow_start_1 : Point;
    let arrow_start_2 : Point;
    let arrow_start_3 : Point;
    let arrow_start_4 : Point;
    let arrow_end_1 : Point;
    let arrow_end_2 : Point;
    let arrow_end_3 : Point;
    let arrow_end_4 : Point;

    endAngle = endAngle - (arrowEnd.length < 0 ? 0 : arrowEnd.length);
    startAngle = startAngle + (arrowStart.length < 0 ? 0 : arrowStart.length);
    start = polarToCartesian(x, y, radius, endAngle);
    end = polarToCartesian(x, y, radius, startAngle);
    arrow_start_1 = polarToCartesian(x, y, radius - arrowStart.width, startAngle + arrowStart.angle);
    arrow_start_2 = polarToCartesian(x, y, radius + (width / 2), startAngle - arrowStart.length);
    arrow_start_3 = polarToCartesian(x, y, radius + width + arrowStart.width, startAngle + arrowStart.angle);
    arrow_start_4 = polarToCartesian(x, y, radius + width, startAngle);
    arrow_end_1 = polarToCartesian(x, y, radius + width + arrowEnd.width, endAngle - arrowEnd.angle);
    arrow_end_2 = polarToCartesian(x, y, radius + (width / 2), endAngle + arrowEnd.length);
    arrow_end_3 = polarToCartesian(x, y, radius - arrowEnd.width, endAngle - arrowEnd.angle);
    arrow_end_4 = polarToCartesian(x, y, radius, endAngle);
    start2 = polarToCartesian(x, y, radius + width, endAngle);
    arcSweep = endAngle - startAngle <= 180 ? 0 : 1;
    let radiusPlusWidth = (radius+width);
    return [
        0, start.x, start.y, 
        0, radius, radius, 0, arcSweep, 0, end.x, end.y, 
        0, arrow_start_1.x, arrow_start_1.y,
        0, arrow_start_2.x, arrow_start_2.y,
        0, arrow_start_3.x, arrow_start_3.y, 
        0, arrow_start_4.x, arrow_start_4.y,
        0, radiusPlusWidth, radiusPlusWidth, 0, arcSweep, 1, start2.x, start2.y,
        0, arrow_end_1.x, arrow_end_1.y,
        0, arrow_end_2.x, arrow_end_2.y,
        0, arrow_end_3.x, arrow_end_3.y,
        0, arrow_end_4.x, arrow_end_4.y,
        0
    ]
}