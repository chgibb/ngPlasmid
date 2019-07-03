import { TrackMarker } from "./trackMarker";
import { Directive } from "./directive";
import { parseFontSize } from "./parseFontSize";
import { interpolate } from "./interpolate";
import { GenericNode } from "./genericNode";
import { pathArc, PositionComponent, Point,Position } from "./services";

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
    public _Ishowline : string;

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

    public _Ivadjust : string;

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

    public _Ilineclass : string;

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

    public _Itext : string;

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
        return pathArc(this.marker.center.x, this.marker.center.y, radius + Number(vAdjust || 0), startAngle + Number(hAdjust || 0), endAngle + Number(hAdjust || 0), 1);
    }

    public generateSVGPath() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L950
        let VALIGN_MIDDLE = "middle";
        let VALIGN_INNER = "inner";
        let VALIGN_OUTER = "outer";
        let HALIGN_MIDDLE = "middle";
        let HALIGN_START = "start";
        let HALIGN_END = "end";
        if(this.type == "path")
        {
            //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L973
            let fontSize = 0;
            fontSize = this.labelstyle ? parseFontSize(this.labelstyle) : 0;
            let fontAdjust = (this.valign === VALIGN_OUTER) ? 0 : (this.valign === VALIGN_INNER) ? Number(fontSize || 0) : Number(fontSize || 0) / 2;
            return this.getPath(this.hadjust,this.vadjust - fontAdjust,this.halign,this.valign)
        }
        else
        {
            //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L1004
            let src = this.marker.getPosition(this.hadjust, this.vadjust + this.linevadjust, this.halign, this.valign);
            let dstPos = this.marker.getPosition();
            let dstV = this.valign === VALIGN_INNER ? (<Position<PositionComponent<Point>>>dstPos).inner : this.valign === VALIGN_MIDDLE ? (<Position<PositionComponent<Point>>>dstPos).middle : (<Position<PositionComponent<Point>>>dstPos).outer;
            let dst = this.halign === HALIGN_START ? dstV.begin : this.halign === HALIGN_END ? dstV.end : dstV.middle;
            return ["M", (<Point>src).x, (<Point>src).y, "L", dst.x, dst.y].join(" ");
        }
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
        this.vadjust = parseFloat(interpolate(this._Ivadjust,this.$scope));
        this.lineclass = interpolate(this._Ilineclass,this.$scope);
        this.showline = (<any>interpolate(this._Ishowline,this.$scope));
        this.text = interpolate(this._Itext,this.$scope);
    }

    public renderStart() : string
    {
        this.interpolateAttributes();
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

            res += ` d="${this.getSVGPath()}" `;

            if(this.lineclass)
                res += ` class="${this.lineclass}" `;
            
            if(this.linestyle)
                res += ` style="${this.linestyle}"`;

            res += `></path>`;
        }

        res += `<path`;
        res += ` id="${id}" `;
        res += ` style="fill:none;stroke:none" `;
        
        let fontSize = 0;
        fontSize = this.labelstyle ? parseFontSize(this.labelstyle) : 0;
        if(this.type == "path")
        {
            
            res += ` d="${this.getSVGPath()}" `;
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

            if(this.text !== undefined)
                res += `${this.text}`;

            res += "</textPath>";
        }
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L991
        else
        {
            let pos = this.marker.getPosition(this.hadjust,this.vadjust,this.halign,this.valign);
            res += ` x="${(<Point>pos).x}" y="${(<Point>pos).y}" `;
            res += `>`;
            res += `${this.text !== undefined ? this.text : ""}`;
        }
        
        res +=  "</text></g>"

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
            this._Itext = node.attribs.text;
        }
        if(node.attribs.vadjust)
        {
            this._Ivadjust = node.attribs.vadjust;
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
            this._Ishowline = node.attribs.showline;
        }
        if(node.attribs.lineclass)
        {
            this._Ilineclass = node.attribs.lineclass;
        }
        if(node.attribs.linestyle)
        {
            this.linestyle = node.attribs.linestyle;
        }
    }

    public toCanvas(ctx : CanvasRenderingContext2D) : void
    {
        ctx;
        throw new Error("Illegal operation: <markerlabel>s cannot be drawn to HTML canvas");
    }

    public constructor(trackMarker : TrackMarker)
    {
        super();
        this.tagType = "markerlabel";
        this.marker = trackMarker;
        this.classList = new Array<string>();
    }

}
