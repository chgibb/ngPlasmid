/*
    protobufjs generates .js as well as corresponding .d.ts files for proto files.
    Unfortunately the .js generated is commonjs only and does not play very well with Rollupjs.
    This file was created by pasting method implementations from the generated .js file into the .d.ts.
    Some type massaging was required to get it to typecheck. If node.proto is updated and protobufjs is re-ran,
    this will have to be reconstructed by hand.
*/

/// <reference types="node" />

const $protobuf = require("protobufjs");

let $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root());

// Common aliases
let $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

/** Properties of a Node. */
export interface INode {
    [key : string] : (string | null | undefined) | { [k : string] : any };
    /** Node name. Should be the name of the directive this Node represents */
    name: string | undefined;

    /** For compatibility with the existing HTML to Directive conversion, should be "node" */
    type: string | undefined;

    /** Attribute pack */
    attribs: IAttributes | undefined;

    /** Top-level nested children */
    children?: (INode[] | null);
}

/** Represent a node in the directive hierarchy */
export class Node implements INode 
{
    [key : string] : (string | null | undefined) | { [k : string] : any };
    /**
     * Constructs a new Node.
     * @param [properties] Properties to set
     */
    constructor(properties?: INode) 
    {
        this.children = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /** Node name. Should be the name of the directive this Node represents */
    public name: string | undefined;

    /** For compatibility with the existing HTML to Directive conversion, should be "node" */
    public type: string | undefined;

    /** Attribute pack */
    public attribs: IAttributes | undefined;

    /** Top-level nested children */
    public children: INode[];

    /**
     * Creates a new Node instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Node instance
     */
    public static create(properties?: INode): Node 
    {
        return new Node(properties);
    }

    /**
     * Encodes the specified Node message. Does not implicitly {@link Node.verify|verify} messages.
     * @param message Node message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: INode, writer?: any): any 
    {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.type);
        Attributes.encode(message.attribs, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.children != null && message.children.length)
            for (var i = 0; i < message.children.length; ++i)
                Node.encode(message.children[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        return writer;
    }

    /**
     * Encodes the specified Node message, length delimited. Does not implicitly {@link Node.verify|verify} messages.
     * @param message Node message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: INode, writer?: any): any 
    {
        return this.encode(message, writer).ldelim();
    }

    /**
     * Decodes a Node message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Node
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (any | Uint8Array), length?: number): Node 
    {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new Node();
        while (reader.pos < end) 
        {
            var tag = reader.uint32();
            switch (tag >>> 3) 
            {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                message.type = reader.string();
                break;
            case 3:
                message.attribs = Attributes.decode(reader, reader.uint32());
                break;
            case 4:
                if (!(message.children && message.children.length))
                    message.children = [];
                message.children.push(Node.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("name"))
            throw new $util.ProtocolError("missing required 'name'", {instance: message});
        if (!message.hasOwnProperty("type"))
            throw new $util.ProtocolError("missing required 'type'", {instance: message});
        if (!message.hasOwnProperty("attribs"))
            throw new $util.ProtocolError("missing required 'attribs'", {instance: message});
        return message;
    }

    /**
     * Decodes a Node message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Node
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (any | Uint8Array)): Node 
    {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    }

    /**
     * Verifies a Node message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string | null) 
    {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.name))
            return "name: string expected";
        if (!$util.isString(message.type))
            return "type: string expected";
        {
            var error = Attributes.verify(message.attribs);
            if (error)
                return "attribs." + error;
        }
        if (message.children != null && message.hasOwnProperty("children")) 
        {
            if (!Array.isArray(message.children))
                return "children: array expected";
            for (var i = 0; i < message.children.length; ++i) 
            {
                var error = Node.verify(message.children[i]);
                if (error)
                    return "children." + error;
            }
        }
        return null;
    }

    /**
     * Creates a Node message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Node
     */
    public static fromObject(object: { [k: string]: any }): Node 
    {
        if (object instanceof Node)
            return object;
        var message = new Node();
        if (object.name != null)
            message.name = String(object.name);
        if (object.type != null)
            message.type = String(object.type);
        if (object.attribs != null) 
        {
            if (typeof object.attribs !== "object")
                throw TypeError(".Node.attribs: object expected");
            message.attribs = Attributes.fromObject(object.attribs);
        }
        if (object.children) 
        {
            if (!Array.isArray(object.children))
                throw TypeError(".Node.children: array expected");
            message.children = [];
            for (var i = 0; i < object.children.length; ++i) 
            {
                if (typeof object.children[i] !== "object")
                    throw TypeError(".Node.children: object expected");
                message.children[i] = Node.fromObject(object.children[i]);
            }
        }
        return message;
    }

    /**
     * Creates a plain object from a Node message. Also converts values to other types if specified.
     * @param message Node
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Node, options?: any): { [k: string]: any } 
    {
        if (!options)
            options = {};
        let object: Node = (<any>{});
        if (options.arrays || options.defaults)
            object.children = [];
        if (options.defaults) 
        {
            object.name = "";
            object.type = "";
            object.attribs = (<any>null);
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = message.type;
        if (message.attribs != null && message.hasOwnProperty("attribs"))
            object.attribs = Attributes.toObject((<any>message).attribs, options);
        if (message.children && message.children.length) 
        {
            object.children = [];
            for (var j = 0; j < message.children.length; ++j)
                object.children[j] = (<any>Node.toObject((<any>message).children[j], options));
        }
        return object;
    }

    /**
     * Converts this Node to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any } 
    {
        return Node.toObject(this, $protobuf.util.toJSONOptions);
    }
}

/** Properties of an Attributes. */
export interface IAttributes {
    [key : string] : (string | null | undefined) | { [k : string] : any };
    /** Height (in pixels) of the box that surrounds the plasmid */
    plasmidheight?: (string | null);

    /** Width (in pixels) of the box that surrounds the plasmid */
    plasmidwidth?: (string | null);

    /**
     * Size, in nucleotides, of the plasmid represented.
     * If the sequence attribute is specified, sequencelength will not be used.
     * Rather, the length of the sequence will be calcaulated from the provided sequence
     */
    sequencelength?: (string | null);

    /** Series of nucleotides (ex. 'ATTACGATG') that represents the plasmid to be drawn */
    sequence?: (string | null);

    /**
     * The radius (in pixels) of the track.
     * The radius is inherited by any component that is declared within this plasmidtrack.
     * Defaults to 100 if nothing provided
     */
    radius?: (string | null);

    /**
     * The thickness (in pixels) of the plasmid ring.
     * Defaults to 25 if nothing provided
     */
    width?: (string | null);

    /** Attributes trackstyle */
    trackstyle?: (string | null);

    /** Text of the label to draw */
    text?: (string | null);

    /**
     * Vertical offset of the label from the center of the track.
     * A positive number means that the label will be drawn further down,
     * while a negative number will make the label be drawn further up
     */
    vadjust?: (string | null);

    /**
     * Horizontal offset of the label from the center of the track.
     * A positive number means that the label will be drawn closer to the right,
     * while a negative number means the label will be be drawn closer to the left
     */
    hadjust?: (string | null);

    /** Indicate the style of the labels directly using this property */
    labelstyle?: (string | null);

    /**
     * How often a tick mark should be placed.
     * The interval is used along with the plasmid's sequence length to determine how many tick marks to show
     */
    interval?: (string | null);

    /**
     * Vertical size of the tick marks.
     * If negative, the ticks grow inward.
     * The width of the tickmarks can be styled using the CSS stroke-width property
     */
    ticksize?: (string | null);

    /** Determine which side of the track the ticks and labels should appear */
    direction?: (string | null);

    /** Attributes style */
    style?: (string | null);

    /** Determines if labels will be shown or not */
    showlabels?: (string | null);

    /** Distance of the labels to their respective tick marks */
    labelvadjust?: (string | null);

    /** Provide a class name to style the labels */
    labelclass?: (string | null);

    /** Starting position of the marker in relation to the plasmid's sequence */
    start?: (string | null);

    /** Ending position of the marker in relation to the plasmid's sequence */
    end?: (string | null);

    /** Attributes markerstyle */
    markerstyle?: (string | null);

    /**
     * Offset width of the marker in relation the track's width.
     * A negative number will make the marker thinner than the track,
     * while a positive number will make it thicker.
     * A value of 0 means the marker will be the same width of the track
     */
    wadjust?: (string | null);

    /** Label a group of markers by giving them a unique name using this property */
    markergroup?: (string | null);

    /** The length, width, and angle of a the starting arrow head can be specified here */
    arrowstartlength?: (string | null);

    /** The length, width, and angle of a the starting arrow head can be specified here */
    arrowstartwidth?: (string | null);

    /** The length, width, and angle of a the starting arrow head can be specified here */
    arrowstartangle?: (string | null);

    /** The length, width, and angle of a the ending arrow head can be specified here */
    arrowendlength?: (string | null);

    /** The length, width, and angle of a the ending arrow head can be specified here */
    arrowendwidth?: (string | null);

    /** The length, width, and angle of a the ending arrow head can be specified here */
    arrowendangle?: (string | null);

    /**
     * Used to indicate a call-back when a marker is clicked.
     * The call-back should be defined on the controller scope that contains the plasmid
     */
    markerclick?: (string | null);

    /** Vertical alignment of the label with the marker */
    valign?: (string | null);

    /** Horizontal alignment of the label with the marker */
    halign?: (string | null);

    /** Labels can either be drawn normally, or can follow the circular path of the marker */
    type?: (string | null);

    /**
     * Determines if line will be drawn from the label to the marker.
     * By default, the line connects the middle of the label with the middle of the marker
     */
    showline?: (string | null);

    /** Style of the line going from the label to the marker */
    linestyle?: (string | null);

    /** Class name of the line going from the label to the marker */
    lineclass?: (string | null);

    /** Vertical adjustment of the line to the label */
    linevadjust?: (string | null);

    /**
     * Used to indicate a call-back when a label is clicked.
     * The call-back should be defined on the controller scope that contains the plasmid
     */
    labelclick?: (string | null);

    /** Attributes class */
    "class"?: (string | null);

    /** Attributes markerclass */
    markerclass?: (string | null);
}

/** All possible attributes of a Node */
export class Attributes implements IAttributes 
{
    [key : string] : (string | null | undefined) | { [k : string] : any };
    /**
     * Constructs a new Attributes.
     * @param [properties] Properties to set
     */
    constructor(properties?: IAttributes) 
    {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /** Height (in pixels) of the box that surrounds the plasmid */
    public plasmidheight: string | undefined;

    /** Width (in pixels) of the box that surrounds the plasmid */
    public plasmidwidth: string | undefined;

    /**
     * Size, in nucleotides, of the plasmid represented.
     * If the sequence attribute is specified, sequencelength will not be used.
     * Rather, the length of the sequence will be calcaulated from the provided sequence
     */
    public sequencelength: string | undefined;

    /** Series of nucleotides (ex. 'ATTACGATG') that represents the plasmid to be drawn */
    public sequence: string | undefined;

    /**
     * The radius (in pixels) of the track.
     * The radius is inherited by any component that is declared within this plasmidtrack.
     * Defaults to 100 if nothing provided
     */
    public radius: string | undefined;

    /**
     * The thickness (in pixels) of the plasmid ring.
     * Defaults to 25 if nothing provided
     */
    public width: string | undefined;

    /** Attributes trackstyle. */
    public trackstyle: string | undefined;

    /** Text of the label to draw */
    public text: string | undefined;

    /**
     * Vertical offset of the label from the center of the track.
     * A positive number means that the label will be drawn further down,
     * while a negative number will make the label be drawn further up
     */
    public vadjust: string | undefined;

    /**
     * Horizontal offset of the label from the center of the track.
     * A positive number means that the label will be drawn closer to the right,
     * while a negative number means the label will be be drawn closer to the left
     */
    public hadjust: string | undefined;

    /** Indicate the style of the labels directly using this property */
    public labelstyle: string | undefined;

    /**
     * How often a tick mark should be placed.
     * The interval is used along with the plasmid's sequence length to determine how many tick marks to show
     */
    public interval: string | undefined;

    /**
     * Vertical size of the tick marks.
     * If negative, the ticks grow inward.
     * The width of the tickmarks can be styled using the CSS stroke-width property
     */
    public ticksize: string | undefined;

    /** Determine which side of the track the ticks and labels should appear */
    public direction: string | undefined;

    /** Attributes style. */
    public style: string | undefined;

    /** Determines if labels will be shown or not */
    public showlabels: string | undefined;

    /** Distance of the labels to their respective tick marks */
    public labelvadjust: string | undefined;

    /** Provide a class name to style the labels */
    public labelclass: string | undefined;

    /** Starting position of the marker in relation to the plasmid's sequence */
    public start: string | undefined;

    /** Ending position of the marker in relation to the plasmid's sequence */
    public end: string | undefined;

    /** Attributes markerstyle. */
    public markerstyle: string | undefined;

    /**
     * Offset width of the marker in relation the track's width.
     * A negative number will make the marker thinner than the track,
     * while a positive number will make it thicker.
     * A value of 0 means the marker will be the same width of the track
     */
    public wadjust: string | undefined;

    /** Label a group of markers by giving them a unique name using this property */
    public markergroup: string | undefined;

    /** The length, width, and angle of a the starting arrow head can be specified here */
    public arrowstartlength: string | undefined;

    /** The length, width, and angle of a the starting arrow head can be specified here */
    public arrowstartwidth: string | undefined;

    /** The length, width, and angle of a the starting arrow head can be specified here */
    public arrowstartangle: string | undefined;

    /** The length, width, and angle of a the ending arrow head can be specified here */
    public arrowendlength: string | undefined;

    /** The length, width, and angle of a the ending arrow head can be specified here */
    public arrowendwidth: string | undefined;

    /** The length, width, and angle of a the ending arrow head can be specified here */
    public arrowendangle: string | undefined;

    /**
     * Used to indicate a call-back when a marker is clicked.
     * The call-back should be defined on the controller scope that contains the plasmid
     */
    public markerclick: string | undefined;

    /** Vertical alignment of the label with the marker */
    public valign: string | undefined;

    /** Horizontal alignment of the label with the marker */
    public halign: string | undefined;

    /** Labels can either be drawn normally, or can follow the circular path of the marker */
    public type: string | undefined;

    /**
     * Determines if line will be drawn from the label to the marker.
     * By default, the line connects the middle of the label with the middle of the marker
     */
    public showline: string | undefined;

    /** Style of the line going from the label to the marker */
    public linestyle: string | undefined;

    /** Class name of the line going from the label to the marker */
    public lineclass: string | undefined;

    /** Vertical adjustment of the line to the label */
    public linevadjust: string | undefined;

    /**
     * Used to indicate a call-back when a label is clicked.
     * The call-back should be defined on the controller scope that contains the plasmid
     */
    public labelclick: string | undefined;

    /** Attributes class. */
    public class: string | undefined;

    /** Attributes markerclass. */
    public markerclass: string | undefined;

    /**
     * Creates a new Attributes instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Attributes instance
     */
    public static create(properties?: IAttributes): Attributes 
    {
        return new Attributes(properties);
    }

    /**
     * Encodes the specified Attributes message. Does not implicitly {@link Attributes.verify|verify} messages.
     * @param message Attributes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IAttributes | undefined, writer?: any): any 
    {
        if (!writer)
            writer = $Writer.create();
        if (message!.plasmidheight != null && message!.hasOwnProperty("plasmidheight"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message!.plasmidheight);
        if (message!.plasmidwidth != null && message!.hasOwnProperty("plasmidwidth"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message!.plasmidwidth);
        if (message!.sequencelength != null && message!.hasOwnProperty("sequencelength"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message!.sequencelength);
        if (message!.sequence != null && message!.hasOwnProperty("sequence"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message!.sequence);
        if (message!.radius != null && message!.hasOwnProperty("radius"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message!.radius);
        if (message!.width != null && message!.hasOwnProperty("width"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message!.width);
        if (message!.trackstyle != null && message!.hasOwnProperty("trackstyle"))
            writer.uint32(/* id 7, wireType 2 =*/58).string(message!.trackstyle);
        if (message!.text != null && message!.hasOwnProperty("text"))
            writer.uint32(/* id 8, wireType 2 =*/66).string(message!.text);
        if (message!.vadjust != null && message!.hasOwnProperty("vadjust"))
            writer.uint32(/* id 9, wireType 2 =*/74).string(message!.vadjust);
        if (message!.hadjust != null && message!.hasOwnProperty("hadjust"))
            writer.uint32(/* id 10, wireType 2 =*/82).string(message!.hadjust);
        if (message!.labelstyle != null && message!.hasOwnProperty("labelstyle"))
            writer.uint32(/* id 11, wireType 2 =*/90).string(message!.labelstyle);
        if (message!.interval != null && message!.hasOwnProperty("interval"))
            writer.uint32(/* id 12, wireType 2 =*/98).string(message!.interval);
        if (message!.ticksize != null && message!.hasOwnProperty("ticksize"))
            writer.uint32(/* id 13, wireType 2 =*/106).string(message!.ticksize);
        if (message!.direction != null && message!.hasOwnProperty("direction"))
            writer.uint32(/* id 14, wireType 2 =*/114).string(message!.direction);
        if (message!.style != null && message!.hasOwnProperty("style"))
            writer.uint32(/* id 15, wireType 2 =*/122).string(message!.style);
        if (message!.showlabels != null && message!.hasOwnProperty("showlabels"))
            writer.uint32(/* id 16, wireType 2 =*/130).string(message!.showlabels);
        if (message!.labelvadjust != null && message!.hasOwnProperty("labelvadjust"))
            writer.uint32(/* id 17, wireType 2 =*/138).string(message!.labelvadjust);
        if (message!.labelclass != null && message!.hasOwnProperty("labelclass"))
            writer.uint32(/* id 18, wireType 2 =*/146).string(message!.labelclass);
        if (message!.start != null && message!.hasOwnProperty("start"))
            writer.uint32(/* id 19, wireType 2 =*/154).string(message!.start);
        if (message!.end != null && message!.hasOwnProperty("end"))
            writer.uint32(/* id 20, wireType 2 =*/162).string(message!.end);
        if (message!.markerstyle != null && message!.hasOwnProperty("markerstyle"))
            writer.uint32(/* id 21, wireType 2 =*/170).string(message!.markerstyle);
        if (message!.wadjust != null && message!.hasOwnProperty("wadjust"))
            writer.uint32(/* id 22, wireType 2 =*/178).string(message!.wadjust);
        if (message!.markergroup != null && message!.hasOwnProperty("markergroup"))
            writer.uint32(/* id 23, wireType 2 =*/186).string(message!.markergroup);
        if (message!.arrowstartlength != null && message!.hasOwnProperty("arrowstartlength"))
            writer.uint32(/* id 24, wireType 2 =*/194).string(message!.arrowstartlength);
        if (message!.arrowstartwidth != null && message!.hasOwnProperty("arrowstartwidth"))
            writer.uint32(/* id 25, wireType 2 =*/202).string(message!.arrowstartwidth);
        if (message!.arrowstartangle != null && message!.hasOwnProperty("arrowstartangle"))
            writer.uint32(/* id 26, wireType 2 =*/210).string(message!.arrowstartangle);
        if (message!.arrowendlength != null && message!.hasOwnProperty("arrowendlength"))
            writer.uint32(/* id 27, wireType 2 =*/218).string(message!.arrowendlength);
        if (message!.arrowendwidth != null && message!.hasOwnProperty("arrowendwidth"))
            writer.uint32(/* id 28, wireType 2 =*/226).string(message!.arrowendwidth);
        if (message!.arrowendangle != null && message!.hasOwnProperty("arrowendangle"))
            writer.uint32(/* id 29, wireType 2 =*/234).string(message!.arrowendangle);
        if (message!.markerclick != null && message!.hasOwnProperty("markerclick"))
            writer.uint32(/* id 30, wireType 2 =*/242).string(message!.markerclick);
        if (message!.valign != null && message!.hasOwnProperty("valign"))
            writer.uint32(/* id 31, wireType 2 =*/250).string(message!.valign);
        if (message!.halign != null && message!.hasOwnProperty("halign"))
            writer.uint32(/* id 32, wireType 2 =*/258).string(message!.halign);
        if (message!.type != null && message!.hasOwnProperty("type"))
            writer.uint32(/* id 33, wireType 2 =*/266).string(message!.type);
        if (message!.showline != null && message!.hasOwnProperty("showline"))
            writer.uint32(/* id 34, wireType 2 =*/274).string(message!.showline);
        if (message!.linestyle != null && message!.hasOwnProperty("linestyle"))
            writer.uint32(/* id 35, wireType 2 =*/282).string(message!.linestyle);
        if (message!.lineclass != null && message!.hasOwnProperty("lineclass"))
            writer.uint32(/* id 36, wireType 2 =*/290).string(message!.lineclass);
        if (message!.linevadjust != null && message!.hasOwnProperty("linevadjust"))
            writer.uint32(/* id 37, wireType 2 =*/298).string(message!.linevadjust);
        if (message!.labelclick != null && message!.hasOwnProperty("labelclick"))
            writer.uint32(/* id 38, wireType 2 =*/306).string(message!.labelclick);
        if (message!["class"] != null && message!.hasOwnProperty("class"))
            writer.uint32(/* id 39, wireType 2 =*/314).string((<any>message!["class"]));
        if (message!.markerclass != null && message!.hasOwnProperty("markerclass"))
            writer.uint32(/* id 40, wireType 2 =*/322).string(message!.markerclass);
        return writer;
    }

    /**
     * Encodes the specified Attributes message, length delimited. Does not implicitly {@link Attributes.verify|verify} messages.
     * @param message Attributes message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IAttributes, writer?: any): any 
    {
        return this.encode(message, writer).ldelim();
    }

    /**
     * Decodes an Attributes message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Attributes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: (any | Uint8Array), length?: number): Attributes 
    {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new Attributes();
        while (reader.pos < end) 
        {
            var tag = reader.uint32();
            switch (tag >>> 3) 
            {
            case 1:
                message.plasmidheight = reader.string();
                break;
            case 2:
                message.plasmidwidth = reader.string();
                break;
            case 3:
                message.sequencelength = reader.string();
                break;
            case 4:
                message.sequence = reader.string();
                break;
            case 5:
                message.radius = reader.string();
                break;
            case 6:
                message.width = reader.string();
                break;
            case 7:
                message.trackstyle = reader.string();
                break;
            case 8:
                message.text = reader.string();
                break;
            case 9:
                message.vadjust = reader.string();
                break;
            case 10:
                message.hadjust = reader.string();
                break;
            case 11:
                message.labelstyle = reader.string();
                break;
            case 12:
                message.interval = reader.string();
                break;
            case 13:
                message.ticksize = reader.string();
                break;
            case 14:
                message.direction = reader.string();
                break;
            case 15:
                message.style = reader.string();
                break;
            case 16:
                message.showlabels = reader.string();
                break;
            case 17:
                message.labelvadjust = reader.string();
                break;
            case 18:
                message.labelclass = reader.string();
                break;
            case 19:
                message.start = reader.string();
                break;
            case 20:
                message.end = reader.string();
                break;
            case 21:
                message.markerstyle = reader.string();
                break;
            case 22:
                message.wadjust = reader.string();
                break;
            case 23:
                message.markergroup = reader.string();
                break;
            case 24:
                message.arrowstartlength = reader.string();
                break;
            case 25:
                message.arrowstartwidth = reader.string();
                break;
            case 26:
                message.arrowstartangle = reader.string();
                break;
            case 27:
                message.arrowendlength = reader.string();
                break;
            case 28:
                message.arrowendwidth = reader.string();
                break;
            case 29:
                message.arrowendangle = reader.string();
                break;
            case 30:
                message.markerclick = reader.string();
                break;
            case 31:
                message.valign = reader.string();
                break;
            case 32:
                message.halign = reader.string();
                break;
            case 33:
                message.type = reader.string();
                break;
            case 34:
                message.showline = reader.string();
                break;
            case 35:
                message.linestyle = reader.string();
                break;
            case 36:
                message.lineclass = reader.string();
                break;
            case 37:
                message.linevadjust = reader.string();
                break;
            case 38:
                message.labelclick = reader.string();
                break;
            case 39:
                message["class"] = reader.string();
                break;
            case 40:
                message.markerclass = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    }

    /**
     * Decodes an Attributes message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Attributes
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: (any | Uint8Array)): Attributes 
    {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    }

    /**
     * Verifies an Attributes message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string | null) 
    {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.plasmidheight != null && message.hasOwnProperty("plasmidheight"))
            if (!$util.isString(message.plasmidheight))
                return "plasmidheight: string expected";
        if (message.plasmidwidth != null && message.hasOwnProperty("plasmidwidth"))
            if (!$util.isString(message.plasmidwidth))
                return "plasmidwidth: string expected";
        if (message.sequencelength != null && message.hasOwnProperty("sequencelength"))
            if (!$util.isString(message.sequencelength))
                return "sequencelength: string expected";
        if (message.sequence != null && message.hasOwnProperty("sequence"))
            if (!$util.isString(message.sequence))
                return "sequence: string expected";
        if (message.radius != null && message.hasOwnProperty("radius"))
            if (!$util.isString(message.radius))
                return "radius: string expected";
        if (message.width != null && message.hasOwnProperty("width"))
            if (!$util.isString(message.width))
                return "width: string expected";
        if (message.trackstyle != null && message.hasOwnProperty("trackstyle"))
            if (!$util.isString(message.trackstyle))
                return "trackstyle: string expected";
        if (message.text != null && message.hasOwnProperty("text"))
            if (!$util.isString(message.text))
                return "text: string expected";
        if (message.vadjust != null && message.hasOwnProperty("vadjust"))
            if (!$util.isString(message.vadjust))
                return "vadjust: string expected";
        if (message.hadjust != null && message.hasOwnProperty("hadjust"))
            if (!$util.isString(message.hadjust))
                return "hadjust: string expected";
        if (message.labelstyle != null && message.hasOwnProperty("labelstyle"))
            if (!$util.isString(message.labelstyle))
                return "labelstyle: string expected";
        if (message.interval != null && message.hasOwnProperty("interval"))
            if (!$util.isString(message.interval))
                return "interval: string expected";
        if (message.ticksize != null && message.hasOwnProperty("ticksize"))
            if (!$util.isString(message.ticksize))
                return "ticksize: string expected";
        if (message.direction != null && message.hasOwnProperty("direction"))
            if (!$util.isString(message.direction))
                return "direction: string expected";
        if (message.style != null && message.hasOwnProperty("style"))
            if (!$util.isString(message.style))
                return "style: string expected";
        if (message.showlabels != null && message.hasOwnProperty("showlabels"))
            if (!$util.isString(message.showlabels))
                return "showlabels: string expected";
        if (message.labelvadjust != null && message.hasOwnProperty("labelvadjust"))
            if (!$util.isString(message.labelvadjust))
                return "labelvadjust: string expected";
        if (message.labelclass != null && message.hasOwnProperty("labelclass"))
            if (!$util.isString(message.labelclass))
                return "labelclass: string expected";
        if (message.start != null && message.hasOwnProperty("start"))
            if (!$util.isString(message.start))
                return "start: string expected";
        if (message.end != null && message.hasOwnProperty("end"))
            if (!$util.isString(message.end))
                return "end: string expected";
        if (message.markerstyle != null && message.hasOwnProperty("markerstyle"))
            if (!$util.isString(message.markerstyle))
                return "markerstyle: string expected";
        if (message.wadjust != null && message.hasOwnProperty("wadjust"))
            if (!$util.isString(message.wadjust))
                return "wadjust: string expected";
        if (message.markergroup != null && message.hasOwnProperty("markergroup"))
            if (!$util.isString(message.markergroup))
                return "markergroup: string expected";
        if (message.arrowstartlength != null && message.hasOwnProperty("arrowstartlength"))
            if (!$util.isString(message.arrowstartlength))
                return "arrowstartlength: string expected";
        if (message.arrowstartwidth != null && message.hasOwnProperty("arrowstartwidth"))
            if (!$util.isString(message.arrowstartwidth))
                return "arrowstartwidth: string expected";
        if (message.arrowstartangle != null && message.hasOwnProperty("arrowstartangle"))
            if (!$util.isString(message.arrowstartangle))
                return "arrowstartangle: string expected";
        if (message.arrowendlength != null && message.hasOwnProperty("arrowendlength"))
            if (!$util.isString(message.arrowendlength))
                return "arrowendlength: string expected";
        if (message.arrowendwidth != null && message.hasOwnProperty("arrowendwidth"))
            if (!$util.isString(message.arrowendwidth))
                return "arrowendwidth: string expected";
        if (message.arrowendangle != null && message.hasOwnProperty("arrowendangle"))
            if (!$util.isString(message.arrowendangle))
                return "arrowendangle: string expected";
        if (message.markerclick != null && message.hasOwnProperty("markerclick"))
            if (!$util.isString(message.markerclick))
                return "markerclick: string expected";
        if (message.valign != null && message.hasOwnProperty("valign"))
            if (!$util.isString(message.valign))
                return "valign: string expected";
        if (message.halign != null && message.hasOwnProperty("halign"))
            if (!$util.isString(message.halign))
                return "halign: string expected";
        if (message.type != null && message.hasOwnProperty("type"))
            if (!$util.isString(message.type))
                return "type: string expected";
        if (message.showline != null && message.hasOwnProperty("showline"))
            if (!$util.isString(message.showline))
                return "showline: string expected";
        if (message.linestyle != null && message.hasOwnProperty("linestyle"))
            if (!$util.isString(message.linestyle))
                return "linestyle: string expected";
        if (message.lineclass != null && message.hasOwnProperty("lineclass"))
            if (!$util.isString(message.lineclass))
                return "lineclass: string expected";
        if (message.linevadjust != null && message.hasOwnProperty("linevadjust"))
            if (!$util.isString(message.linevadjust))
                return "linevadjust: string expected";
        if (message.labelclick != null && message.hasOwnProperty("labelclick"))
            if (!$util.isString(message.labelclick))
                return "labelclick: string expected";
        if (message["class"] != null && message.hasOwnProperty("class"))
            if (!$util.isString(message["class"]))
                return "class: string expected";
        if (message.markerclass != null && message.hasOwnProperty("markerclass"))
            if (!$util.isString(message.markerclass))
                return "markerclass: string expected";
        return null;
    }

    /**
     * Creates an Attributes message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Attributes
     */
    public static fromObject(object: { [k: string]: any }): Attributes 
    {
        if (object instanceof Attributes)
            return object;
        var message = new Attributes();
        if (object.plasmidheight != null)
            message.plasmidheight = String(object.plasmidheight);
        if (object.plasmidwidth != null)
            message.plasmidwidth = String(object.plasmidwidth);
        if (object.sequencelength != null)
            message.sequencelength = String(object.sequencelength);
        if (object.sequence != null)
            message.sequence = String(object.sequence);
        if (object.radius != null)
            message.radius = String(object.radius);
        if (object.width != null)
            message.width = String(object.width);
        if (object.trackstyle != null)
            message.trackstyle = String(object.trackstyle);
        if (object.text != null)
            message.text = String(object.text);
        if (object.vadjust != null)
            message.vadjust = String(object.vadjust);
        if (object.hadjust != null)
            message.hadjust = String(object.hadjust);
        if (object.labelstyle != null)
            message.labelstyle = String(object.labelstyle);
        if (object.interval != null)
            message.interval = String(object.interval);
        if (object.ticksize != null)
            message.ticksize = String(object.ticksize);
        if (object.direction != null)
            message.direction = String(object.direction);
        if (object.style != null)
            message.style = String(object.style);
        if (object.showlabels != null)
            message.showlabels = String(object.showlabels);
        if (object.labelvadjust != null)
            message.labelvadjust = String(object.labelvadjust);
        if (object.labelclass != null)
            message.labelclass = String(object.labelclass);
        if (object.start != null)
            message.start = String(object.start);
        if (object.end != null)
            message.end = String(object.end);
        if (object.markerstyle != null)
            message.markerstyle = String(object.markerstyle);
        if (object.wadjust != null)
            message.wadjust = String(object.wadjust);
        if (object.markergroup != null)
            message.markergroup = String(object.markergroup);
        if (object.arrowstartlength != null)
            message.arrowstartlength = String(object.arrowstartlength);
        if (object.arrowstartwidth != null)
            message.arrowstartwidth = String(object.arrowstartwidth);
        if (object.arrowstartangle != null)
            message.arrowstartangle = String(object.arrowstartangle);
        if (object.arrowendlength != null)
            message.arrowendlength = String(object.arrowendlength);
        if (object.arrowendwidth != null)
            message.arrowendwidth = String(object.arrowendwidth);
        if (object.arrowendangle != null)
            message.arrowendangle = String(object.arrowendangle);
        if (object.markerclick != null)
            message.markerclick = String(object.markerclick);
        if (object.valign != null)
            message.valign = String(object.valign);
        if (object.halign != null)
            message.halign = String(object.halign);
        if (object.type != null)
            message.type = String(object.type);
        if (object.showline != null)
            message.showline = String(object.showline);
        if (object.linestyle != null)
            message.linestyle = String(object.linestyle);
        if (object.lineclass != null)
            message.lineclass = String(object.lineclass);
        if (object.linevadjust != null)
            message.linevadjust = String(object.linevadjust);
        if (object.labelclick != null)
            message.labelclick = String(object.labelclick);
        if (object["class"] != null)
            message["class"] = String(object["class"]);
        if (object.markerclass != null)
            message.markerclass = String(object.markerclass);
        return message;
    }

    /**
     * Creates a plain object from an Attributes message. Also converts values to other types if specified.
     * @param message Attributes
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Attributes, options?: any): { [k: string]: any } 
    {
        if (!options)
            options = {};
        let object: Attributes = (<any>{});
        if (options.defaults) 
        {
            object.plasmidheight = "";
            object.plasmidwidth = "";
            object.sequencelength = "";
            object.sequence = "";
            object.radius = "";
            object.width = "";
            object.trackstyle = "";
            object.text = "";
            object.vadjust = "";
            object.hadjust = "";
            object.labelstyle = "";
            object.interval = "";
            object.ticksize = "";
            object.direction = "";
            object.style = "";
            object.showlabels = "";
            object.labelvadjust = "";
            object.labelclass = "";
            object.start = "";
            object.end = "";
            object.markerstyle = "";
            object.wadjust = "";
            object.markergroup = "";
            object.arrowstartlength = "";
            object.arrowstartwidth = "";
            object.arrowstartangle = "";
            object.arrowendlength = "";
            object.arrowendwidth = "";
            object.arrowendangle = "";
            object.markerclick = "";
            object.valign = "";
            object.halign = "";
            object.type = "";
            object.showline = "";
            object.linestyle = "";
            object.lineclass = "";
            object.linevadjust = "";
            object.labelclick = "";
            object["class"] = "";
            object.markerclass = "";
        }
        if (message.plasmidheight != null && message.hasOwnProperty("plasmidheight"))
            object.plasmidheight = message.plasmidheight;
        if (message.plasmidwidth != null && message.hasOwnProperty("plasmidwidth"))
            object.plasmidwidth = message.plasmidwidth;
        if (message.sequencelength != null && message.hasOwnProperty("sequencelength"))
            object.sequencelength = message.sequencelength;
        if (message.sequence != null && message.hasOwnProperty("sequence"))
            object.sequence = message.sequence;
        if (message.radius != null && message.hasOwnProperty("radius"))
            object.radius = message.radius;
        if (message.width != null && message.hasOwnProperty("width"))
            object.width = message.width;
        if (message.trackstyle != null && message.hasOwnProperty("trackstyle"))
            object.trackstyle = message.trackstyle;
        if (message.text != null && message.hasOwnProperty("text"))
            object.text = message.text;
        if (message.vadjust != null && message.hasOwnProperty("vadjust"))
            object.vadjust = message.vadjust;
        if (message.hadjust != null && message.hasOwnProperty("hadjust"))
            object.hadjust = message.hadjust;
        if (message.labelstyle != null && message.hasOwnProperty("labelstyle"))
            object.labelstyle = message.labelstyle;
        if (message.interval != null && message.hasOwnProperty("interval"))
            object.interval = message.interval;
        if (message.ticksize != null && message.hasOwnProperty("ticksize"))
            object.ticksize = message.ticksize;
        if (message.direction != null && message.hasOwnProperty("direction"))
            object.direction = message.direction;
        if (message.style != null && message.hasOwnProperty("style"))
            object.style = message.style;
        if (message.showlabels != null && message.hasOwnProperty("showlabels"))
            object.showlabels = message.showlabels;
        if (message.labelvadjust != null && message.hasOwnProperty("labelvadjust"))
            object.labelvadjust = message.labelvadjust;
        if (message.labelclass != null && message.hasOwnProperty("labelclass"))
            object.labelclass = message.labelclass;
        if (message.start != null && message.hasOwnProperty("start"))
            object.start = message.start;
        if (message.end != null && message.hasOwnProperty("end"))
            object.end = message.end;
        if (message.markerstyle != null && message.hasOwnProperty("markerstyle"))
            object.markerstyle = message.markerstyle;
        if (message.wadjust != null && message.hasOwnProperty("wadjust"))
            object.wadjust = message.wadjust;
        if (message.markergroup != null && message.hasOwnProperty("markergroup"))
            object.markergroup = message.markergroup;
        if (message.arrowstartlength != null && message.hasOwnProperty("arrowstartlength"))
            object.arrowstartlength = message.arrowstartlength;
        if (message.arrowstartwidth != null && message.hasOwnProperty("arrowstartwidth"))
            object.arrowstartwidth = message.arrowstartwidth;
        if (message.arrowstartangle != null && message.hasOwnProperty("arrowstartangle"))
            object.arrowstartangle = message.arrowstartangle;
        if (message.arrowendlength != null && message.hasOwnProperty("arrowendlength"))
            object.arrowendlength = message.arrowendlength;
        if (message.arrowendwidth != null && message.hasOwnProperty("arrowendwidth"))
            object.arrowendwidth = message.arrowendwidth;
        if (message.arrowendangle != null && message.hasOwnProperty("arrowendangle"))
            object.arrowendangle = message.arrowendangle;
        if (message.markerclick != null && message.hasOwnProperty("markerclick"))
            object.markerclick = message.markerclick;
        if (message.valign != null && message.hasOwnProperty("valign"))
            object.valign = message.valign;
        if (message.halign != null && message.hasOwnProperty("halign"))
            object.halign = message.halign;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = message.type;
        if (message.showline != null && message.hasOwnProperty("showline"))
            object.showline = message.showline;
        if (message.linestyle != null && message.hasOwnProperty("linestyle"))
            object.linestyle = message.linestyle;
        if (message.lineclass != null && message.hasOwnProperty("lineclass"))
            object.lineclass = message.lineclass;
        if (message.linevadjust != null && message.hasOwnProperty("linevadjust"))
            object.linevadjust = message.linevadjust;
        if (message.labelclick != null && message.hasOwnProperty("labelclick"))
            object.labelclick = message.labelclick;
        if (message["class"] != null && message.hasOwnProperty("class"))
            object["class"] = message["class"];
        if (message.markerclass != null && message.hasOwnProperty("markerclass"))
            object.markerclass = message.markerclass;
        return object;
    }

    /**
     * Converts this Attributes to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any } 
    {
        return Attributes.toObject(this, $protobuf.util.toJSONOptions);
    }
}
