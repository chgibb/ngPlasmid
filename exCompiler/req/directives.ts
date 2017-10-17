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
    public width : number;
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
        else if (!node.attribs.width)
        {
            //https://github.com/chgibb/angularplasmid/blob/master/src/js/directives.js#L259
            this.width = 25;
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
    public start : number;
    public end : number;
    public vadjust : number;
    public wadjust : number;
    public markergroup : string;
    public markerstyle : string;
    public arrowstartlength : services.Arrow;
    public arrowstartwidth : services.Arrow;
    public arrowstartangle : services.Arrow;
    public arrowendlength : services.Arrow;
    public arrowendwidth : services.Arrow;
    public arrowendangle : services.Arrow;
    public track : PlasmidTrack;
    public labels : Array<TrackLabel>;

    public renderStart() : string
    {
        return ``;
    }
    public renderEnd() : string
    {
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
            this.arrowstartlength = <services.Arrow>{
                length : parseInt(node.attribs.arrowstartlength)
            }
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
    public sequencelength : number;
    public plasmidheight : number;
    public plasmidwidth : number;
    public sequence : string;
    public plasmidclass : string;
    public plasmidstyle : string;

    public tracks : Array<PlasmidTrack>;

    public get dimensions() : services.Dimensions
    {
        return {
            height : this.plasmidheight,
            width : this.plasmidwidth
        }
    }

    public get center() : services.Point
    {
        let d : services.Dimensions = this.dimensions;
        return {
            x : d.width / 2,
            y : d.height / 2
        }
    }

    public renderStart() : string
    {
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
