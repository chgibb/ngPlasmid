/// <reference path="./pb/node.d.ts" />

import * as ngDirectives from "./directives";
import * as pbDirectives from "./pb/node.js";

export function plasmidToPB(plasmid : ngDirectives.Plasmid) : pbDirectives.Node
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

export function plasmidTrackToPB(plasmidTrack : ngDirectives.PlasmidTrack) : pbDirectives.Node
{
    let res : pbDirectives.Node = pbDirectives.Node.create({
        name : "plasmidtrack",
        type : "tag",
        attribs : <pbDirectives.IAttributes>{
            radius : attribToString(plasmidTrack._Iradius),
            width : attribToString(plasmidTrack.width),
            trackstyle : attribToString(plasmidTrack.trackstyle)
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
                        (<ngDirectives.TrackLabel>plasmidTrack.children[i])
                    )
                )
            );
        }
        else if(plasmidTrack.children[i].tagType == "trackmarker")
        {
            res.children.push(
                pbDirectives.Node.create(
                    trackMarkertoIPB(
                        (<ngDirectives.TrackMarker>plasmidTrack.children[i])
                    )
                )
            );
        }
        else if(plasmidTrack.children[i].tagType == "trackscale")
        {
            res.children.push(
                pbDirectives.Node.create(
                    trackScaleToIPB(
                        (<ngDirectives.TrackScale>plasmidTrack.children[i])
                    )
                )
            );
        }
    }

    return res;
}

export function trackLabelToIPB(trackLabel : ngDirectives.TrackLabel) : pbDirectives.INode
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

export function trackScaleToIPB(trackScale : ngDirectives.TrackScale) : pbDirectives.INode
{
    let res : pbDirectives.INode = <pbDirectives.INode>{
        name : "trackscale",
        type : "tag",
        attribs : <pbDirectives.IAttributes>{
            interval : attribToString(trackScale.interval),
            ticksize : attribToString(trackScale.ticksize),
            direction : attribToString(trackScale.direction),
            vadjust : attribToString(trackScale.vadjust),
            showlabels : attribToString(trackScale.showlabels),
            labelvadjust : attribToString(trackScale.labelvadjust),
            labelclass : attribToString(trackScale.labelclass),
            labelstyle : attribToString(trackScale.labelstyle)
        }
    };

    return res;
}

export function trackMarkertoIPB(trackMarker : ngDirectives.TrackMarker) : pbDirectives.INode
{
    let res : pbDirectives.INode = <pbDirectives.INode>{
        name : "trackmarker",
        type : "tag",
        attribs : <pbDirectives.IAttributes>{
            start : attribToString(trackMarker.start),
            end : attribToString(trackMarker.end),
            markerstyle : attribToString(trackMarker.markerstyle),
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
                    (<ngDirectives.MarkerLabel>trackMarker.labels[i])
                )
            )
        );
    }

    return res;
}

export function markerLabelToIPB(markerLabel : ngDirectives.MarkerLabel) : pbDirectives.INode
{
    let res : pbDirectives.INode = <pbDirectives.INode>{
        name : "markerlabel",
        type : "tag",
        attribs : <pbDirectives.IAttributes>{
            text : attribToString(markerLabel.text),
            vadjust : attribToString(markerLabel._Ivadjust),
            hadjust : attribToString(markerLabel.hadjust),
            valign : attribToString(markerLabel.valign),
            halign : attribToString(markerLabel.halign),
            type : attribToString(markerLabel.type),
            showline : attribToString(markerLabel.showline),
            linestyle : attribToString(markerLabel.linestyle),
            lineclass : attribToString(markerLabel.lineclass),
            linevadjust : attribToString(markerLabel.linevadjust)
        }
    };

    return res;
}

function attribToString(attrib : any) : string | undefined
{
    return attrib !== undefined ? attrib.toString() : undefined;
}