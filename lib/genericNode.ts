export interface GenericNode<T>
{
    type : string;
    name : string;
    attribs : any;
    children : Array<T>;
}
