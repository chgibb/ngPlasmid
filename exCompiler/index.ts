class PlasmidTrack
{
    trackStyle : string;
    width : number;
    radius : number;
}

class TrackLabel
{
    text : number;
    labelStyle : string;

}

class TrackMarker
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

class MarkerLabel
{
    type : string;
    classList : string;
    text : string;
    vAdjust : number;
}

class TrackScale
{
    interval : number;
    style : string;
    direction : "in" | "out";
    tickSize : number;
    showLabels : 0 | 1
    labelStyle : string;
}

class Plasmid
{
    sequenceLength : number;
    height : number;
    width : number;
}