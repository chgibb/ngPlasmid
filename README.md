# ngPlasmid

Reimplementation of https://github.com/vixis/angularplasmid to compile AngularPlasmid templates to static SVGs. Currently highly experimental and subject to change. Will likely not be fully compatible with all of AngularPlasmid.

## Reference Compiler
The compiler under ```referenceCompiler/``` uses ```ng-node-compile```, which internally makes use of ```jsdom``` and ```AngularJS``` itself to simulate a web browser environment to render the template and then extract the SVG. This is woefully slow and inefficient for obvious reasons.

## Experimental Compiler
The source for this project is currently under ```exCompiler/```. Instead of simulating a browser environment, we simply parse the templates from HTML and then convert directly to SVG.

## Progress
### Compatibility with AngularPlasmid
ngPlasmid aims to fully support the directives of AngularPlasmid as they are used in the official examples. Directive usage in the examples differs in some ways from what the official documentation states. Where there is a conflict, we defer to compatibility with the example and its output from actually running AngularPlasmid as opposed to what the documentation states. With the exception of ```<markerlabel>```, we support all directives as they are used in the official examples.

### Official Examples Compatibility
- HSP70
- pBCA-RLuc
- pBR322
- pLVG440
- pPMA43C
- pUC19

### Breaking Changes, Incompatibility
#### ```<markerlabel>```  
We currently do not support the ```<markerlabel>``` directive at all. This is due to the original's use of ```window.getComputedStyle``` to determine font size. If we can find a performant alternative, then we may support ```<markerlabel>``` in the future.

#### String Interpolation ```{{ }}```  
##### Attribute Value
The entire attribute value to be interpolated must be an interpolation expression. i.e. ```<plasmid radius="{{map.radius}}" ... >```. Something like ```<plasmid radius="1{{map.radius}}" ...>``` is not supported and the expression will be returned into the attribute as is with no interpolation.

##### Interpolating Objects
Expressions of the form ```"{{map}}"``` where ```map : {...some object...}``` will evaluate to ```[object Object]```. AngularJS will dump the entire raw JSON string into the attribute, with quotes and special characters properly escaped for HTML. As there is no scenario where interpolating an object is not an error, we return ```[object Object]``` in the interests of speed.

##### String Literals
String literals MUST be quoted using ```'```(single quote). Unquoted strings are treated as variables and will be interpolated as ```undefined``` if they do not exist.

##### Numeric Literals
At the moment we only support integer literals. Floating point literals will be truncated. Numeric literals cannot be arbitrarily inserted. i.e. ```{{123map.someProperty}}``` will result in a lookup for the property ```someProperty``` on object ```123map``` which will be interpolated as ```undefined```.

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

### Speed
ngPlasmid can be 5-100x faster. Speed, as well as correctness with the reference implementation is tested on each commit. See Travis logs for compilation and optimization time for each test file vs the reference compiler.