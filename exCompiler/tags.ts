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
    sequenceLength : number;
    height : number;
    width : number;
}