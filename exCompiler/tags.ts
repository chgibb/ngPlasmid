import * as html from "./html"

export class PlasmidTrack
{
    trackStyle : string;
    width : number;
    radius : number;
}

export class TrackLabel
{
    text : number;
    labelStyle : string;

}

export class TrackMarker
{
    start : number;
    end : number;
    markerStyle : string;
    classList : string;
    arrowEndLength : number;
    arrowStartLength : number;
    wAdjust : number;
    vAdjust : number;
}

export class MarkerLabel
{
    type : string;
    classList : string;
    text : string;
    vAdjust : number;
}

export class TrackScale
{
    interval : number;
    style : string;
    direction : "in" | "out";
    tickSize : number;
    showLabels : 0 | 1
    labelStyle : string;
}

export class Plasmid
{
    sequencelength : number;
    plasmidheight : number;
    plasmidwidth : number;
    sequence : string;
    plasmidclass : string;
    plasmidstyle : string;
}

export function toPlasmid(node : html.Node) : Plasmid
{

    let res = new Plasmid();

    if(node.type != "tag")
        throw new Error("Node type is not tag");
    if(node.name != "plasmid")
        throw new Error("Node is not a plasmid");

    if(node.attribs.sequencelength)
    {
        res.sequencelength = parseInt(node.attribs.sequencelength);
    }
    if(node.attribs.plasmidheight)
    {
        res.plasmidheight = parseInt(node.attribs.plasmidheight);
    }
    if(node.attribs.plasmidwidth)
    {
        res.plasmidwidth = parseInt(node.attribs.plasmidwidth);
    }

    return res;
}