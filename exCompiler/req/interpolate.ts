export class Token
{
    public type : "scopeAccess" | "addition" | "string";
    public value : string;
    
}

export function tokenize(exp : string) : Array<Token>
{
    let res = new Array<Token>();

    let str : string = "";
    for(let i = 0; i != exp.length; ++i)
    {
        str += exp[i];
    }
    let token = new Token();
    token.value = str;
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
    }
    return result;
}