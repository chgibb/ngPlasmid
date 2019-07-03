import { polarToCartesian } from "./polarToCartesian";
import { Point } from "./point";
import { Arrow } from "./arrow";

export function pathComplexArc(
    x : number,
    y : number,
    radius : number,
    startAngle : number,
    endAngle : number,
    width : number,
    arrowStart : Arrow,
    arrowEnd : Arrow
) : string {
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
    arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
    let radiusPlusWidth = (radius+width).toString();
    return (<Array<string>>[
        "M", start.x.toString(), start.y.toString(), 
        "A", radius.toString(), radius.toString(), "0", arcSweep, "0", end.x.toString(), end.y.toString(), 
        "L", arrow_start_1.x.toString(), arrow_start_1.y.toString(),
        "L", arrow_start_2.x.toString(), arrow_start_2.y.toString(),
        "L", arrow_start_3.x.toString(), arrow_start_3.y.toString(), 
        "L", arrow_start_4.x.toString(), arrow_start_4.y.toString(),
        "A", radiusPlusWidth, radiusPlusWidth, "0", arcSweep, "1", start2.x.toString(), start2.y.toString(),
        "L", arrow_end_1.x.toString(), arrow_end_1.y.toString(),
        "L", arrow_end_2.x.toString(), arrow_end_2.y.toString(),
        "L", arrow_end_3.x.toString(), arrow_end_3.y.toString(),
        "L", arrow_end_4.x.toString(), arrow_end_4.y.toString(),
        "z"
    ]).join(" ");
}
