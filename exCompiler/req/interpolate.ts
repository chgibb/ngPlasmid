export class Token
{
    public type : "scopeAccess" | "string" | "number" | "addition";
    public value : string;
    
}

export function determineTokenType(token : Token) : "scopeAccess" | "string" | "number"
{
    if(token.value[0] == `'` && token.value[token.value.length-1] == `'`)
        return "string";
    else if(!isNaN(parseInt(token.value)))
        return "number";
    else
        return "scopeAccess";
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
            let token = new Token();
            token.type = "addition";
            let previousToken = new Token();
            previousToken.value = str;
            previousToken.type = determineTokenType(previousToken);
            res.push(previousToken);
            res.push(token);
            str = "";
            continue;
        }
        str += exp[i];
    }
    let token = new Token();
    token.value = str;
    token.type = determineTokenType(token);
    res.push(token);

    return res;
}

export function evaluateScopeAccess($scope : any,varAccess : string) : string
{
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