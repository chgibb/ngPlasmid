export class Token
{
    type : "scopeAccessor" | "addition";
    value : string;
}

export function interpolate(value : string,$scope : any) : string
{
    $scope = "";
    //If the entire attribute value is not a valid inerpolation expression, then simply return the value
    if(value[0] != "{" || value[1] != "{" || value[value.length-1] != "}" || value[value.length-2] != "}")
        return value;
    //Remove the leading {{ and trailing }}
    let exp = value.substring(2,value.length-2);
    console.error(exp.split("."));
    return "";
}