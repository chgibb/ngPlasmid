export class Token
{
    public type : "scopeAccess" | "string" | "number" | "addition";
    public value : string;

    private determineTokenType() : void
    {
        //' quoted string literal
        if(this.value[0] == `'` && this.value[this.value.length-1] == `'`)
        {
            this.type = "string";
            return;
        }
        //one-time bound variable
        if(this.value[0] == `:` && this.value[1] == `:`)
        {
            this.type = "scopeAccess";
            return;
        }
        //number literal
        else if(!isNaN(parseInt(this.value)))
        {
            this.type = "number";
            return;
        }
        else
        {
            this.type = "scopeAccess";
            return;
        }
    }

    public constructor(value : string)
    {
        if(value == "+")
        {
            this.type = "addition";
            return;
        }
        this.value = value;
        this.determineTokenType();
    }
    
}



export function trimQuotes(token : string) : string
{
    return token.substring(1,token.length-1);
}

export function tokenize(exp : string) : Array<Token>
{
    let res = new Array<Token>();

    let str : string = "";
    for(let i = 0; i != exp.length; ++i)
    {
        if(exp[i] == "+")
        {
            let token = new Token("+");
            let previousToken = new Token(str);
            res.push(previousToken);
            res.push(token);
            str = "";
            continue;
        }
        str += exp[i];
    }
    let token = new Token(str);
    res.push(token);

    return res;
}

export function evaluateScopeAccess($scope : any,varAccess : string) : string
{
    //trim the leading :: off of one-time bound variable names
    if(varAccess[0] == `:` && varAccess[1] == `:`)
    {
        varAccess = varAccess.substring(2,varAccess.length);
    }
    //adapted from https://stackoverflow.com/questions/8051975/access-object-child-properties-using-a-dot-notation-string
    let props = varAccess.split(".");
    while(props.length && ($scope = $scope[(<any>props.shift())]));
    return $scope;
}

export function interpolate(value : string,$scope : any) : string
{
    //If the entire attribute value is not a valid inerpolation expression, then simply return the value
    if(value[0] != "{" || value[1] != "{" || value[value.length-1] != "}" || value[value.length-2] != "}")
        return value;
    //Remove the leading {{ and trailing }}
    let exp = value.substring(2,value.length-2);
    let tokens = tokenize(exp);
    let result = "";
    for(let i = 0; i != tokens.length; ++i)
    {
        if(tokens[i].type == "scopeAccess" || tokens[i].type === undefined)
        {
            result += evaluateScopeAccess($scope,tokens[i].value);
        }
        if(tokens[i].type == "addition")
        {
            ++i;
            if(tokens[i].type == "string")
                tokens[i].value = trimQuotes(tokens[i].value);
            result += tokens[i].value;
        }
    }
    return result;
}