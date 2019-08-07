export function round10(value : any, exp : any) : number
{
    //https://github.com/vixis/angularplasmid/blob/9ea10c4ed21ee5c2879659dc0b5d3d57086ef873/src/js/js#L21
    var type = "round";
    // If the exp is undefined or zero...
    if (typeof exp === "undefined" || +exp === 0) 
    {
        return (<any>Math)[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) 
    {
        return NaN;
    }
    // Shift
    value = value.toString().split("e");
    value = (<any>Math)[type](+(value[0] + "e" + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split("e");
    return +(value[0] + "e" + (value[1] ? (+value[1] + exp) : exp));
}
