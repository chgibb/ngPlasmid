export interface Point
{
    x : number;
    y : number;
}

export interface Dimensions
{
    width : number;
    height : number;
}

export interface Ring
{
    start : Point;
    end : Point;
}

export interface Arrow
{
    width : number;
    length : number;
    angle : number;
}

export interface Angle
{
    start : number;
    middle : number;
    end : number;
}

export interface Radius
{
    inner : number;
    outer : number;
    middle : number;
}

export interface Label
{
    x : number;
    y : number;
    text : string;
}

export interface PositionComponent<T>
{
    begin : T;
    middle : T;
    end : T;
}

export interface Position<T>
{
    outer : T;
    middle : T;
    inner : T;
}

export function polarToCartesian(
    centerX : number,
    centerY : number,
    radius : number,
    angleInDegrees : number
) : Point {
    let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x : centerX + (radius * Math.cos(angleInRadians)),
        y : centerY + (radius * Math.sin(angleInRadians))
    };
}

export function pathDonut(
    x : number,
    y : number,
    radius : number,
    width : number
) : string {
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

export function pathArc(
    x : number,
    y : number,
    radius : number,
    startAngle : number,
    endAngle : number,
    width : number,
    arrowStart? : Arrow,
    arrowEnd? : Arrow
) : string {
    let d : string;
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
        d = ["M", start.x, start.y, "L", end.x, end.y].join(" ");
    } else {
        //Draw a "simple" arc if the width is 1
        if (width === 1) {
            start = polarToCartesian(x, y, radius, startAngle);
            end = polarToCartesian(x, y, radius, endAngle);
            if (startAngle < endAngle) {
                arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
            } else {
                arcSweep = endAngle - startAngle <= 180 ? "1" : "0";
            }
            d = [
                "M", start.x, start.y,
                "A", radius, radius, 0, arcSweep, 1, end.x, end.y
            ].join(" ");
        } else {

            // Draw a "complex" arc (We start drawing in reverse, which is why start uses endAngle)
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
            d = [
                "M", start.x, start.y, 
                "A", radius, radius, 0, arcSweep, 0, end.x, end.y, 
                "L", arrow_start_1.x, arrow_start_1.y,
                "L", arrow_start_2.x, arrow_start_2.y,
                "L", arrow_start_3.x, arrow_start_3.y, 
                "L", arrow_start_4.x, arrow_start_4.y,
                "A", radius + width, radius + width, 0, arcSweep, 1, start2.x, start2.y,
                "L", arrow_end_1.x, arrow_end_1.y,
                "L", arrow_end_2.x, arrow_end_2.y,
                "L", arrow_end_3.x, arrow_end_3.y,
                "L", arrow_end_4.x, arrow_end_4.y,
                "z"
            ].join(" ");
        }
    }

    return d;
}

export function pathScale(
    x : number,
    y : number,
    radius : number,
    interval : number,
    total : number,
    tickLength : number
) : string {
    x = Number(x || 0);
    y = Number(y || 0);
    radius = Number(radius || 0);
    interval = Number(interval || 0);
    total = Number(total || 0);
    tickLength = Number(tickLength || 2);
    
    let alpha : number;
    let sin : number;
    let cos : number;
    let i : number;
    let numTicks : number = Number(interval) > 0 ? Number(total) / Number(interval) : 0;
    let beta : number = 2 * Math.PI / numTicks;
    let precision : number = -1;
    let d : string = '';
    
    for (i = 0; i < numTicks; i += 1) {
        alpha = beta * i - Math.PI / 2;
        cos = Math.cos(alpha);
        sin = Math.sin(alpha);
        d += "M" + round10((x + (radius * cos)), precision) + "," + round10((y + (radius * sin)), precision) + 
        " L" + round10((x + ((radius + tickLength) * cos)), precision) + "," + round10((y + ((radius + tickLength) * sin)), precision) + " ";
    }
    d = d || "M 0,0";
    return d;    
}

export function elementScaleLabels(
    x : number,
    y : number,
    radius : number,
    interval : number,
    total : number
) : Array<Label> {
    x = Number(x);
    y = Number(y);
    radius = Number(radius);
    interval = Number(interval);
    total = Number(total);
    
    let alpha : number;
    let sin : number
    let cos : number 
    let i : number;
    let numTicks : number = Number(interval) > 0 ? Number(total) / Number(interval) : 0;
    let beta : number = 2 * Math.PI / numTicks;
    let precision : number = -1;
    let labelArr : Array<Label> = new Array<Label>();
    
    for (i = 0; i < numTicks; i += 1) {
        alpha = beta * i - Math.PI / 2;
        cos = Math.cos(alpha);
        sin = Math.sin(alpha);
        labelArr.push({
            x : (round10((x + (radius * cos)), precision)),
            y : (round10((y + (radius * sin)), precision)),
            text : (<any>(interval * i))
        });
    }
    return labelArr;
}

export function Numeric(numberVal : number,numberDefault : number) : number
{
    return isNaN(numberVal) ? numberDefault || 0 : Number(numberVal);
}

function round10(value : any, exp : any) : number
{
    //https://github.com/vixis/angularplasmid/blob/9ea10c4ed21ee5c2879659dc0b5d3d57086ef873/src/js/services.js#L21
    var type = 'round';
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return (<any>Math)[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = (<any>Math)[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}