export interface TestStatus
{
    message : string;
    status : boolean;
}

export class TestSummary
{
    public name : string;
    public inputSize : number;
    public statuses : Array<TestStatus>;
    constructor(name : string,inputSize : number)
    {
        this.name = name;
        this.inputSize = inputSize;
        
        this.statuses = new Array<TestStatus>();
    }
}