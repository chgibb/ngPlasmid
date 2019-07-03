import { Directive } from "./directive";
import { PlasmidTrack } from "./plasmidTrack";
import { interpolate } from "./interpolate";
import { trackMarkerToCanvas } from "./canvas/trackMarker";
import { GenericNode } from "./genericNode";
import { MarkerLabel } from "./markerLabel";
import { Arrow } from "./services/svg/arrow";
import { pathArc } from "./services/svg/pathArc";
import { Point } from "./services/svg/point";
import { Radius } from "./services/svg/radius";
import { Angle } from "./services/svg/angle";
import { PositionComponent } from "./services/svg/positionComponent";
import { Position } from "./services/svg/position";
import { polarToCartesian } from "./services/svg/polarToCartesian";
import { pathArcNumeric } from "./services/svg/pathArcNumeric";

/**
 * The primary mechanism to indicate special features on the track is provided by this element using the properties below.
 * A trackmarker will generate an SVG path that draws an arc on the track.
 * It has optional attributes to indicate arrow ends on either side of the marker.
 * In addition, if no end property is provided, the marker will become a line rather than a range.
 * This is important because the styling of a range will use the fill CSS property, however, a marker line will be styled using the stroke CSS property
 * 
 * @export
 * @class TrackMarker
 * @extends {Directive}
 */
export class TrackMarker extends Directive
{
    /**
     * The length, width, and angle of a the starting arrow head can be specified here
     * 
     * @type {number}
     * @memberof TrackMarker
     */
    public arrowstartlength : number;


    public arrowstartwidth : number

    public arrowstartangle : number;

    /**
     * The length, width, and angle of a the ending arrow head can be specified here
     * 
     * @type {number}
     * @memberof TrackMarker
     */
    public arrowendlength : number;

    public arrowendwidth : number;

    /**
     * The length, width, and angle of a the ending arrow head can be specified here
     * 
     * @type {Arrow}
     * @memberof TrackMarker
     */
    public arrowendangle : Arrow;

    /**
     * The API docs don't specify that <trackmarker>s can have a class attribute, but there are official examples which do.
     * We support it to be consistent with the examples. The classList will be output to the class attribute of the output <path>
     * before the standard AngularJS classes.
     * 
     * @type {Array<string>}
     * @memberof TrackMarker
     */
    public classList : Array<string>;

    /**
     * A reference to the parent track element
     * 
     * @type {PlasmidTrack}
     * @memberof TrackMarker
     */
    public track : PlasmidTrack;

    /**
     * An array that represents all of the labels attached to this marker
     * 
     * @type {Array<MarkerLabel>}
     * @memberof TrackMarker
     */
    public labels : Array<MarkerLabel>;

    public get $scope() : any
    {
        return this.track.$scope;
    }

    public getPath() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L661
        let center = this.track.center;
        let angle = this.angle;
        let radius = this.radius;
        return pathArc(center.x, center.y, radius.inner, angle.start, angle.end, this.width, this.arrowstart, this.arrowend);
    }

    /**
     * Returns the marker's {x, y} position offset by some optional parameters.
     * If no parameters are provided, the function returns {x,y} locations for 9 positions of the marker
     * 
     * @param {number} hAdjust 
     * @param {number} vAdjust 
     * @param {string} hAlign 
     * @param {string} vAlign 
     * @returns {(Position<PositionComponent<Point>> | Point)} 
     * @memberof TrackMarker
     */
    public getPosition(
        hAdjust? : number,
        vAdjust? : number,
        hAlign? : string,
        vAlign? : string
    ) : Position<PositionComponent<Point>> | Point {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L666
        let HALIGN_MIDDLE = "middle";
        let HALIGN_START = "start";
        let HALIGN_END = "end";
        let VALIGN_MIDDLE = "middle";
        let VALIGN_INNER = "inner";
        let VALIGN_OUTER = "outer";
        let center : Point;
        let radius : Radius | number;
        let angle : PositionComponent<number> | number;
        let markerRadius : Radius;
        let markerAngle : Angle;

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

            return polarToCartesian(center.x, center.y, radius, angle);
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
                    begin: polarToCartesian(center.x, center.y, radius.outer, angle.begin),
                    middle: polarToCartesian(center.x, center.y, radius.outer, angle.middle),
                    end: polarToCartesian(center.x, center.y, radius.outer, angle.end)
                },
                middle : {
                    begin: polarToCartesian(center.x, center.y, radius.middle, angle.begin),
                    middle: polarToCartesian(center.x, center.y, radius.middle, angle.middle),
                    end: polarToCartesian(center.x, center.y, radius.middle, angle.end)
                },
                inner : {
                    begin: polarToCartesian(center.x, center.y, radius.inner, angle.begin),
                    middle: polarToCartesian(center.x, center.y, radius.inner, angle.middle),
                    end: polarToCartesian(center.x, center.y, radius.inner, angle.end)
                }
            };
        }
    }

    public get center() : Point
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L745
        return this.track.center;
    }

    public get radius() : Radius
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L750
        return <Radius>{
            inner : this.track.radius + this.vadjust,
            outer : this.track.radius + this.vadjust + this.width,
            middle : this.track.radius + this.vadjust + this.width / 2
        };
    }

    public get angle() : Angle
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L759
        let startAngle : number;
        let endAngle : number;
        let midAngle : number;
        let end : number;

        startAngle = (this.start / this.track.plasmid.sequencelength) * 360;
        end = this.end || this.start;
        /*
            In the original implementation of this function, SVGUtil.util.Numeric is used instead of the first ternary below.
            This appears to cause endAngle to equal end in all cases, and as such we simply return end : end.
        */
        endAngle = ((end ? end : 0) / this.track.plasmid.sequencelength) * 360;
        endAngle = endAngle + ((endAngle < startAngle) ? 360 : 0);
        midAngle = startAngle + ((endAngle - startAngle) / 2);

        return <Angle>{
            start : startAngle,
            middle : midAngle,
            end : endAngle
        };
    }

    private _vadjust : number;

    /**
     * Offset in pixels from the track. 
     * A positive number means that the marker will be drawn further away from the track, 
     * while a negative number will make the marker be drawn closer to the center of the track
     * 
     * @type {number}
     * @memberof TrackMarker
     */
    public get vadjust() : number
    {
        return this._vadjust ? this._vadjust : 0;
    }
    public set vadjust(vadjust : number)
    {
        this._vadjust = vadjust;
    }

    public _Iwadjust : string;

    private _wadjust : number;

    /**
     * Offset width of the marker in relation the track's width.
     * A negative number will make the marker thinner than the track,
     * while a positive number will make it thicker.
     * A value of 0 means the marker will be the same width of the track
     * 
     * @type {number}
     * @memberof TrackMarker
     */
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
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L788
        return this.track.width + this.wadjust;
    }

    public _Istart : string;

    private _start : number;

    public get start() : number
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L793
        return this._start ? this._start : 0;
    }
    public set start(start : number)
    {
        this._start = start;
    }

    public _Iend : string;
    private _end : number;

    public get end() : number
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L798
        return this._end ? this._end : 0;
    }
    public set end(end : number)
    {
        this._end = end;
    }

    public get arrowstart() : Arrow
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L803
        return <Arrow>{
            width : this.arrowstartwidth ? this.arrowstartwidth : 0,
            length : this.arrowstartlength ? this.arrowstartlength : 0,
            angle : this.arrowstartangle ? this.arrowstartangle : 0
        };
    }

    public get arrowend() : Arrow
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L812
        return <Arrow>{
            width : this.arrowendwidth ? this.arrowendwidth : 0,
            length : this.arrowendlength ? this.arrowendlength : 0,
            angle : this.arrowendangle ? this.arrowendangle : 0
        }
    }

    private _markergroup : string;

    /**
     * Label a group of markers by giving them a unique name using this property
     * 
     * @type {string}
     * @memberof TrackMarker
     */
    public get markergroup() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L821
        return this._markergroup;
    }
    public set markergroup(markergroup : string)
    {
        this._markergroup = markergroup;
    }

    private _markerclass : string;

    public get markerclass() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L826
        return this._markerclass;
    }
    public set markerclass(markerclass : string)
    {
        this._markerclass = markerclass;
    }

    public _Imarkerstyle : string;

    private _markerstyle : string;

    public get markerstyle() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L831
        return this._markerstyle;
    }
    public set markerstyle(markerstyle : string)
    {
        this._markerstyle = markerstyle;
    }
    
    /**
     * Returns the partial sequence designated by the marker's start and end properties
     * 
     * @readonly
     * @type {string}
     * @memberof TrackMarker
     */
    public get sequence() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L836
        let plasmidSeq = this.track.plasmid.sequence;
        let markerSeq = '';
    
        if (this.start > this.end) {
            return plasmidSeq.substring(this.start - 1, plasmidSeq.length - 1) + plasmidSeq.substring(0, this.end - 1);
        } 
        else {
            return plasmidSeq.substring(this.start - 1, this.end - 1);
        }
    }

    public generateSVGPath() : string
    {
        return this.getPath();
    }

    public generateSVGPathNumeric() : Array<number>
    {
        let center = this.track.center;
        let angle = this.angle;
        let radius = this.radius;
        return pathArcNumeric(center.x, center.y, radius.inner, angle.start, angle.end, this.width, this.arrowstart, this.arrowend);
    }

    public getSVGPath() : string | undefined
    {
        if(this._batchedSVGPath)
        {
            let res = this._batchedSVGPath;
            this._batchedSVGPath = "";
            return res;
        }
        return this.generateSVGPath();
    }

    public interpolateAttributes() : void
    {
        this.start = parseFloat(interpolate(this._Istart,this.$scope));
        this.end = parseFloat(interpolate(this._Iend,this.$scope));
        this.wadjust = parseFloat(interpolate(this._Iwadjust,this.$scope));
        this.markerstyle = interpolate(this._Imarkerstyle,this.$scope);
    }

    public renderStart() : string
    {
        this.interpolateAttributes();
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L645
        let res = "<g>";

        let classAttrib = "";
        //override class with markerclass if it exists
        if(!this.markerclass)
        {
            for(let i = 0; i != this.classList.length; ++i)
            {
                classAttrib = classAttrib + this.classList[i];
                if(i != this.classList.length - 1)
                    classAttrib = classAttrib + " ";
            }
            if(this.classList.length != 0)
                classAttrib = classAttrib + " ";
            classAttrib = classAttrib + `ng-scope ng-isolate-scope`;
        }
        else
            classAttrib = this.markerclass;
        res = res + `<path class="${classAttrib}" d="${this.getSVGPath()}" `;
        if(this.markerstyle)
            res = res + ` style="${this.markerstyle}"`;
        res = res + `></path>`;

        for(let i = 0; i != this.labels.length; ++i)
        {
            res = res + this.labels[i].renderStart();
        }
        res = res + `</g>`;

        return res;
    }
    public renderEnd() : string
    {
        let res = ``;
        for(let i = 0; i != this.labels.length; ++i)
        {
            res = res + this.labels[i].renderEnd();
        }
        return res;
    }

    public fromNode<T extends GenericNode<T>>(node : T) : void
    {
        if(node.type != "tag")
        {
            console.error(node);
            throw new Error("Node type is not tag");
        }
        if(node.name != "trackmarker")
            throw new Error("Node is not a trackmarker");
        if(node.attribs.start)
        {
            this._Istart = node.attribs.start;
        }
        if(node.attribs.end)
        {
            this._Iend = node.attribs.end;
        }
        if(node.attribs.markerstyle)
        {
            this._Imarkerstyle = node.attribs.markerstyle;
        }
        if(node.attribs.arrowstartlength)
        {
            this.arrowstartlength = parseFloat(node.attribs.arrowstartlength)
        }
        if(node.attribs.arrowendlength)
        {
            this.arrowendlength = parseFloat(node.attribs.arrowendlength);
        }
        if(node.attribs.arrowstartangle)
        {
            this.arrowstartangle = parseFloat(node.attribs.arrowstartangle);
        }
        if(node.attribs.wadjust)
        {
            this._Iwadjust = node.attribs.wadjust;
        }
        if(node.attribs.vadjust)
        {
            this.vadjust = parseFloat(node.attribs.vadjust);
        }
        if(node.attribs.arrowendwidth)
        {
            this.arrowendwidth = parseFloat(node.attribs.arrowendwidth);
        }
        if(node.attribs.arrowstartwidth)
        {
            this.arrowstartwidth = parseFloat(node.attribs.arrowstartwidth);
        }
        if(node.attribs.class)
        {
            let classAttrib : Array<string> = node.attribs.class.split(" ");
            for(let i = 0; i != classAttrib.length; ++i)
            {
                if(classAttrib[i] && classAttrib[i] != " ")
                {
                    this.classList.push(classAttrib[i]);
                }
            }
        }
        if(node.attribs.markerclass)
        {
            this.markerclass = node.attribs.markerclass;
        }
        for(let i = 0; i != node.children.length; ++i)
        {
            if(node.children[i].name == "markerlabel")
            {
                this._canDrawToCanvas = false;
                let label = new MarkerLabel(this);
                label.fromNode(node.children[i]);
                this.labels.push(label);
            }
        }
    }

    public toCanvas(ctx : CanvasRenderingContext2D) : void
    {
        if(!this.canDrawToCanvas)
        {
            throw new Error("Cannot draw to canvas due to <markerlabel>s being present");
        }
        trackMarkerToCanvas(this,ctx);
    }

    public constructor(track : PlasmidTrack)
    {
        super();
        this.tagType = "trackmarker";
        this.track = track;
        this.labels = new Array<MarkerLabel>();
        this.classList = new Array<string>();
    }
}
