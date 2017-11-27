/// <reference path="./pb/node.d.ts" />

import * as ngDirectives from "./directives";
import * as pbDirectives from "./pb/node.js";

export function plasmidTrackToPB(plasmidTrack : ngDirectives.PlasmidTrack) : pbDirectives.Node
{
    let res : pbDirectives.Node = new pbDirectives.Node(<pbDirectives.INode>{
        name : "plasmidtrack",
        type : "node",
        attribs : <pbDirectives.IAttributes>{
            radius : plasmidTrack.radius.toString(),
            width : plasmidTrack.width.toString(),
            trackstyle : plasmidTrack.trackstyle.toString()
        }
    });
    res.children = new Array<pbDirectives.INode>();
    for(let i = 0; i != plasmidTrack.children.length; ++i)
    {
        if(plasmidTrack.children[i].tagType == "tracklabel")
        {
            res.children.push(
                new pbDirectives.Node(
                    trackLabelToIPB(
                        (<ngDirectives.TrackLabel>plasmidTrack.children[i])
                    )
                )
            );
        }
        else if(plasmidTrack.children[i].tagType == "trackmarker")
        {
            res.children.push(
                new pbDirectives.Node(
                    trackMarkertoIPB(
                        (<ngDirectives.TrackMarker>plasmidTrack.children[i])
                    )
                )
            );
        }
        else if(plasmidTrack.children[i].tagType == "trackscale")
        {
            res.children.push(
                new pbDirectives.Node(
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
        type : "node",
        attribs : <pbDirectives.IAttributes>{
            text : trackLabel.text.toString(),
            vadjust : trackLabel.vadjust.toString(),
            hadjust : trackLabel.hadjust.toString()
        }
    };

    return res;
}

export function trackScaleToIPB(trackScale : ngDirectives.TrackScale) : pbDirectives.INode
{
    let res : pbDirectives.INode = <pbDirectives.INode>{
        name : "trackscale",
        type : "node",
        attribs : <pbDirectives.IAttributes>{
            interval : trackScale.interval.toString(),
            ticksize : trackScale.ticksize.toString(),
            direction : trackScale.direction.toString(),
            vadjust : trackScale.vadjust.toString(),
            showlabels : trackScale.showlabels.toString(),
            labelvadjust : trackScale.labelvadjust.toString(),
            labelclass : trackScale.labelclass.toString(),
            labelstyle : trackScale.labelstyle.toString()
        }
    };

    return res;
}

export function trackMarkertoIPB(trackMarker : ngDirectives.TrackMarker) : pbDirectives.INode
{
    let res : pbDirectives.INode = <pbDirectives.INode>{
        name : "trackmarker",
        type : "node",
        attribs : <pbDirectives.IAttributes>{
            start : trackMarker.start.toString(),
            end : trackMarker.end.toString(),
            markerstyle : trackMarker.markerstyle.toString(),
            arrowstartlength : trackMarker.arrowstartlength.toString(),
            arrowendlength : trackMarker.arrowendlength.toString(),
            arrowstartangle : trackMarker.arrowstartangle.toString(),
            wadjust : trackMarker.wadjust.toString(),
            vadjust : trackMarker.vadjust.toString(),
            arrowendwidth : trackMarker.arrowendwidth.toString(),
            arrowstartwidth : trackMarker.arrowstartwidth.toString(),
            class : trackMarker.classList.join(" "),
            markerclass : trackMarker.markerclass.toString()
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
        type : "node",
        attribs : <pbDirectives.IAttributes>{
            text : markerLabel.text.toString(),
            vadjust : markerLabel.vadjust.toString(),
            hadjust : markerLabel.hadjust.toString(),
            valign : markerLabel.valign.toString(),
            halign : markerLabel.halign.toString(),
            type : markerLabel.type.toString(),
            showline : markerLabel.showline.toString(),
            linestyle : markerLabel.linestyle.toString(),
            lineclass : markerLabel.lineclass.toString(),
            linevadjust : markerLabel.linevadjust.toString()
        }
    };

    return res;
}