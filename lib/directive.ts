export abstract class Directive
{
    public tagType : "plasmid" |
    "plasmidtrack" |
    "tracklabel" |
    "trackscale" |
    "trackmarker" |
    "markerlabel" | 
    "svgelement";

    protected _canDrawToCanvas = true;

    public get canDrawToCanvas() : boolean
    {
        return this._canDrawToCanvas;
    }

    public _batchedSVGPath : string;

    public abstract generateSVGPath() : string;
    public abstract generateSVGPathNumeric() : Array<number>;

    public abstract renderStart() : string;

    public abstract renderEnd() : string;

    public abstract getSVGPath() : string | undefined;

    public abstract interpolateAttributes() : void;

    public abstract toCanvas(ctx : CanvasRenderingContext2D) : void
    
}
