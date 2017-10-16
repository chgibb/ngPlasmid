import * as html from "./html"
import * as services from "./services";
export class Tag
{
    tagType : "plasmid" |
    "plasmidtrack" |
    "tracklabel" |
    "trackscale" |
    "trackmarker" |
    "markerlabel" | 
    "svgelement";
}

export class PlasmidTrack extends Tag
{
    public trackStyle : string;
    public width : number;
    public radius : number;

    public plasmid : Plasmid;
    public markers : Array<TrackMarker>;
    public scales : Array<TrackScale>;
    public labels : Array<TrackLabel>;

    public constructor()
    {
        super();
        this.tagType = "plasmidtrack";
    }
}

export class TrackLabel extends Tag
{
    public text : number;
    public vadjust : number;
    public hadjust : number;
    public labelstyle : string;
    public track : PlasmidTrack;

    public constructor()
    {
        super();
        this.tagType = "tracklabel";
    }
}

export class TrackMarker extends Tag
{
    public start : number;
    public end : number;
    public vadjust : number;
    public wadjust : number;
    public markergroup : string;
    public arrowstartlength : services.Arrow;
    public arrowstartwidth : services.Arrow;
    public arrowstartangle : services.Arrow;
    public arrowendlength : services.Arrow;
    public arrowendwidth : services.Arrow;
    public arrowendangle : services.Arrow;
    public track : PlasmidTrack;
    public labels : Array<TrackLabel>;

    public constructor()
    {
        super();
        this.tagType = "trackmarker";
    }
}

export class MarkerLabel extends Tag
{
    public text : string;
    public vadjust : number;
    public hadjust : number;
    public valign : "middle" | "inner" | "outer";
    public halign : "middle" | "inner" | "outer";
    public type : "path";
    public showline : 0 | 1;
    public linestyle : string;
    public lineclass : string;
    public linevadjust : string;

    public constructor()
    {
        super();
        this.tagType = "markerlabel";
    }

}

export class TrackScale extends Tag
{
    public interval : number;
    public style : string;
    public direction : "in" | "out";
    public vadjust : number;
    public tickSize : number;
    public showLabels : 0 | 1
    public labelvadjust : number;
    public labelstyle : string;
    public labelclass : string;
    public track : PlasmidTrack;

    public constructor()
    {
        super();
        this.tagType = "trackscale";
    }
}

export class Plasmid extends Tag
{
    public sequencelength : number;
    public plasmidheight : number;
    public plasmidwidth : number;
    public sequence : string;
    public plasmidclass : string;
    public plasmidstyle : string;

    public tracks : Array<PlasmidTrack>;

    public constructor()
    {
        super();
        this.tagType = "plasmid";
    }
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