import * as pbDirectives from "./pb/node";
import {Plasmid} from "./plasmid";
import {PlasmidTrack} from "./plasmidTrack";
import {TrackLabel} from "./trackLabel";
import {TrackMarker} from "./trackMarker";
import {TrackScale} from "./trackScale";
import {MarkerLabel} from "./markerLabel";

export function plasmidToPB(plasmid : Plasmid) : pbDirectives.Node
{
    let res : pbDirectives.Node = pbDirectives.Node.create(<pbDirectives.INode>{
        name : "plasmid",
        type : "tag",
        attribs : <pbDirectives.IAttributes>{
            //We need to ensure we pass the pre-interpolated values of those attributes which support interpolation
            sequencelength : attribToString(plasmid.sequencelength),
            plasmidheight : attribToString(plasmid._IplasmidHeight),
            plasmidwidth : attribToString(plasmid._IplasmidWidth)
        }
    });
    res.children = new Array<pbDirectives.INode>();
    for(let i = 0; i != plasmid.tracks.length; ++i)
    {
        if(plasmid.tracks[i].tagType == "plasmidtrack")
        {
            res.children.push(
                new pbDirectives.Node(
                    plasmidTrackToPB(plasmid.tracks[i])
                )
            );
        }
    }
    return res;
}

export function plasmidTrackToPB(plasmidTrack : PlasmidTrack) : pbDirectives.Node
{
    let res : pbDirectives.Node = pbDirectives.Node.create({
        name : "plasmidtrack",
        type : "tag",
        attribs : <pbDirectives.IAttributes>{
            radius : attribToString(plasmidTrack._Iradius),
            width : attribToString(plasmidTrack._Iwidth),
            trackstyle : attribToString(plasmidTrack._Itrackstyle)
        }
    });
    res.children = new Array<pbDirectives.INode>();
    for(let i = 0; i != plasmidTrack.children.length; ++i)
    {
        if(plasmidTrack.children[i].tagType == "tracklabel")
        {
            res.children.push(
                pbDirectives.Node.create(
                    trackLabelToIPB(
                        (<TrackLabel>plasmidTrack.children[i])
                    )
                )
            );
        }
        else if(plasmidTrack.children[i].tagType == "trackmarker")
        {
            res.children.push(
                pbDirectives.Node.create(
                    trackMarkertoIPB(
                        (<TrackMarker>plasmidTrack.children[i])
                    )
                )
            );
        }
        else if(plasmidTrack.children[i].tagType == "trackscale")
        {
            res.children.push(
                pbDirectives.Node.create(
                    trackScaleToIPB(
                        (<TrackScale>plasmidTrack.children[i])
                    )
                )
            );
        }
    }

    return res;
}

export function trackLabelToIPB(trackLabel : TrackLabel) : pbDirectives.INode
{
    let res : pbDirectives.INode = <pbDirectives.INode>{
        name : "tracklabel",
        type : "tag",
        attribs : <pbDirectives.IAttributes>{
            text : attribToString(trackLabel._Itext),
            vadjust : attribToString(trackLabel.vadjust),
            hadjust : attribToString(trackLabel.hadjust),
            labelstyle : attribToString(trackLabel.labelstyle),
            labelclass : attribToString(trackLabel.labelclass)
        }
    };

    return res;
}

export function trackScaleToIPB(trackScale : TrackScale) : pbDirectives.INode
{
    let res : pbDirectives.INode = <pbDirectives.INode>{
        name : "trackscale",
        type : "tag",
        attribs : <pbDirectives.IAttributes>{
            interval : attribToString(trackScale._Iinterval),
            ticksize : attribToString(trackScale.ticksize),
            direction : attribToString(trackScale._Idirection),
            vadjust : attribToString(trackScale._Ivadjust),
            showlabels : attribToString(trackScale._IshowLabelsAttrib),
            labelvadjust : attribToString(trackScale.labelvadjust),
            labelclass : attribToString(trackScale.labelclass),
            labelstyle : attribToString(trackScale.labelstyle),
            style : attribToString(trackScale.style),
            class : trackScale.classList ? trackScale.classList.join(" ") : undefined
        }
    };

    return res;
}

export function trackMarkertoIPB(trackMarker : TrackMarker) : pbDirectives.INode
{
    let res : pbDirectives.INode = <pbDirectives.INode>{
        name : "trackmarker",
        type : "tag",
        attribs : <pbDirectives.IAttributes>{
            start : attribToString(trackMarker._Istart),
            end : attribToString(trackMarker._Iend),
            markerstyle : attribToString(trackMarker._Imarkerstyle),
            arrowstartlength : attribToString(trackMarker.arrowstartlength),
            arrowendlength : attribToString(trackMarker.arrowendlength),
            arrowstartangle : attribToString(trackMarker.arrowstartangle),
            wadjust : attribToString(trackMarker._Iwadjust),
            vadjust : attribToString(trackMarker.vadjust),
            arrowendwidth : attribToString(trackMarker.arrowendwidth),
            arrowstartwidth : attribToString(trackMarker.arrowstartwidth),
            class : trackMarker.classList ? trackMarker.classList.join(" ") : undefined,
            markerclass : attribToString(trackMarker.markerclass)
        }
    };
    res.children = new Array<pbDirectives.INode>();
    for(let i = 0; i != trackMarker.labels.length; ++i)
    {
        res.children.push(
            new pbDirectives.Node(
                markerLabelToIPB(
                    (<MarkerLabel>trackMarker.labels[i])
                )
            )
        );
    }

    return res;
}

export function markerLabelToIPB(markerLabel : MarkerLabel) : pbDirectives.INode
{
    let res : pbDirectives.INode = <pbDirectives.INode>{
        name : "markerlabel",
        type : "tag",
        attribs : <pbDirectives.IAttributes>{
            text : attribToString(markerLabel._Itext),
            vadjust : attribToString(markerLabel._Ivadjust),
            hadjust : attribToString(markerLabel.hadjust),
            valign : attribToString(markerLabel.valign),
            halign : attribToString(markerLabel.halign),
            type : attribToString(markerLabel.type),
            showline : attribToString(markerLabel._Ishowline),
            linestyle : attribToString(markerLabel.linestyle),
            lineclass : attribToString(markerLabel._Ilineclass),
            linevadjust : attribToString(markerLabel.linevadjust),
            labelclass : attribToString(markerLabel.labelclass),
            labelstyle : attribToString(markerLabel.labelstyle),
            class : markerLabel.classList ? markerLabel.classList.join(" ") : undefined
        }
    };

    return res;
}

function attribToString(attrib : any) : string | undefined
{
    return attrib !== undefined ? attrib.toString() : undefined;
}