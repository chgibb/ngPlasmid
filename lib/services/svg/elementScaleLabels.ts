import {Label} from "./label";
import {round10} from "./round10";

export function elementScaleLabels(
    x : number,
    y : number,
    radius : number,
    interval : number,
    total : number
) : Array<Label> 
{
    x = Number(x);
    y = Number(y);
    radius = Number(radius);
    interval = Number(interval);
    total = Number(total);
    
    let alpha : number;
    let sin : number;
    let cos : number; 
    let i : number;
    let numTicks : number = Number(interval) > 0 ? Number(total) / Number(interval) : 0;
    let beta : number = 2 * Math.PI / numTicks;
    let precision : number = -1;
    let labelArr : Array<Label> = new Array<Label>();
    
    for (i = 0; i < numTicks; i += 1) 
    {
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
