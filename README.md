# ngPlasmid

Reimplementation of https://github.com/vixis/angularplasmid to compile AngularPlasmid templates to static SVGs.

This project is available through ```npm``` as a Typescript only package. No Javascript is distributed.

## Usage
```
npm install --save @chgibb/ngplasmid
```
```javascript
/*
    Compiles the file inputFile.html to SVG and dumps the result to standard out.
*/

//Ensure the files we import get compiled
/// <reference path="node_modules/@chgibb/ngplasmid/lib/html" />
/// <reference path="node_modules/@chgibb/ngplasmid/lib/directives" />

import * as fs from "fs";


import * as html from "@chgibb/ngplasmid/lib/html";
import * as directives from "@chgibb/ngplasmid/lib/directives";

(async function(){

    /*
        The html.loadFromString function makes use of htmlparser2 to parse its input.
        htmlparser2 is not installed when installing ngplasmid by default. 
        You must also install htmlparser2 > 3.9.2 for this function to work.

        Plasmid maps can also be constructed programmatically by constructing an instance of html.Node or by manipulating class properties directly.
    */
    let nodes : Array<html.Node> = await html.loadFromString(fs.readFileSync("inputFile.html").toString());

    let plasmid : directives.Plasmid = new directives.Plasmid();
    plasmid.$scope = {
        someProperty : 1,
        someOtherProperty : "My Map"
    };

    //ignore everything in inputFile.html until we find a <plasmid> directive
    for(let i = 0; i != nodes.length; ++i)
    {
        if(nodes[i].name == "plasmid")
        {
            //construct the map in memory
            plasmid.fromNode(nodes[i]);
            break;
        }
    }
    //compile and dump the SVG to the console
    console.log(plasmid.renderStart() + plasmid.renderEnd());
})();
```
## Motivation
This project will be gradually integrated into the SVG compilation infrastructure of [PHAT](https://github.com/chgibb/phat). PHAT makes heavy use of AngularPlasmid for circular genome visualisations. Currently, the method described in the Reference Compiler section and implemented in [```referenceCompiler/index.ts```](https://github.com/chgibb/ngPlasmid/blob/master/referenceCompiler/index.ts) is used in PHAT. As requirements have changed, performance has become a problem. We aim to solve it with this project.

## Reference Compiler
The compiler under ```referenceCompiler/``` uses ```ng-node-compile```, which internally makes use of ```jsdom``` and ```AngularJS``` itself to simulate a web browser environment to render the template and then extract the SVG. This is woefully slow and inefficient for obvious reasons.

## Experimental Compiler
The source for this project is currently under ```lib/```. Instead of simulating a browser environment, we simply parse the templates from HTML and then convert directly to SVG. Under ```exCompiler/``` is an example implementation which takes an HTML file to compile and a JSON file to use as ```$scope``` and dumps the result to standard out. This is used in testing.

## Progress
See AngularPlasmid's [official examples](http://angularplasmid.vixis.com/samples.php)
### Compatibility with AngularPlasmid
ngPlasmid aims to fully support the directives of AngularPlasmid as they are used in the official examples. Directive usage in the examples differs in some ways from what the official documentation states. Where there is a conflict, we defer to compatibility with the example and its output from actually running AngularPlasmid as opposed to what the documentation states. We support all directives as they are used in the official examples.

### Official Examples Compatibility
- HSP70
- pBCA-RLuc
- pBR322
- pLVG440
- pPMA43C
- pUC19

### Breaking Changes, Incompatibility
See AngularPlasmid's [official API docs](http://angularplasmid.vixis.com/api.php)
#### ```<markerlabel>``` Font Size
AngularPlasmid uses ```window.getComputedStyle``` to determine font size. We attempt to parse font size out of the ```<markerlabel>```'s ```labelstyle``` attribute as a substitute. If we are unable to determine font size, it is assumed to be 0. This does not prevent the rendering of ```<markerlabel>```s which do not explicitly specify font style, however the output SVG will differ slightly in text positioning than if ran through AngularPlasmid in a browser environment. This bug (and substitute behaviour) is currently present in ```JSDom``` as well. As such, there is no intention of trying to correct it at this time.

#### ```<svgelement>```
The ```<svgelement>``` directive is (currently) not supported and (currently) outside the scope of this project.

#### ```<plasmidapi>```
The ```<plasmidapi>``` directive is (currently) not supported and (currently) outside the scope of this project.

#### Attributes Marked ```Numeric``` in the Official Docs
Every directive attribute marked as ```Type Numeric``` in the official docs is treated as a float. This does not appear to have any negative consequences though is of note.

#### ```ng-``` Attributes and Directives
All AngularJS ```ng-``` attributes and directives are not supported. None are used in the official examples and are (currently) outside the scope of this project.

#### String Interpolation ```{{ }}```  
##### Attribute Value
The entire attribute value to be interpolated must be an interpolation expression. i.e. ```<plasmid radius="{{map.radius}}" ... >```. Something like ```<plasmid radius="1{{map.radius}}" ...>``` is not supported and the expression will be returned into the attribute as is with no interpolation.

##### Interpolating Objects
Expressions of the form ```"{{map}}"``` where ```map : {...some object...}``` will evaluate to ```[object Object]```. AngularJS will dump the entire raw JSON string into the attribute, with quotes and special characters properly escaped for HTML. As there is no scenario where interpolating an object is not an error, we return ```[object Object]``` in the interests of speed.

##### String Literals
String literals MUST be quoted using ```'```(single quote). Unquoted strings are treated as variables and will be interpolated as ```undefined``` if they do not exist.

##### Numeric Literals
All numeric literals are treated as floats internally. Numeric literals cannot be arbitrarily inserted. i.e. ```{{123map.someProperty}}``` will result in a lookup for the property ```someProperty``` on object ```123map``` which will be interpolated as ```undefined```.

##### Operators
Currently only the ```+``` addition operator is supported. Inserting string or numeric literals into an expression must be done through an operator. i.e. ```{{'hello '+map.myName}}``` or ```{{map.mapWidth+150}}```

##### Type Coercion
Types are coerced according to the literals being operated on. i.e. ```{{'hello '+map.radius}}``` where ```map : {radius : 150}``` will coerce ```map.radius``` to a string and append it to ```'hello '```. The same behaviour is true for numeric literals, i.e. ```{{map.mapName+100}}``` will coerce ```map.mapName``` to a number and add ```100``` to it. If ```map.mapName``` is not a number, the result will be ```NaN```.

##### One-Time Variable Bindings
One-time bound variables (```::```) are treated as regular variables. They are not handled specially.

##### Attributes Supporting Interpolation
In the interests of speed and the requirements of the downstream project, only the following attributes currently support interpolation:
- ```<plasmid>```
    - ```plasmidheight```
    - ```plasmidwidth```
- ```<plasmidtrack>```
    - ```radius```
- ```<tracklabel>```
    - ```text```

### Performance
ngPlasmid can be anywhere from ~5x to ~160x faster. ngPlasmid tends to perform far better in terms of speed over the reference compiler the larger the input is. With small inputs, the main bottleneck is disk I/O and NodeJS' startup time. Speed, as well as correctness with the reference implementation is tested on each commit. See Travis logs for compilation and optimization time for each test file vs the reference compiler.