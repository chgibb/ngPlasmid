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

import {EventEmitter} from "events";

import {Directive, TagType} from "./directive";
import {plasmidToCanvas} from "./canvas/plasmid";
import {PlasmidTrack} from "./plasmidTrack";
import {interpolate} from "./interpolate";
import {GenericNode} from "./genericNode";
import {Point} from "./services/svg/point";
import {Dimensions} from "./services/svg/dimensions";

let performance : any = undefined;

try
{
    let perf_hooks = require("perf_hooks");
    performance = perf_hooks.performance;
}
catch(err)
{}

class Timer
{
    public startEpoch : number;

    public endEpoch : number | undefined;

    public constructor()
    {
        if(performance === undefined)
        {
            this.startEpoch = Date.now();
        }
        else
            this.startEpoch = performance.now();
    }

    public stop() : number
    {
        if(performance === undefined)
        {
            this.endEpoch = Date.now();
            return Math.abs((<any>new Date(this.endEpoch)) - (<any>new Date(this.startEpoch)));
        }
        else
        {
            this.endEpoch = performance.now();
            return this.endEpoch! - this.startEpoch;
        }
    }
}

export type RenderingStrategies = "normal";

class RenderingStrategy
{
    public render : (plasmid : Plasmid) => string;
    public runs : Array<number> = new Array<number>();

    public constructor(renderFunction : (plasmid : Plasmid) => string)
    {
        this.render = renderFunction;
    }
}

export interface AdaptiveRenderingUpdates
{
    on(event : "render",listener : (name : RenderingStrategies,time : number) => void) : this;
    on(event : "selectedStrategy",listener : (name : RenderingStrategies,averages : Array<{name:RenderingStrategies,avg:number}>) => void) : this;
}

class AdaptiveRenderingUpdater extends EventEmitter implements AdaptiveRenderingUpdates
{

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
    public _IplasmidHeight : string | undefined;

    /**
     * Height (in pixels) of the box that surrounds the plasmid
     * 
     * @type {number}
     * @memberof Plasmid
     */
    public plasmidheight : number | undefined;

    public _IplasmidWidth : string | undefined;

    /**
     * Width (in pixels) of the box that surrounds the plasmid
     * 
     * @type {number}
     * @memberof Plasmid
     */
    public plasmidwidth : number | undefined;

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
     * @type {Point}
     * @memberof Plasmid
     */
    public get center() : Point
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L76
        let d : Dimensions = this.dimensions;
        return {
            x : d.width / 2,
            y : d.height / 2
        };
    }

    /**
     * Returns {height,width} of the plasmid
     * 
     * @readonly
     * @type {Dimensions}
     * @memberof Plasmid
     */
    public get dimensions() : Dimensions
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L86
        return {
            height : this.plasmidheight ? this.plasmidheight : 0,
            width : this.plasmidwidth ? this.plasmidwidth : 0
        };
    }

    private _sequencelength : number;

    /**
     * Size, in nucleotides, of the plasmid represented.
     * If the sequence attribute is specified, sequencelength will not be used.
     * Rather, the length of the sequence will be calculated from the provided sequence
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

    private _plasmidclass : string | undefined;

    public get plasmidclass() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L104
        return this._plasmidclass ? this._plasmidclass : "";
    }
    public set plasmidclass(plasmidclass : string)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L104
        this._plasmidclass = plasmidclass;
    }

    private _plasmidtstyle : string | undefined;

    public get plasmidstyle() : string | undefined
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L109
        return this._plasmidtstyle;
    }
    public set plasmidstyle(plasmidstyle : string | undefined)
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L109
        this._plasmidtstyle = plasmidstyle;
    }
    
    public interpolateAttributes() : void
    {
        this.plasmidheight = parseFloat(interpolate(this._IplasmidHeight,this.$scope));
        this.plasmidwidth = parseFloat(interpolate(this._IplasmidWidth,this.$scope));
    }

    public changeRenderingStrategy(newStrategy : RenderingStrategies)
    {
        this.currentRenderingStrategy = newStrategy;
    }

    private currentRenderingStrategy : RenderingStrategies = "normal";

    private renderingStrategies : {
        [key : string] : RenderingStrategy
    } = <{
        [key : string] : RenderingStrategy
    }>{};

    private useAdaptiveRendering : boolean = false;

    public adaptIterations : number = 2;

    public enableAdaptiveRendering() : void
    {
        this.useAdaptiveRendering = true;
    }

    public disableAdaptiveRendering() : void
    {
        this.useAdaptiveRendering = false;
    }

    public renderStart() : string
    {
        if(!this.useAdaptiveRendering)
            return this.renderingStrategies[this.currentRenderingStrategy].render(this);
        
        else
        {
            for(let i in this.renderingStrategies)
            {
                if(this.renderingStrategies[i].runs.length != this.adaptIterations)
                {
                    let timer = new Timer();
                    let res = this.renderingStrategies[i].render(this);
                    let time = timer.stop();
                    this.adaptiveRenderingUpdates.emit("render",i,time);
                    this.renderingStrategies[i].runs.push(time);
                    return res;
                }
            }

            let averages = new Array<{name:RenderingStrategies,avg:number}>();
            for(let i in this.renderingStrategies)
            {
                let average = {
                    name : <RenderingStrategies>i,
                    avg : 0
                };

                for(let k = 0; k != this.renderingStrategies[i].runs.length; ++k)
                {
                    average.avg += this.renderingStrategies[i].runs[k];
                }

                average.avg = average.avg / this.renderingStrategies[i].runs.length;

                averages.push(average);
            }

            let smallest : {name:RenderingStrategies,time:number} | undefined = undefined;
            for(let i = 0; i != averages.length; ++i)
            {
                if(smallest == undefined)
                {
                    smallest = {
                        name : averages[i].name,
                        time : averages[i].avg
                    };
                }
                else
                {
                    if(averages[i].avg < smallest.time)
                    {
                        smallest = {
                            name : averages[i].name,
                            time : averages[i].avg
                        };
                    }
                }
            }
            this.disableAdaptiveRendering();
            this.changeRenderingStrategy(smallest!.name);
            this.adaptiveRenderingUpdates.emit("selectedStrategy",smallest!.name,averages);

            return this.renderingStrategies[this.currentRenderingStrategy].render(this);
        }
    }

    public renderEnd() : string
    {
        //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L60
        let res = "";
        for(let i = 0; i != this.tracks.length; ++i)
        {
            res += this.tracks[i].renderEnd();
        }
        res += "</svg>";
        return res;
    }

    public fromNode<T extends GenericNode<T>>(node : T) : void
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
            this._IplasmidHeight = node.attribs.plasmidheight;
        }
        if(node.attribs.plasmidwidth)
        {
            this._IplasmidWidth = node.attribs.plasmidwidth;
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

    public adaptiveRenderingUpdates : AdaptiveRenderingUpdater = new AdaptiveRenderingUpdater();

    public toCanvas(ctx : CanvasRenderingContext2D) : void
    {
        plasmidToCanvas(this,ctx);
    }

    public tagType : TagType;

    public constructor()
    {
        super();
        this.tagType = "plasmid";
        this._sequence = "";
        this._sequencelength = 0;

        this.tracks = new Array<PlasmidTrack>();
        this.renderingStrategies["normal"] = new RenderingStrategy(function(plasmid : Plasmid)
        {
            plasmid.interpolateAttributes();
            //https://github.com/vixis/angularplasmid/blob/master/src/js/directives.js#L60
            let res = "";

            res += "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" ";

            if(plasmid.sequencelength)
                res += `sequencelength="${plasmid.sequencelength}" `;

            if(plasmid.plasmidheight)
                res += `plasmidheight="${plasmid.plasmidheight}" `;
    
            if(plasmid.plasmidwidth)
                res += `plasmidwidth="${plasmid.plasmidwidth}" `;
    
            res += "class=\"ng-scope ng-isolate-scope\" ";

            if(plasmid.plasmidheight)
                res += `height="${plasmid.plasmidheight}" ` ;
    
            if(plasmid.plasmidwidth)
                res += `width="${plasmid.plasmidwidth}"`;

            res += ">";
            for(let i = 0; i != plasmid.tracks.length; ++i)
            {
                res += plasmid.tracks[i].renderStart();
            }
            return res;
        });
    }
}
