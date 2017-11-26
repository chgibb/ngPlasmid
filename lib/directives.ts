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

/// <reference path="./html" />
/// <reference path="./services" />
/// <reference path="./interpolate" />
/// <reference path="./parseFontSize" />


import * as html from "./html"
import * as services from "./services";
import {interpolate} from "./interpolate";
import {parseFontSize} from "./parseFontSize";
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
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L76
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
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L86
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
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L93
        return this.sequence ? this.sequence.length : this._sequencelength;
    }
    public set sequencelength(sequencelength : number)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L93
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
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L99
        return this._sequence;
    }
    public set sequence(sequence : string)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L99
        this._sequence = sequence;
    }

    private _plasmidclass : string;

    public get plasmidclass() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L104
        return this._plasmidclass;
    }
    public set plasmidclass(plasmidclass : string)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L104
        this._plasmidclass = plasmidclass;
    }

    private _plasmidtstyle : string;

    public get plasmidstyle() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L109
        return this._plasmidtstyle;
    }
    public set plasmidstyle(plasmidstyle : string)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L109
        this._plasmidtstyle = plasmidstyle;
    }
    
    public renderStart() : string
    {
        this.plasmidheight = parseFloat(interpolate(this.plasmidheight.toString(),this.$scope));
        this.plasmidwidth = parseFloat(interpolate(this.plasmidwidth.toString(),this.$scope));
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L60
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
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L60
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
        {
            console.error(node);
            throw new Error("Node type is not tag");
        }
        if(node.name != "plasmid")
            throw new Error("Node is not a plasmid");

        if(node.attribs.sequencelength)
        {
            this.sequencelength = parseFloat(node.attribs.sequencelength);
        }
        if(node.attribs.plasmidheight)
        {
            this.plasmidheight = parseFloat(node.attribs.plasmidheight);//parseFloat(interpolate(node.attribs.plasmidheight,this.$scope));
        }
        if(node.attribs.plasmidwidth)
        {
            this.plasmidwidth = parseFloat(node.attribs.plasmidwidth);//parseFloat(interpolate(node.attribs.plasmidwidth,this.$scope));
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

    public get $scope() : any
    {
        return this.plasmid.$scope;
    }

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
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L254
        return this._radius ? this._radius : 100;
    }
    public set radius(radius : number)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L253
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
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L259
        return this._width ? this._width : 25;
    }
    public set width(width)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L259
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
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L248
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
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L222
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
        return undefined;
    }
    public renderStart() : string
    {
        this.radius = parseFloat(interpolate(this.radius.toString(),this.$scope));
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L179
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
            res += ` style="${this.trackstyle}"`
        res += `></path>`;
        
        for(let i = 0; i != this.children.length; ++i)
        {
            res += this.children[i].renderStart();
        }


        return res;
    }
    public renderEnd() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L179
        let res = "";
        for(let i = 0; i != this.children.length; ++i)
        {
            res += this.children[i].renderEnd();
        }
        res += `</g>`;
        return res;
    }

    public fromNode(node : html.Node) : void
    {
        if(node.type != "tag")
        {
            console.error(node);
            throw new Error("Node type is not tag");
        }
        if(node.name != "plasmidtrack")
            throw new Error("Node is not a plasmidtrack");

        if(node.attribs.trackstyle)
        {
            this.trackstyle = node.attribs.trackstyle;
        }
        if(node.attribs.radius)
        {
            this.radius = parseFloat(node.attribs.radius);//parseFloat(interpolate(node.attribs.radius,this.$scope));
        }
        if(node.attribs.width)
        {
            this.width = parseFloat(node.attribs.width);
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
            else if(node.children[i].name == "trackscale")
            {
                let scale = new TrackScale(this);
                scale.fromNode(node.children[i]);
                this.scales.push(scale);
                this.children.push(scale);
                
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
    /**
     * A reference to the parent track element
     * 
     * @type {PlasmidTrack}
     * @memberof TrackLabel
     */
    public track : PlasmidTrack;
    
    public get $scope() : any
    {
        return this.track.$scope;
    }

    public get center() : services.Point
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L536
        return this.track.center;
    }

    private _text : string;
    
    /**
     * 	Text of the label to draw
     * 
     * @type {string}
     * @memberof TrackLabel
     */
    public get text() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L542
        return this._text;
    }
    public set text(text : string)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L542
        this._text = text;
    }

    private _labelclass : string;

    public get labelclass() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L547
        return this._labelclass;
    }
    public set labelclass(labelclass : string)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L547
        this._labelclass = labelclass;
    }

    private _labelstyle : string;

    public get labelstyle() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L552
        return this._labelstyle;
    }
    public set labelstyle(labelstyle : string)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L552
        this._labelstyle = labelstyle;
    }

    private _hadjust : number;
    
    /**
     * Horizontal offset of the label from the center of the track.
     * A positive number means that the label will be drawn closer to the right, while a negative number means the label will be be drawn closer to the left
     * 
     * @type {number}
     * @memberof TrackLabel
     */
    public get hadjust() : number
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L557
        return this._hadjust ? this._hadjust : 0;
    }
    public set hadjust(hadjust : number)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L557
        this._hadjust = hadjust;
    }

    private _vadjust : number;
    
    /**
     * Vertical offset of the label from the center of the track.
     * A positive number means that the label will be drawn further down, while a negative number will make the label be drawn further up
     * 
     * @type {number}
     * @memberof TrackLabel
     */
    public get vadjust() : number
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L562
        return this._vadjust ? this._vadjust : 0;
    }
    public set vadjust(vadjust : number)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L562
        this._vadjust = vadjust;
    }

    public renderStart() : string
    {
        this.text = interpolate(this.text,this.$scope);
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L524
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
        res += ` class="${this.labelclass ? `${this.labelclass} ` : ""}ng-scope ng-isolate-scope"`;
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
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L524
        return ``;
    }

    public fromNode(node : html.Node) : void
    {
        if(node.type != "tag")
        {
            console.error(node);
            throw new Error("Node type is not tag");
        }
        if(node.name != "tracklabel")
            throw new Error("Node is not a tracklabel");

        if(node.attribs.text)
        {
            this.text = node.attribs.text;//interpolate(node.attribs.text,this.$scope);
        }
        if(node.attribs.vadjust)
        {
            this.vadjust = parseFloat(node.attribs.vadjust);
        }
        if(node.attribs.hadjust)
        {
            this.hadjust = parseFloat(node.attribs.hadjust);
        }
        if(node.attribs.labelstyle)
        {
            this.labelstyle = node.attribs.labelstyle;
        }
        if(node.attribs.labelclass)
        {
            this.labelclass = node.attribs.labelclass;
        }
        if(node.attribs.class)
        {
            this.labelclass = node.attribs.class;
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
    //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L339
    public DEFAULT_LABELVADJUST = 15;

    //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L339
    public DEFAULT_TICKSIZE = 3;

    /**
     * The API docs don't specify that <trackscale>s can have a class attribute, but there are official examples which do.
     * We support it to be consistent with the examples. The classList will be output to the class attribute of the output <path>
     * before the standard AngularJS classes.
     * 
     * @type {Array<string>}
     * @memberof TrackScale
     */
    public classList : Array<string>;

    public style : string;

    /**
     * Determine which side of the track the ticks and labels should appear
     * 
     * @type {("in" | "out")}
     * @memberof TrackScale
     */
    public direction : "in" | "out";

    /**
     * A reference to the parent track element
     * 
     * @type {PlasmidTrack}
     * @memberof TrackScale
     */
    public track : PlasmidTrack;

    public get $scope() : any
    {
        return this.track.$scope;
    }

    public get radius() : number
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L396
        return (this.inwardflg ? this.track.radius : this.track.radius + this.track.width) +  ((this.inwardflg ? -1 : 1) * this.vadjust) + (this.inwardflg ? -(this.ticksize) : 0);
    }

    private _interval : number;

    /**
     * How often a tick mark should be placed.
     * The interval is used along with the plasmid's sequence length to determine how many tick marks to show
     * 
     * @type {number}
     * @memberof TrackScale
     */
    public get interval() : number
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L401
        return this._interval ? this._interval : 0;
    }

    public set interval(interval : number)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L401
        this._interval = interval;
    }

    private _vadjust : number;

    /**
     * Offset in pixels from the track.
     * A positive number means that the ticks will be drawn further away from the track.
     * A negative number will allow ticks to be plced closer to the center of the track
     * 
     * @type {number}
     * @memberof TrackScale
     */
    public get vadjust() : number
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L406
        return this._vadjust ? this._vadjust : 0;
    }

    public set vadjust(vadjust : number)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L406
        this._vadjust = vadjust;
    }

    private _ticksize : number;

    /**
     * Vertical size of the tick marks.
     * If negative, the ticks grow inward.
     * The width of the tickmarks can be styled using the CSS stroke-width property
     * 
     * @type {number}
     * @memberof TrackScale
     */
    public get ticksize() : number
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L411
        return this._ticksize ? this._ticksize : this.DEFAULT_TICKSIZE;
    }

    public set ticksize(ticksize : number)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L411
        this._ticksize = ticksize;
    }

    public get inwardflg() : boolean
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L416
        return this.direction === "in" ? true : false;
    }

    public get total() : number
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L421
        return this.track.plasmid.sequencelength;
    }

    /**
     * The original implementation has showlabels constrained to "0" or "1", but when 
     * reading from it, returns false or true accordingly. This mismatch in accessors in Typescript
     * is not valid. Write to this variable when setting up a <trackscale> and read from
     * showlabels
     * 
     * @private
     * @type {("0" | "1")}
     * @memberof TrackScale
     */
    public showLabelsAttrib : "0" | "1";

    /**
     * Determines if labels will be shown or not
     * 
     * @readonly
     * @type {boolean}
     * @memberof TrackScale
     */
    public get showlabels() : boolean
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L426
        return this.showLabelsAttrib === "1" ? true : false;
    }

    private _labelvadjust : number;

    /**
     * Distance of the labels to their respective tick marks
     * 
     * @type {number}
     * @memberof TrackScale
     */
    public get labelvadjust() : number
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L431
        return this._labelvadjust ? this._labelvadjust : this.DEFAULT_LABELVADJUST;
    }

    public set labelvadjust(labelvadjust : number)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L431
        this._labelvadjust = labelvadjust;
    }

    private _tickclass : string;

    public get tickclass() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L436
        return this._tickclass;
    }

    public set tickclass(tickclass : string)
    {
        this._tickclass = tickclass;
    }

    private _tickstyle : string;

    public get tickstyle() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L441
        return this._tickstyle;
    }

    public set tickstyle(tickstyle : string)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L441
        this._tickstyle = tickstyle;
    }

    private _labelclass : string;

    /**
     * Provide a class name to style the labels
     * 
     * @type {string}
     * @memberof TrackScale
     */
    public get labelclass() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L446
        return this._labelclass;
    }

    public set labelclass(labelclass : string)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L446
        this._labelclass = labelclass;
    }

    private _labelstyle : string;

    /**
     * Indicate the style of the labels directly using this property
     * 
     * @type {string}
     * @memberof TrackScale
     */
    public get labelstyle() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L451
        return this._labelstyle;
    }

    public set labelstyle(labelstyle : string)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L451
        this._labelstyle = labelstyle;
    }

    public get labelradius() : number
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L456
        return this.radius + (this.labelvadjust * (this.inwardflg ? -1 : 1));
    }

    public renderStart() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L352
        let res = "";

        res += `<g`;
        if(this.interval)
        {
            res += ` interval="${this.interval}" `;
        }
        if(this.direction)
        {
            res += ` direction="${this.direction}" `;
        }
        if(this.ticksize)
        {
            res += ` ticksize="${this.ticksize}" `;
        }
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
        res += `<path class="${classAttrib}" `;
        if(this.style)
        {
            res += ` style="${this.style}" `;
        }
        res += ` d="${services.pathScale(this.track.center.x,this.track.center.y,this.radius,this.interval,this.total,this.ticksize)}" `;
        res += `></path>`
        res += `<g>`;
        if(this.showlabels)
        {
            //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L380
            let labels = services.elementScaleLabels(this.track.center.x,this.track.center.y,this.labelradius,this.interval,this.total);
            for(let i = 0; i != labels.length; ++i)
            {
                res += `<text`;
                if(this.labelclass)
                {
                    res += ` class="${this.labelclass}" `;
                }
                if(this.labelstyle)
                {
                    res += ` style="${this.labelstyle}" `;
                }
                res += ` x="${labels[i].x}" `;
                res += ` y="${labels[i].y}" `;
                res += ` text-anchor="middle" alignment-baseline="middle">${labels[i].text}</text>`;
            }
        }
        res += `</g>`;
        res += `</g>`;
        return res;
    }
    public renderEnd() : string
    {
        return ``;
    }
    
    public fromNode(node : html.Node) : void
    {
        if(node.type != "tag")
        {
            console.error(node);
            throw new Error("Node type is not tag");
        }
        if(node.name != "trackscale")
            throw new Error("Node is not a trackscale");
        if(node.attribs.interval)
        {
            this.interval = parseFloat(node.attribs.interval);
        }
        if(node.attribs.style)
        {
            this.style = node.attribs.style;
        }
        if(node.attribs.labelstyle)
        {
            this.labelstyle = node.attribs.labelstyle;
        }
        if(node.attribs.labelclass)
        {
            this.labelclass = node.attribs.labelclass;
        }
        if(node.attribs.direction)
        {
            this.direction = node.attribs.direction;
        }
        if(node.attribs.ticksize)
        {
            this.ticksize = parseFloat(node.attribs.ticksize);
        }
        if(node.attribs.showlabels)
        {
            this.showLabelsAttrib = node.attribs.showlabels;
        }
        if(node.attribs.vadjust)
        {
            this.vadjust = parseFloat(node.attribs.vadjust);
        }
        if(node.attribs.labelvadjust)
        {
            this.labelvadjust = parseFloat(node.attribs.labelvadjust);
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
        this.tagType = "trackscale";
        this.track = track;
        this.classList = new Array<string>();
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
     * @type {services.Arrow}
     * @memberof TrackMarker
     */
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
        return services.pathArc(center.x, center.y, radius.inner, angle.start, angle.end, this.width, this.arrowstart, this.arrowend);
    }

    /**
     * Returns the marker's {x, y} position offset by some optional parameters.
     * If no parameters are provided, the function returns {x,y} locations for 9 positions of the marker
     * 
     * @param {number} hAdjust 
     * @param {number} vAdjust 
     * @param {string} hAlign 
     * @param {string} vAlign 
     * @returns {(services.Position<services.PositionComponent<services.Point>> | services.Point)} 
     * @memberof TrackMarker
     */
    public getPosition(
        hAdjust? : number,
        vAdjust? : number,
        hAlign? : string,
        vAlign? : string
    ) : services.Position<services.PositionComponent<services.Point>> | services.Point {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L666
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
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L745
        return this.track.center;
    }

    public get radius() : services.Radius
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L750
        return <services.Radius>{
            inner : this.track.radius + this.vadjust,
            outer : this.track.radius + this.vadjust + this.width,
            middle : this.track.radius + this.vadjust + this.width / 2
        };
    }

    public get angle() : services.Angle
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
        endAngle += (endAngle < startAngle) ? 360 : 0;
        midAngle = startAngle + ((endAngle - startAngle) / 2);

        return <services.Angle>{
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

    public get arrowstart() : services.Arrow
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L803
        return <services.Arrow>{
            width : this.arrowstartwidth ? this.arrowstartwidth : 0,
            length : this.arrowstartlength ? this.arrowstartlength : 0,
            angle : this.arrowstartangle ? this.arrowstartangle : 0
        };
    }

    public get arrowend() : services.Arrow
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L812
        return <services.Arrow>{
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

    public renderStart() : string
    {
        this.wadjust = parseFloat(interpolate(this.wadjust.toString(),this.$scope));
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L645
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
        //override class with markerclass if it exists
        if(!this.markerclass)
        {
            for(let i = 0; i != this.classList.length; ++i)
            {
                classAttrib += this.classList[i];
                if(i != this.classList.length - 1)
                    classAttrib += " ";
            }
            if(this.classList.length != 0)
                classAttrib += " ";
            classAttrib += `ng-scope ng-isolate-scope`;
        }
        else
            classAttrib = this.markerclass;
        res += `<path class="${classAttrib}" d="${this.getPath()}" `;
        if(this.markerstyle)
            res += ` style="${this.markerstyle}"`;
        res += `></path>`;

        for(let i = 0; i != this.labels.length; ++i)
        {
            res += this.labels[i].renderStart();
        }
        res += `</g>`;
        
        return res;
    }
    public renderEnd() : string
    {
        let res = ``;
        for(let i = 0; i != this.labels.length; ++i)
        {
            res += this.labels[i].renderEnd();
        }
        return res;
    }

    public fromNode(node : html.Node) : void
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
            this.start = parseFloat(node.attribs.start);
        }
        if(node.attribs.end)
        {
            this.end = parseFloat(node.attribs.end);
        }
        if(node.attribs.markerstyle)
        {
            this.markerstyle = node.attribs.markerstyle;
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
            this.wadjust = parseFloat(node.attribs.wadjust);//parseFloat(interpolate(node.attribs.wadjust,this.$scope));
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
                let label = new MarkerLabel(this);
                label.fromNode(node.children[i]);
                this.labels.push(label);
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
    /**
     * Determines if line will be drawn from the label to the marker.
     * By default, the line connects the middle of the label with the middle of the marker
     * 
     * @type {("0" | "1")}
     * @memberof MarkerLabel
     */
    public showline : "0" | "1";

    /**
     * Areference to the parent marker element
     * 
     * @type {TrackMarker}
     * @memberof MarkerLabel
     */
    public marker : TrackMarker;

    public classList : Array<string>;

    public get $scope() : any
    {
        return this.marker.$scope;
    }

    public get showlineflg() : boolean
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L1057
        return this.showline === "1" ? true : false;
    }

    private _halign : "middle" | "inner" | "outer" | "end" | "start";

    /**
     * Horizontal alignment of the label with the marker
     * 
     * @type {("middle" | "inner" | "outer")}
     * @memberof MarkerLabel
     */
    public get halign() : "middle" | "inner" | "outer" | "end" | "start"
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L1062
        return this._halign ? this._halign : "middle";
    }

    public set halign(halign : "middle" | "inner" | "outer" | "end" | "start")
    {
        this._halign = halign;
    }

    private _valign : "middle" | "inner" | "outer";
    
    /**
     * Vertical alignment of the label with the marker
     * 
     * @type {("middle" | "inner" | "outer")}
     * @memberof MarkerLabel
     */
    public get valign() : "middle" | "inner" | "outer"
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L1067
        return this._valign ? this._valign : "middle";
    }
    
    public set valign(valign : "middle" | "inner" | "outer")
    {
        this._valign = valign;
    }

    private _hadjust : number;

    /**
     * Horizontal offset of the label from the marker.
     * A positive number means that the label will be drawn closer to the ending position of the marker,
     * while a negative number means the label will be be drawn closer to the starting position of the marker
     * 
     * @type {number}
     * @memberof MarkerLabel
     */
    public get hadjust() : number
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L1072
        return this._hadjust ? this._hadjust : 0;
    }

    public set hadjust(hadjust : number)
    {
        this._hadjust = hadjust;
    }

    private _vadjust : number;

    /**
     * Vertical offset of the label from the marker.
     * A positive number means that the label will be drawn further away from the marker,
     * while a negative number will make the label be drawn closer to the center of the track
     * 
     * @type {number}
     * @memberof MarkerLabel
     */
    public get vadjust() : number
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L1077
        return this._vadjust ? this._vadjust : 0;
    }

    public set vadjust(vadjust : number)
    {
        this._vadjust = vadjust;
    }

    private _type : string;

    /**
     * Labels can either be drawn normally, or can follow the circular path of the marker
     * 
     * @type {string}
     * @memberof MarkerLabel
     */
    public get type() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L1082
        return this._type;   
    }

    public set type(type : string)
    {
        this._type = type;
    }

    private _linevadjust : number;
    
    /**
     * Vertical adjustment of the line to the label
     * 
     * @type {number}
     * @memberof MarkerLabel
     */
    public get linevadjust() : number
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L1087
        return this._linevadjust ? this._linevadjust : 0;
    }

    public set linevadjust(linevadjust : number)
    {
        this._linevadjust = linevadjust;
    }

    private _labelclass : string;

    public get labelclass() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L1092
        return this._labelclass;
    }

    public set labelclass(labelclass : string)
    {
        this._labelclass = labelclass;
    }

    private _labelstyle : string;

    public get labelstyle() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L1097
        return this._labelstyle;
    }

    public set labelstyle(labelstyle : string)
    {
        this._labelstyle = labelstyle;
    }

    private _linestyle : string;

    /**
     * Style of the line going from the label to the marker
     * 
     * @type {string}
     * @memberof MarkerLabel
     */
    public get linestyle() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L1102
        return this._linestyle;
    }

    public set linestyle(linestyle : string)
    {
        this._linestyle = linestyle;
    }

    private _lineclass : string;

    /**
     * Class name of the line going from the label to the marker
     * 
     * @type {string}
     * @memberof MarkerLabel
     */
    public get lineclass() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L1107
        return this._lineclass;
    }

    public set lineclass(lineclass : string)
    {
        this._lineclass = lineclass;
    }

    private _text : string;

    /**
     * Text of the label
     * 
     * @type {string}
     * @memberof MarkerLabel
     */
    public get text() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L1112
        return this._text;
    }

    public set text(text : string)
    {
        this._text = text;
    }

    public getPath(hAdjust : number, vAdjust : number, hAlign : string, vAlign : string)
    {
        let VALIGN_MIDDLE = "middle";
        let VALIGN_INNER = "inner";
        let VALIGN_OUTER = "outer";
        let HALIGN_MIDDLE = "middle";
        let HALIGN_START = "start";
        let HALIGN_END = "end";
        let center = this.marker.center;
        let radius;
        let markerRadius;
        let markerAngle;
        let startAngle;
        let endAngle;

        markerRadius = this.marker.radius;
        switch (vAlign) {
        case VALIGN_INNER:
            radius = markerRadius.inner;
            break;
        case VALIGN_OUTER:
            radius = markerRadius.outer;
            break;
        default:
            radius = markerRadius.middle;
            break;
        }

        markerAngle = this.marker.angle;
        switch (hAlign) {
        case HALIGN_START:
            startAngle = markerAngle.start;
            endAngle = markerAngle.start + 359.99;
            break;
        case HALIGN_END:
            startAngle = markerAngle.end + 1;
            endAngle = markerAngle.end;
            break;
        default:
            startAngle = markerAngle.middle + 180.05;
            endAngle = markerAngle.middle + 179.95;
            break;
        }
        return services.pathArc(this.marker.center.x, this.marker.center.y, radius + Number(vAdjust || 0), startAngle + Number(hAdjust || 0), endAngle + Number(hAdjust || 0), 1);
    }

    public renderStart() : string
    {
        this.vadjust = parseFloat(interpolate(this.vadjust.toString(),this.$scope));
        let res = "";
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L935
        let id = 'TPATH' + (Math.random() + 1).toString(36).substring(3, 7);

        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L950
        let VALIGN_MIDDLE = "middle";
        let VALIGN_INNER = "inner";
        let VALIGN_OUTER = "outer";
        let HALIGN_MIDDLE = "middle";
        let HALIGN_START = "start";
        let HALIGN_END = "end";

        res += `<g`;

        if(this.type)
            res += ` type="${this.type}" `;
        
        if(this.text)
            res += ` text="${this.text}" `;
        
        res += `>`;

        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L1002
        if(!this.showlineflg)
            res += `<path></path>`;

        else
        {
            res += `<path`;

            //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L1004
            let src = this.marker.getPosition(this.hadjust, this.vadjust + this.linevadjust, this.halign, this.valign);
            
            let dstPos = this.marker.getPosition();
            let dstV = this.valign === VALIGN_INNER ? (<services.Position<services.PositionComponent<services.Point>>>dstPos).inner : this.valign === VALIGN_MIDDLE ? (<services.Position<services.PositionComponent<services.Point>>>dstPos).middle : (<services.Position<services.PositionComponent<services.Point>>>dstPos).outer;
            let dst = this.halign === HALIGN_START ? dstV.begin : this.halign === HALIGN_END ? dstV.end : dstV.middle;
            res += ` d="${["M", (<services.Point>src).x, (<services.Point>src).y, "L", dst.x, dst.y].join(" ")}" `;

            if(this.lineclass)
                res += ` class="${this.lineclass}" `;

            res += `></path>`;
        }

        res += `<path`;
        res += ` id="${id}" `;
        res += ` style="fill:none;stroke:none" `;
        
        let fontSize = 0;
        fontSize = this.labelstyle ? parseFontSize(this.labelstyle) : 0;
        if(this.type == "path")
        {
            //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L973
            let fontAdjust = (this.valign === VALIGN_OUTER) ? 0 : (this.valign === VALIGN_INNER) ? Number(fontSize || 0) : Number(fontSize || 0) / 2;
            res += ` d="${this.getPath(this.hadjust,this.vadjust - fontAdjust,this.halign,this.valign)}" `;
        }
        res += `></path>`;

        res += `<text`;
        
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L977
        switch(this.halign)
        {
            case HALIGN_START:
                res += ` text-anchor="start" `;
            break;
            case HALIGN_END:
                res += ` text-anchor="end" `;
            break;
            default:
                res += ` text-anchor="middle" `;
            break;
        }

        res += ` alignment-baseline="middle" `;

        //emitting <markerlabel class="..." and <markerlabel labelclass="..." is inconsistent
        //if labelclass is present, we ignore class
        if(!this.labelclass)
        {
            let classAttrib = "";
            for(let i = 0; i != this.classList.length; ++i)
            {
                classAttrib += this.classList[i];
                if(i != this.classList.length - 1)
                    classAttrib += " ";
            }
            if(this.classList.length != 0)
                classAttrib += " ";
            classAttrib += `ng-scope ng-isolate-scope`;

            res += ` class="${classAttrib}" `;
        }

        else
            res += ` class="${this.labelclass}" `;

        if(this.labelstyle)
            res += ` style="${this.labelstyle}" `;
        
        if(fontSize)
            res += ` font-size="${fontSize}" `;

        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L959
        if(this.type == "path")
        {
            res += ` x="" y="" `;
            res += `>`;

            res += `<textPath href="#${id}" `;

            res += ` class="ng-scope" `;

            if(this.halign == HALIGN_START)
            {
                res += ` startOffset="0%" `;
            }
            else if(this.halign == HALIGN_END)
            {
                res += ` startOffset="100%" `;
            }
            else
            {
                res += ` startOffset="50%" `;
            }

            res += `>`;

            if(this.text)
                res += `${this.text}`;

            res += "</textPath>";
        }
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L991
        else
        {
            let pos = this.marker.getPosition(this.hadjust,this.vadjust,this.halign,this.valign);
            res += ` x="${(<services.Point>pos).x}" y="${(<services.Point>pos).y}" `;
            res += `>`;
            res += `${this.text}`;
        }
        
        res +=  "</text></g>"

        return res;
    }

    public renderEnd() : string
    {
        return ``;
    }

    public fromNode(node : html.Node) : void
    {
        if(node.type != "tag")
        {
            throw new Error("Node type is not tag");
        }
        if(node.name != "markerlabel")
            throw new Error("Node is not a markerlabel");
        
        if(node.attribs.type)
        {
            this.type = node.attribs.type;
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
        if(node.attribs.labelclass)
        {
            this.labelclass = node.attribs.labelclass;
        }
        if(node.attribs.labelstyle)
        {
            this.labelstyle = node.attribs.labelstyle;
        }

        //override labelstyle with style if it exists
        if(node.attribs.style)
        {
            this.labelstyle = node.attribs.style;
        }
        if(node.attribs.text)
        {
            this.text = node.attribs.text;
        }
        if(node.attribs.vadjust)
        {
            this.vadjust = parseFloat(node.attribs.vadjust);//parseFloat(interpolate(node.attribs.vadjust,this.$scope));
        }
        if(node.attribs.hadjust)
        {
            this.hadjust = parseFloat(node.attribs.hadjust);
        }
        if(node.attribs.halign)
        {
            this.halign = node.attribs.halign;
        }
        if(node.attribs.valign)
        {
            this.valign = node.attribs.valign;
        }
        if(node.attribs.linevadjust)
        {
            this.linevadjust = parseFloat(node.attribs.linevadjust);
        }
        if(node.attribs.showline)
        {
            this.showline = node.attribs.showline;
        }
        if(node.attribs.lineclass)
        {
            this.lineclass = node.attribs.lineclass;
        }
    }

    public constructor(trackMarker : TrackMarker)
    {
        super();
        this.tagType = "markerlabel";
        this.marker = trackMarker;
        this.classList = new Array<string>();
    }

}
