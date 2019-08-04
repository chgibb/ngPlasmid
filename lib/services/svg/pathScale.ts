import {round10} from "./round10";

export function pathScale(
    x : number,
    y : number,
    radius : number,
    interval : number,
    total : number,
    tickLength : number
) : string 
{
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
    let d : string = "";
    
    for (i = 0; i < numTicks; i += 1) 
    {
        alpha = beta * i - Math.PI / 2;
        cos = Math.cos(alpha);
        sin = Math.sin(alpha);
        d += "M" + round10((x + (radius * cos)), precision) + "," + round10((y + (radius * sin)), precision) + 
        " L" + round10((x + ((radius + tickLength) * cos)), precision) + "," + round10((y + ((radius + tickLength) * sin)), precision) + " ";
    }
    d = d || "M 0,0";
    return d;    
}
