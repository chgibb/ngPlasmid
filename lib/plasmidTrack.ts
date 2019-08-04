import {plasmidTrackToCanvas} from "./canvas/plasmidTrack";
import {Directive} from "./directive";
import {Plasmid} from "./plasmid";
import {interpolate} from "./interpolate";
import {GenericNode} from "./genericNode";
import {TrackMarker} from "./trackMarker";
import {TrackScale} from "./trackScale";
import {TrackLabel} from "./trackLabel";
import {Point} from "./services/svg/point";
import {pathDonut} from "./services/svg/pathDonut";
import {polarToCartesian} from "./services/svg/polarToCartesian";
import {pathDonutNumeric} from "./services/svg/pathDonutNumeric";

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
    public _Itrackstyle : string;

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

    public _Iradius : string;

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

    public _Iwidth : string;

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
     * @type {Point}
     * @memberof PlasmidTrack
     */
    public get center() : Point
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
     * @returns {(Point | undefined)} 
     * @memberof PlasmidTrack
     */
    public getPosition(
        pos : number,
        positionOption : 0 | 1 | 2,
        radiusAdjust : number
    ) : Point | undefined 
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L222
        radiusAdjust = Number(radiusAdjust || 0);
        pos = Number(pos);

        var POSITION_OPTION_MID = 0, POSITION_OPTION_INNER = 1, POSITION_OPTION_OUTER = 2,
            radius, angle, center = this.center,
            seqLen = this.plasmid.sequencelength;

        if (seqLen > 0) 
        {
            angle = (pos / seqLen) * 360;

            switch (positionOption) 
            {
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
            return polarToCartesian(center.x, center.y, radius, angle);
        }
        return undefined;
    }

    public generateSVGPath() : string
    {
        return pathDonut(
            this.center.x,
            this.center.y,
            this.radius,
            this.width
        );
    }

    public generateSVGPathNumeric() : Array<number>
    {
        return pathDonutNumeric(
            this.center.x,
            this.center.y,
            this.radius,
            this.width
        );
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
        this.width = parseFloat(interpolate(this._Iwidth,this.$scope));
        this.trackstyle = interpolate(this._Itrackstyle,this.$scope);
        this.radius = parseFloat(interpolate(this._Iradius,this.$scope));
    }

    public renderStart() : string
    {
        this.interpolateAttributes();
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L179
        let res = "";
        res = res + "<path class=\"ng-scope ng-isolate-scope\" fill-rule=\"evenodd\" ";

        res = res + ` d="${this.getSVGPath()}" `;
        if(this.trackstyle)
            res = res + ` style="${this.trackstyle}"`;
        res = res + "></path>";
        
        for(let i = 0; i != this.children.length; ++i)
        {
            res = res + this.children[i].renderStart();
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

        return res;
    }

    public fromNode<T extends GenericNode<T>>(node : T) : void
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
            this._Itrackstyle = node.attribs.trackstyle;
        }
        if(node.attribs.radius)
        {
            this._Iradius = node.attribs.radius;
        }
        if(node.attribs.width)
        {
            this._Iwidth = node.attribs.width;
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

    public toCanvas(ctx : CanvasRenderingContext2D) : void
    {
        plasmidTrackToCanvas(this,ctx);
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