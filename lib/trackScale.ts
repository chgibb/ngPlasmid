import { Directive } from "./directive";
import { PlasmidTrack } from "./plasmidTrack";
import { interpolate } from "./interpolate";
import { GenericNode } from "./genericNode";
import { trackScaleToCanvas } from "./canvas/trackScale";
import { pathScale } from "./services/svg/pathScalecale";
import { elementScaleLabels } from "./services/svg/elementScaleLabelsbels";

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

    public _Idirection : string;

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

    public _Iinterval : string;

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

    public _Ivadjust : string;

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

    public _IshowLabelsAttrib : string;

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

    public generateSVGPath() : string
    {
        return pathScale(this.track.center.x,this.track.center.y,this.radius,this.interval,this.total,this.ticksize);
    }

    public generateSVGPathNumeric() : Array<number>
    {
        return new Array<number>();
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
        this.interval = parseFloat(interpolate(this._Iinterval,this.$scope));
        this.direction = <"in"|"out">interpolate(this._Idirection,this.$scope);
        this.showLabelsAttrib = <"0"|"1">interpolate(this._IshowLabelsAttrib,this.$scope);
        this.vadjust = parseFloat(interpolate(this._Ivadjust,this.$scope));
    }

    public renderStart() : string
    {
        this.interpolateAttributes();
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
        res += ` d="${this.getSVGPath()}" `;
        res += `></path>`
        res += `<g>`;
        if(this.showlabels)
        {
            //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L380
            let labels = elementScaleLabels(this.track.center.x,this.track.center.y,this.labelradius,this.interval,this.total);
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
    
    public fromNode<T extends GenericNode<T>>(node : T) : void
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
            this._Iinterval = node.attribs.interval;
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
            this._Idirection = node.attribs.direction;
        }
        if(node.attribs.ticksize)
        {
            this.ticksize = parseFloat(node.attribs.ticksize);
        }
        if(node.attribs.showlabels)
        {
            this._IshowLabelsAttrib = node.attribs.showlabels;
        }
        if(node.attribs.vadjust)
        {
            this._Ivadjust = node.attribs.vadjust;
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

    public toCanvas(ctx : CanvasRenderingContext2D) : void
    {
        trackScaleToCanvas(this,ctx);
    }

    public constructor(track : PlasmidTrack)
    {
        super();
        this.tagType = "trackscale";
        this.track = track;
        this.classList = new Array<string>();
    }
}