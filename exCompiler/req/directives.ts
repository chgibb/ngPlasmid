/**
    Refer to http://angularplasmid.vixis.com/api.php for full explanations of directives and props/methods

    The nesting rules are extremely simple and are as follows:
    <plasmid>
        <plasmidtrack>
            <tracklabel></tracklabel>
            <trackscale></trackscale>
            <trackmarker>
                <markerlabel></markerlabel>
            </trackmarker>
        </plasmidtrack>
        <svgelement></svgelement>  (Can be used anywhere as long as its within the plasmid element)
    </plasmid>
    <plasmidapi></plasmidapi>
    We ignore anything that is not one of the above tags/does not satisfy the nesting rules, as long as the input node is <plasmid>

    i.e. given:
    <plasmid>
        <tracklabel></tracklabel>
    </plasmid>
    The <plasmid> will be rendered, but the <tracklabel> will be ignored because it does not fit into the above nesting rules

 */

import * as html from "./html"
import * as services from "./services";
export abstract class Directive
{
    tagType : "plasmid" |
    "plasmidtrack" |
    "tracklabel" |
    "trackscale" |
    "trackmarker" |
    "markerlabel" | 
    "svgelement";
    public abstract renderStart() : string;
    public abstract renderEnd() : string;
}

export class PlasmidTrack extends Directive
{
    public trackstyle : string;
    public plasmid : Plasmid;
    public markers : Array<TrackMarker>;
    public scales : Array<TrackScale>;
    public labels : Array<TrackLabel>;
    public children : Array<TrackLabel | TrackScale | TrackMarker>;
    private _radius : number
    public get radius() : number
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L254
        return this._radius ? this._radius : 100;
    }
    public set radius(radius : number)
    {
        this._radius = radius;
    }
    private _width : number;
    public get width() : number
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L259
        return this._width ? this._width : 25;
    }
    public set width(width)
    {
        this._width = width;
    }
    public get center() : services.Point
    {
        return this.plasmid.center;
    }
    public getPosition(
        pos : number,
        positionOption : 0 | 1 | 2,
        radiusAdjust : number
    ) : services.Point | undefined {
        radiusAdjust = Number(radiusAdjust || 0);
        pos = Number(pos);

        var POSITION_OPTION_MID = 0, POSITION_OPTION_INNER = 1, POSITION_OPTION_OUTER = 2,
            radius, angle, center = this.center,
            seqLen = this.plasmid.sequencelength;

        if (seqLen > 0) {
            angle = (pos / seqLen) * 360;

            switch (positionOption) {
            case POSITION_OPTION_INNER:
                radius = this.radius + radiusAdjust;
                break;
            case POSITION_OPTION_OUTER:
                radius = this.radius + this.width + radiusAdjust;
                break;
            default:
                radius = this.radius + (this.width / 2) + radiusAdjust;
                break;
            }
            return services.polarToCartesian(center.x, center.y, radius, angle);
        }
    }
    public renderStart() : string
    {
        let res = "";
        res += `<g`;
        if(this.trackstyle)
            res += ` trackstyle="${this.trackstyle}" `;
        if(this.width)
            res += ` width="${this.width}" `;
        if(this.radius)
            res += ` radius="${this.radius}" `;
        res += `>`;
        res += `<path class="ng-scope ng-isolate-scope" fill-rule="evenodd" `;

        let d : string = services.pathDonut(
            this.center.x,
            this.center.y,
            this.radius,
            this.width
        );

        res += ` d="${d}" `;
        if(this.trackstyle)
            res += ` style="${this.trackstyle}">`
        res += `</path>`;
        
        if(this.children.length == 0)
            res += "</g>";

        else
        {
            for(let i = 0; i != this.children.length; ++i)
            {
                res += this.children[i].renderStart();
            }
        }

        return res;
    }
    public renderEnd() : string
    {
        let res = "";
        if(this.children.length != 0)
            return `</g>`;
        else
        {
            for(let i = 0; i != this.children.length; ++i)
            {
                res += this.children[i].renderEnd();
            }
        }
        return res;
    }

    public fromNode(node : html.Node) : void
    {
        if(node.type != "tag")
            throw new Error("Node type is not tag");
        if(node.name != "plasmidtrack")
            throw new Error("Node is not a plasmidtrack");
        
        if(node.attribs.trackstyle)
        {
            this.trackstyle = node.attribs.trackstyle;
        }
        if(node.attribs.radius)
        {
            this.radius = parseInt(node.attribs.radius);
        }
        if(node.attribs.width)
        {
            this.width = parseInt(node.attribs.width);
        }

        for(let i = 0; i != node.children.length; ++i)
        {
            if(node.children[i].name == "tracklabel")
            {
                let label = new TrackLabel(this);
                label.fromNode(node.children[i]);
                this.labels.push(label);
                this.children.push(label);
            }
            else if(node.children[i].name == "trackmarker")
            {
                let marker = new TrackMarker(this);
                marker.fromNode(node.children[i]);
                this.markers.push(marker);
                this.children.push(marker);
            }
        }
    }

    public constructor(plasmid : Plasmid)
    {
        super();
        this.tagType = "plasmidtrack";
        this.markers = new Array<TrackMarker>();
        this.scales = new Array<TrackScale>();
        this.labels = new Array<TrackLabel>();
        this.children = new Array<TrackLabel | TrackScale | TrackMarker>();
        this.plasmid = plasmid;
    }
}

export class TrackLabel extends Directive
{
    public text : number;
    public vadjust : number;
    public hadjust : number;
    public labelstyle : string;
    public labelclass : string;
    public track : PlasmidTrack;

    public renderStart() : string
    {
        let res = "";

        let center = this.track.center;

        res += `<text`;
        if(this.text)
        {
            res += ` text="${this.text}" `;
        }
        if(this.labelstyle)
        {
            res += ` labelstyle="${this.labelstyle}" `;
        }
        res += ` class="ng-scope ng-isolate-scope ${this.labelclass ? this.labelclass : ""}" `;
        res += ` text-anchor="middle" alignment-baseline="middle" `;
        res += ` x="${center.x+services.Numeric(this.hadjust,0)}" y="${center.y+services.Numeric(this.vadjust,0)}" `;
        
        if(this.labelstyle)
        {
            res += ` style="${this.labelstyle}" `;
        }
        res += `>${this.text ? this.text : ""}</text>`;

        return res;
    }
    public renderEnd() : string
    {
        return ``;
    }

    public fromNode(node : html.Node) : void
    {
        if(node.type != "tag")
            throw new Error("Node type is not tag");
        if(node.name != "tracklabel")
            throw new Error("Node is not a tracklabel");
        
        if(node.attribs.text)
        {
            this.text = node.attribs.text;
        }
        if(node.attribs.vadjust)
        {
            this.vadjust = parseInt(node.attribs.vadjust);
        }
        if(node.attribs.hadjust)
        {
            this.hadjust = parseInt(node.attribs.hadjust);
        }
        if(node.attribs.labelstyle)
        {
            this.labelstyle = node.attribs.labelstyle;
        }
        if(node.attribs.labelclass)
        {
            this.labelclass =node.attribs.labelclass;
        }
    }

    public constructor(track : PlasmidTrack)
    {
        super();
        this.track = track;
        this.tagType = "tracklabel";
    }
}

export class TrackMarker extends Directive
{
    public arrowstartlength : number;
    public arrowstartwidth : services.Arrow;
    public arrowstartangle : services.Arrow;
    public arrowendlength : number;
    public arrowendwidth : services.Arrow;
    public arrowendangle : services.Arrow;
    public track : PlasmidTrack;
    public labels : Array<TrackLabel>;
    public getPath() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L661
        let center = this.track.center;
        let angle = this.angle;
        let radius = this.radius;
        return services.pathArc(center.x, center.y, radius.inner, angle.start, angle.end, this.width, this.arrowstart, this.arrowend);
    }
    public getPosition(
        hAdjust : number,
        vAdjust : number,
        hAlign : string,
        vAlign : string
    ) : services.Position<services.PositionComponent<services.Point>> | services.Point {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L666
        let HALIGN_MIDDLE = "middle";
        let HALIGN_START = "start";
        let HALIGN_END = "end";
        let VALIGN_MIDDLE = "middle";
        let VALIGN_INNER = "inner";
        let VALIGN_OUTER = "outer";
        let center : services.Point;
        let radius : services.Radius | number;
        let angle : services.PositionComponent<number> | number;
        let markerRadius : services.Radius;
        let markerAngle : services.Angle;

        center = this.track.center;
        markerRadius = this.radius;
        markerAngle = this.angle;
        hAdjust = (hAdjust ? hAdjust : 0);
        vAdjust = (vAdjust ? vAdjust : 0);

        if (vAlign !== undefined && hAlign !== undefined) {
            switch (vAlign) {
                case VALIGN_INNER:
                    radius =  markerRadius.inner + vAdjust;
                break;
                case VALIGN_OUTER:
                    radius =  markerRadius.outer + vAdjust;
                break;
                default:
                    radius =  markerRadius.middle + vAdjust;
                break;
            }

            switch (hAlign) {
                case HALIGN_START:
                    angle = markerAngle.start + hAdjust;
                break;
                case HALIGN_END:
                    angle = markerAngle.end + hAdjust;
                break;
                default:
                    angle = markerAngle.middle + hAdjust;
                break;
            }

            return services.polarToCartesian(center.x, center.y, radius, angle);
        }
        else 
        {
            radius = {
                outer : markerRadius.outer + vAdjust,
                inner : markerRadius.inner + vAdjust,
                middle : markerRadius.middle + vAdjust
            };

            angle = {
                begin : markerAngle.start + hAdjust,
                end : markerAngle.end + hAdjust,
                middle : markerAngle.middle + hAdjust
            };


            return {
                outer : {
                    begin: services.polarToCartesian(center.x, center.y, radius.outer, angle.begin),
                    middle: services.polarToCartesian(center.x, center.y, radius.outer, angle.middle),
                    end: services.polarToCartesian(center.x, center.y, radius.outer, angle.end)
                },
                middle : {
                    begin: services.polarToCartesian(center.x, center.y, radius.middle, angle.begin),
                    middle: services.polarToCartesian(center.x, center.y, radius.middle, angle.middle),
                    end: services.polarToCartesian(center.x, center.y, radius.middle, angle.end)
                },
                inner : {
                    begin: services.polarToCartesian(center.x, center.y, radius.inner, angle.begin),
                    middle: services.polarToCartesian(center.x, center.y, radius.inner, angle.middle),
                    end: services.polarToCartesian(center.x, center.y, radius.inner, angle.end)
                }
            };
        }
    }
    public get center() : services.Point
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L745
        return this.track.center;
    }
    public get radius() : services.Radius
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L750
        return <services.Radius>{
            inner : this.track.radius + this.vadjust,
            outer : this.track.radius + this.vadjust + this.width,
            middle : this.track.radius + this.vadjust + this.width / 2
        };
    }
    public get angle() : services.Angle
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L759
        let startAngle : number;
        let endAngle : number;
        let midAngle : number;
        let end : number;
        startAngle = (this.start / this.track.plasmid.sequencelength) * 360;

        end = this.track.plasmid.$scope.end || this.track.plasmid.$scope.start;
        endAngle = (end ? end : 0 / this.track.plasmid.sequencelength) * 360;
        endAngle += (endAngle < startAngle) ? 360 : 0;

        midAngle = startAngle + ((endAngle - startAngle) / 2);

        return <services.Angle>{
            start : startAngle,
            middle : midAngle,
            end : endAngle
        };
    }
    private _vadjust : number;
    public get vadjust() : number
    {
        return this._vadjust ? this._vadjust : 0;
    }
    public set vadjust(vadjust : number)
    {
        this._vadjust = vadjust;
    }
    private _wadjust : number;
    public get wadjust() : number
    {
        return this._wadjust ? this._wadjust : 0;
    }
    public set wadjust(wadjust : number)
    {
        this._wadjust = wadjust;
    }
    public get width() : number
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L788
        return this.track.width + this.wadjust;
    }
    private _start : number;
    public get start() : number
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L793
        return this._start ? this._start : 0;
    }
    public set start(start : number)
    {
        this._start = start;
    }
    private _end : number;
    public get end() : number
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L798
        return this._end ? this._end : 0;
    }
    public set end(end : number)
    {
        this._end = end;
    }
    public get arrowstart() : services.Arrow
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L803
        return <services.Arrow>{
            width : this.arrowstartwidth ? this.arrowstartwidth : 0,
            length : this.arrowstartlength ? this.arrowstartlength : 0,
            angle : this.arrowstartangle ? this.arrowstartangle : 0
        };
    }
    public get arrowend() : services.Arrow
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L812
        return <services.Arrow>{
            width : this.arrowendwidth ? this.arrowendwidth : 0,
            length : this.arrowendlength ? this.arrowendlength : 0,
            angle : this.arrowendangle ? this.arrowendangle : 0
        }
    }
    private _markergroup : string;
    public get markergroup() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L821
        return this._markergroup;
    }
    public set markergroup(markergroup : string)
    {
        this._markergroup = markergroup;
    }
    private _markerclass : string;
    public get markerclass() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L826
        return this._markerclass;
    }
    public set markerclass(markerclass : string)
    {
        this._markerclass = markerclass;
    }
    private _markerstyle : string;
    public get markerstyle() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L831
        return this._markerstyle;
    }
    public set markerstyle(markerstyle : string)
    {
        this._markerstyle = markerstyle;
    }
    public get sequence() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L836
        let plasmidSeq = this.track.plasmid.sequence;
        let markerSeq = '';
    
        if (this.start > this.end) {
            return plasmidSeq.substring(this.start - 1, plasmidSeq.length - 1) + plasmidSeq.substring(0, this.end - 1);
        } 
        else {
            return plasmidSeq.substring(this.start - 1, this.end - 1);
        }
    }

    public renderStart() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L645

        return ``;
    }
    public renderEnd() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L645
        return ``;
    }

    public fromNode(node : html.Node) : void
    {
        if(node.type != "tag")
            throw new Error("Node type is not tag");
        if(node.name != "trackmarker")
            throw new Error("Node is not a trackmarker");
        if(node.attribs.start)
        {
            this.start = parseInt(node.attribs.start);
        }
        if(node.attribs.end)
        {
            this.end = parseInt(node.attribs.end);
        }
        if(node.attribs.markerstyle)
        {
            this.markerstyle = node.attribs.markerstyle;
        }
        if(node.attribs.arrowstartlength)
        {
            this.arrowstartlength = parseInt(node.attribs.arrowstartlength)
        }
        if(node.attribs.arrowendlength)
        {
            this.arrowendlength = parseInt(node.attribs.arrowendlength);
        }
    }

    public constructor(track : PlasmidTrack)
    {
        super();
        this.tagType = "trackmarker";
        this.track = track;
    }
}

export class MarkerLabel extends Directive
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

    public renderStart() : string
    {
        return ``;
    }
    public renderEnd() : string
    {
        return ``;
    }

    public constructor()
    {
        super();
        this.tagType = "markerlabel";
    }

}

export class TrackScale extends Directive
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

    public renderStart() : string
    {
        return ``;
    }
    public renderEnd() : string
    {
        return ``;
    }
    
    public constructor()
    {
        super();
        this.tagType = "trackscale";
    }
}

export class Plasmid extends Directive
{
    public plasmidheight : number;
    public plasmidwidth : number;
    public sequence : string;
    public plasmidclass : string;
    public plasmidstyle : string;
    public $scope : any;

    public tracks : Array<PlasmidTrack>;
    public get center() : services.Point
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L76
        let d : services.Dimensions = this.dimensions;
        return {
            x : d.width / 2,
            y : d.height / 2
        }
    }
    public get dimensions() : services.Dimensions
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L86
        return {
            height : this.plasmidheight,
            width : this.plasmidwidth
        }
    }
    public get sequencelength() : number
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L93
        return this.sequence ? this.sequence.length : 0;
    }
    public renderStart() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L60
        let res = "";

        res += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" `;

        if(this.sequencelength)
            res += `sequencelength="${this.sequencelength}" `;

        if(this.plasmidheight)
            res += `plasmidheight="${this.plasmidheight}" `;
    
        if(this.plasmidwidth)
            res += `plasmidwidth="${this.plasmidwidth}" `;
    
        res += `class="ng-scope ng-isolate-scope" `;

        if(this.plasmidheight)
            res += `height="${this.plasmidheight}" ` ;
    
        if(this.plasmidwidth)
            res += `width="${this.plasmidwidth}"`;

        res += ">";
        for(let i = 0; i != this.tracks.length; ++i)
        {
            res += this.tracks[i].renderStart();
        }
        return res;
    }

    public renderEnd() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L60
        let res = "";
        for(let i = 0; i != this.tracks.length; ++i)
        {
            res += this.tracks[i].renderEnd();
        }
        res += `</svg>`;
        return res;
    }

    public fromNode(node : html.Node) : void
    {
        if(node.type != "tag")
            throw new Error("Node type is not tag");
        if(node.name != "plasmid")
            throw new Error("Node is not a plasmid");

        if(node.attribs.sequencelength)
        {
            this.sequencelength = parseInt(node.attribs.sequencelength);
        }
        if(node.attribs.plasmidheight)
        {
            this.plasmidheight = parseInt(node.attribs.plasmidheight);
        }
        if(node.attribs.plasmidwidth)
        {
            this.plasmidwidth = parseInt(node.attribs.plasmidwidth);
        }

        for(let i = 0; i != node.children.length; ++i)
        {
            if(node.children[i].name == "plasmidtrack")
            {
                let track : PlasmidTrack = new PlasmidTrack(this);
                track.fromNode(node.children[i]);
                this.tracks.push(track);
            }
        }
    }
    public constructor()
    {
        super();
        this.tagType = "plasmid";
        this.tracks = new Array<PlasmidTrack>();
    }
}
