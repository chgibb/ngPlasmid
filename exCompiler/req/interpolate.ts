export function interpolate(value : string,$scope : any) : string
{
    $scope = "";
    if(value[0] != "{" || value[1] != "{" || value[value.length-1] != "}" || value[value.length-2] != "}")
        return value;

    return "";
}