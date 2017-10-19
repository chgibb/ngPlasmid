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

/**
 * A plasmid is the parent element and will generate the svg container within which all of the other graphics are drawn.
 * The plasmid can be given a sequence or an explicit sequencelength to indicate how large the plasmid is.
 * Other directives use this length in various calculations
 * 
 * @export
 * @class Plasmid
 * @extends {Directive}
 */
export class Plasmid extends Directive
{
    /**
     * Height (in pixels) of the box that surrounds the plasmid
     * 
     * @type {number}
     * @memberof Plasmid
     */
    public plasmidheight : number;
    /**
     * Width (in pixels) of the box that surrounds the plasmid
     * 
     * @type {number}
     * @memberof Plasmid
     */
    public plasmidwidth : number;
    public $scope : any;

    /**
     * Returns an array that represents all of the tracks declared in this plasmid
     * 
     * @type {Array<PlasmidTrack>}
     * @memberof Plasmid
     */
    public tracks : Array<PlasmidTrack>;
    /**
     * Returns {x,y} coordinates of the center of the plasmid
     * 
     * @readonly
     * @type {services.Point}
     * @memberof Plasmid
     */
    public get center() : services.Point
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L76
        let d : services.Dimensions = this.dimensions;
        return {
            x : d.width / 2,
            y : d.height / 2
        }
    }
    /**
     * Returns {height,width} of the plasmid
     * 
     * @readonly
     * @type {services.Dimensions}
     * @memberof Plasmid
     */
    public get dimensions() : services.Dimensions
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L86
        return {
            height : this.plasmidheight,
            width : this.plasmidwidth
        }
    }
    private _sequencelength : number;
    /**
     * Size, in nucleotides, of the plasmid represented.
     * If the sequence attribute is specified, sequencelength will not be used.
     * Rather, the length of the sequence will be calcaulated from the provided sequence
     * 
     * @type {number}
     * @memberof Plasmid
     */
    public get sequencelength() : number
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L93
        return this.sequence ? this.sequence.length : this._sequencelength;
    }
    public set sequencelength(sequencelength : number)
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L93
        this._sequencelength = sequencelength;
    }
    private _sequence : string;
    /**
     * Series of nucleotides (ex. 'ATTACGATG') that represents the plasmid to be drawn
     * 
     * @type {string}
     * @memberof Plasmid
     */
    public get sequence() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L99
        return this._sequence;
    }
    public set sequence(sequence : string)
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L99
        this._sequence = sequence;
    }
    private _plasmidclass : string;
    public get plasmidclass() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L104
        return this._plasmidclass;
    }
    public set plasmidclass(plasmidclass : string)
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L104
        this._plasmidclass = plasmidclass;
    }
    private _plasmidtstyle : string;
    public get plasmidstyle() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L109
        return this._plasmidtstyle;
    }
    public set plasmidstyle(plasmidstyle : string)
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L109
        this._plasmidtstyle = plasmidstyle;
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

/**
 * This element draws the plasmid's circular backbone within which a number of different features can be drawn.
 * The plasmidtrack element is represented by an SVG path for a torus
 * 
 * @export
 * @class PlasmidTrack
 * @extends {Directive}
 */
export class PlasmidTrack extends Directive
{
    public trackstyle : string;

    /**
     * Reference to the parent plasmid element
     * 
     * @type {Plasmid}
     * @memberof PlasmidTrack
     */
    public plasmid : Plasmid;

    /**
     * An array that represents all of the markers on this track
     * 
     * @type {Array<TrackMarker>}
     * @memberof PlasmidTrack
     */
    public markers : Array<TrackMarker>;

    /**
     * An array that represents all of the scales on this track
     * 
     * @type {Array<TrackScale>}
     * @memberof PlasmidTrack
     */
    public scales : Array<TrackScale>;

    /**
     * An array that represents all of the labels on this track
     * 
     * @type {Array<TrackLabel>}
     * @memberof PlasmidTrack
     */
    public labels : Array<TrackLabel>;

    public children : Array<TrackLabel | TrackScale | TrackMarker>;

    private _radius : number;

    /**
     * The radius (in pixels) of the track.
     * The radius is inherited by any component that is declared within this plasmidtrack. 
     * Defaults to 100 if nothing provided
     * 
     * @type {number}
     * @memberof PlasmidTrack
     */
    public get radius() : number
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L254
        return this._radius ? this._radius : 100;
    }
    public set radius(radius : number)
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L253
        this._radius = radius;
    }

    private _width : number;

    /**
     * The thickness (in pixels) of the plasmid ring. Defaults to 25 if nothing provided
     * 
     * @type {number}
     * @memberof PlasmidTrack
     */
    public get width() : number
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L259
        return this._width ? this._width : 25;
    }
    public set width(width)
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L259
        this._width = width;
    }

    /**
     * Returns {x,y} coordinates of the center of the track.
     * 
     * @readonly
     * @type {services.Point}
     * @memberof PlasmidTrack
     */
    public get center() : services.Point
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L248
        return this.plasmid.center;
    }
    
    /**
     * Returns the {x,y} coordinates of the provided position on the track.
     * 
     * @param {number} pos 
     * @param {(0 | 1 | 2)} positionOption 
     * @param {number} radiusAdjust 
     * @returns {(services.Point | undefined)} 
     * @memberof PlasmidTrack
     */
    public getPosition(
        pos : number,
        positionOption : 0 | 1 | 2,
        radiusAdjust : number
    ) : services.Point | undefined {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L222
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
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L179
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
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L179
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

/**
 * Draws a label in the middle of a track
 * 
 * @export
 * @class TrackLabel
 * @extends {Directive}
 */
export class TrackLabel extends Directive
{
    public track : PlasmidTrack;
    
    public get center() : services.Point
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L536
        return this.track.center;
    }
    private _text : string;
    public get text() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L542
        return this._text;
    }
    public set text(text : string)
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L542
        this._text = text;
    }
    private _labelclass : string;
    public get labelclass() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L547
        return this._labelclass;
    }
    public set labelclass(labelclass : string)
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L547
        this._labelclass = labelclass;
    }
    private _labelstyle : string;
    public get labelstyle() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L552
        return this._labelstyle;
    }
    public set labelstyle(labelstyle : string)
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L552
        this._labelstyle = labelstyle;
    }
    private _hadjust : number;
    public get hadjust() : number
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L557
        return this._hadjust ? this._hadjust : 0;
    }
    public set hadjust(hadjust : number)
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L557
        this._hadjust = hadjust;
    }
    private _vadjust : number;
    public get vadjust() : number
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L562
        return this._vadjust ? this._vadjust : 0;
    }
    public set vadjust(vadjust : number)
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L562
        this._vadjust = vadjust;
    }

    public renderStart() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L524
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
        res += ` x="${center.x+this.hadjust}" y="${center.y+this.vadjust}" `;
        
        if(this.labelstyle)
        {
            res += ` style="${this.labelstyle}" `;
        }
        res += `>${this.text ? this.text : ""}</text>`;
        return res;
    }
    public renderEnd() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L524
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

/**
 * This element provides labels and tickmarks for the track.
 * It generates an SVG path element representing all the tick marks to be drawn as well as an optional set of SVG text elements for the labels
 * 
 * @export
 * @class TrackScale
 * @extends {Directive}
 */
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
    public arrowstartlength : number;
    public arrowstartwidth : services.Arrow;
    public arrowstartangle : services.Arrow;
    public arrowendlength : number;
    public arrowendwidth : services.Arrow;
    public arrowendangle : services.Arrow;
    /**
     * The API docs don't specify that <trackmarker>s can have a class attribute, but there are official examples which do.
     * We support it to be consistent with the examples. The classList will be output to the class attribute of the output <path>
     * before the standard AngularJS classes.
     * 
     * @type {Array<string>}
     * @memberof TrackMarker
     */
    public classList : Array<string>;
    public track : PlasmidTrack;
    public labels : Array<MarkerLabel>;
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
        end = this.end ? this.end : this.start;
        /*
            In the original implementation of this function, SVGUtil.util.Numeric is used instead of the first ternary below.
            This appears to cause endAngle to equal end in all cases, and as such we simply return end : end.
        */
        endAngle = (end ? end : 0 / this.track.plasmid.sequencelength) * 360;
        endAngle += (endAngle < startAngle) ? 360 : 0;
        midAngle = startAngle + ((endAngle - startAngle) / 2);

        //The original appears to return startAngle as start and end when no end attribute is present on the marker
        return <services.Angle>{
            start : startAngle,
            middle : midAngle,
            end : this.end ? end : startAngle
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
        let res = "";
        res += `<g`;
        if(this.start)
            res += ` start="${this.start}" `;
        if(this.end)
            res += ` end="${this.end}" `;
        if(this.markerstyle)
            res += ` markerstyle="${this.markerstyle}" `;
        if(this.arrowendlength)
            res += ` arrowendlength="${this.arrowendlength}" `;
        if(this.arrowstartlength)
            res += ` arrowstartlength="${this.arrowstartlength}" `;
        
        res += `>`;
        let classAttrib = "";
        for(let i = 0; i != this.classList.length; ++i)
        {
            classAttrib += this.classList[i];
            if(i != this.classList.length - 1)
                classAttrib += " ";
        }
        if(this.classList.length == 1)
            classAttrib += " ";
        classAttrib += `ng-scope ng-isolate-scope`;
        res += `<path class="${classAttrib}" d="${this.getPath()}" `;
        if(this.markerstyle)
            res += ` style="${this.markerstyle}"`;
        res += `></path>`;
        if(this.labels.length == 0)
            res += `</g>`;
        return res;
    }
    public renderEnd() : string
    {
        //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L645
        if(this.labels.length != 0)
            return `</g>`;
        else
            return "";
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
        if(node.attribs.wadjust)
        {
            this.wadjust = parseInt(node.attribs.wadjust);
        }
        if(node.attribs.vadjust)
        {
            this.vadjust = parseInt(node.attribs.vadjust);
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

/**
 * A marker can optionally have a number of markerlabel elements.
 * These elements will inherit positional attributes of their parent trackmarker elements which can be adjusted using the properties below
 * 
 * @export
 * @class MarkerLabel
 * @extends {Directive}
 */
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
