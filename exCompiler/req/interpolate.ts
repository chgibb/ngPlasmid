/**
 * Describes a given token in an interpolation expression
 * 
 * @export
 * @class Token
 */
export class Token
{
    /**
     * Type of the token
     * 
     * @type {("scopeAccess" | "string" | "number" | "addition")}
     * @memberof Token
     */
    public type : "scopeAccess" | "string" | "number" | "addition";

    /**
     * Raw value of the token, as it appears in the expression
     * 
     * @type {string}
     * @memberof Token
     */
    public value : string;

    /**
     * Result of evaluating the token
     * 
     * @type {(string | number)}
     * @memberof Token
     */
    public interpValue : string | number;

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

    private evaluateScopeAccess($scope : any,varAccess : string) : string
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

    private trimQuotes(token : string) : string
    {
        return token.substring(1,token.length-1);
    }

    public interpolateAgainst($scope : any) : void
    {
        if(this.type == "string")
        {
            this.interpValue = this.trimQuotes(this.value);
            return;
        }
        else if(this.type == "scopeAccess")
        {
            this.interpValue = this.evaluateScopeAccess($scope,this.value);
        }
        else if(this.type == "number")
        {
            this.interpValue = parseInt(this.value);
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
        tokens[i].interpolateAgainst($scope);
        if(tokens[i].type == "scopeAccess")
        {
            result += tokens[i].interpValue;
            continue;
        }
        if(tokens[i].type == "string")
        {
            result += tokens[i].interpValue;
            continue;
        }
        if(tokens[i].type == "addition")
        {
            ++i;
            if(tokens[i].type == "string" || tokens[i-2].type == "string")
            {
                tokens[i].interpolateAgainst($scope);
                result += tokens[i].interpValue;
                continue;
            }
            else if(tokens[i].type == "number" || tokens[i-2].type == "number")
            {
                tokens[i].interpolateAgainst($scope);
                result = (parseInt(result) + <number>tokens[i].interpValue).toString();
                continue;
            }
        }
    }
    return result;
}