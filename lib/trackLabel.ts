import { Directive } from "./directive";
import { PlasmidTrack } from "./plasmidTrack";
import { interpolate } from "./interpolate";
import { trackLabelToCanvas } from "./canvas/trackLabel";
import { GenericNode } from "./genericNode";
import { Point } from "./services/svg/point";

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

    public get center() : Point
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L536
        return this.track.center;
    }

    public _Itext : string;

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

    public interpolateAttributes() : void
    {
        this.text = interpolate(this._Itext,this.$scope);
    }

    public renderStart() : string
    {
        this.interpolateAttributes();
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

    public fromNode<T extends GenericNode<T>>(node : T) : void
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
            this._Itext = node.attribs.text;
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

    public generateSVGPath() : string
    {
        return "";
    }

    public generateSVGPathNumeric() : Array<number>
    {
        return new Array<number>();
    }

    public getSVGPath() : string | undefined
    {
        throw new Error("Not supported by directive");
    }

    public toCanvas(ctx : CanvasRenderingContext2D) : void
    {
        trackLabelToCanvas(this,ctx);
    }

    public constructor(track : PlasmidTrack)
    {
        super();
        this.track = track;
        this.tagType = "tracklabel";
    }
}