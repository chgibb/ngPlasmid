import {parseStyle} from "../services/parseStyle";

import {TrackLabel} from "./../trackLabel";

export function trackLabelToCanvas(label : TrackLabel,ctx : CanvasRenderingContext2D) : void
{
    ctx.save();
    
    label.interpolateAttributes();

    ctx.fillStyle = "#000";
    ctx.strokeStyle = "rgba(0,0,0,0)";

    let style = parseStyle(label.labelstyle);    

    let weight = style ? (style["font-weight"] ? style["font-weight"] : "") : "";
    let size = style ? (style["font-size"] ? style["font-size"] : "") : "";
    let font = style ? (style["font-family"] ? style["font-family"] : "Times New Roman") : "Times New Roman";
    let text = label.text ? label.text : "";

    ctx.font = " " + weight + " " + size + " " + font;
    ctx.textBaseline = "middle";
    let measure : TextMetrics = ctx.measureText(text);
    let x = label.track.center.x+label.hadjust - (measure.width/2);
    let y = label.track.center.y+label.vadjust;

    ctx.fillText(text,x,y);
    ctx.strokeText(text,x,y);
    ctx.restore();
}