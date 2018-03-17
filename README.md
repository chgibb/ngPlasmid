# ngPlasmid

## Motivation
This project drives the circular visualizations of [PHAT](https://github.com/chgibb/phat). Previously, PHAT made us of [AngularPlasmid](https://github.com/vixis/angularplasmid) to drive its circular visualizations. This project is a (mostly) compatible replacement for AngularPlasmid with a special focus on performance above all. 

## Usage
This project is available through ```npm``` as a Typescript only package. No Javascript is distributed.


```
npm install --save @chgibb/ngplasmid
```

## Basic API
The basic API revolves around the ```Plasmid``` class, representing a traditional AngularPlasmid template. ```Plasmid```s can be loaded from either HTML or protocol buffers and serialised as protocol buffers. ```$scope``` objects can be set and mutated in order to alter the rendered output. See [the HTML to SVG compiler](https://github.com/chgibb/ngPlasmid/blob/adaptiveBackend/HTMLToSVGCompiler/index.ts) used by tests for basic usage.

## Adaptive Rendering
```Plasmid```s can be set to experiment with rendering strategies on each call to ```Plasmid#renderStart``` in order to find the most performant one for their current template and the current machine. This is most useful in environments where one or more ```Plasmid```s of varying sizes and complexities are rendered over and over again (such as PHAT). By default, this is disabled. It can be enabled by calling ```Plasmid#enableAdaptiveRendering()```. A ```Plasmid``` will select from its available strategies after it has run with each strategy ```Plasmid#adaptIterations``` times. By default, this is 2. Once a ```Plasmid``` has selected a strategy, it will use that strategy on every future call to ```Plasmid#renderStart()``` and ```Plasmid#renderEnd()```. The current strategy can be overriden by calling ```Plasmid#changeRenderingStrategy(strategy)```.

## Rendering Strategies
- "normal": Typescript based. Recursively descends the ```Plasmid```s children and renders each in turn. Composes and returns the result. This is the default.
- "preCalculateBatch": C++ based. ```ngPlasmid.node``` must have successfully compiled and be available in the current working directory for this strategy to run. ```<plasmidtrack>```s and ```<trackmarker>```s have their SVG path data precalculated in C++. If a ```<plasmidtrack>``` has more than a certain number of ```<trackmarker>```s then the calculation is batched up and split into threads. Calls the "normal" strategy to complete the remainder.

## Reference Compiler
The compiler under ```referenceCompiler/``` uses ```ng-node-compile```, which internally makes use of ```jsdom``` and ```AngularJS``` itself to simulate a web browser environment to render the template and then extract the SVG. This is woefully slow and inefficient for obvious reasons. Output from this method is considered to be the source of all truth in terms of what is and is not correct output.

## HTML to SVG Compiler
Under ```HTMLToSVGCompiler/``` is an example implementation which takes an HTML file to compile and a JSON file to use as ```$scope``` and dumps the result to standard out. This is used in testing.

## HTML to Protocol Buffer Compiler
Under ```HTMLToPBCompiler/``` is an example implementation which takes an HTML file and compiles it to a protocol buffer. This is used in testing.

## Protocol Buffer to SVG Compiler
Under ```PBToSVGCompiler/``` is an example implementation which takes a protocol buffer file and a JSON file to use as ```$scope``` and dumps the result to standard out. This is used in testing. This is envisioned to be used with extremely large inputs where the overhead of HTML parsing becomes the primary overhead.

## Compatibility with AngularPlasmid
See AngularPlasmid's [official examples](http://angularplasmid.vixis.com/samples.php)  
ngPlasmid aims to fully support the directives of AngularPlasmid as they are used in the official examples. Directive usage in the examples differs in some ways from what the official documentation states. Where there is a conflict, we defer to compatibility with the example and its output from actually running AngularPlasmid as opposed to what the documentation states. We support all directives as they are used in the official examples.

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
    - ```width```
    - ```trackstyle```
    - ```radius```
- ```<tracklabel>```
    - ```text```
- ```<trackscale>```
    - ```interval```
    - ```direction```
    - ```vadjust```
    - ```showlabels```
- ```<trackmarker>```
    - ```start```
    - ```end```
    - ```wadjust```
    - ```markerstyle```
- ```<markerlabel>```
    - ```lineclass```
    - ```showline```
    - ```vadjust```
    - ```text```

### Performance
ngPlasmid can be anywhere from ~5x to ~160x faster. ngPlasmid tends to perform far better in terms of speed over the reference compiler the larger the input is. With small inputs, the main bottleneck is disk I/O and NodeJS' startup time. Speed, as well as correctness with the reference implementation is tested on each commit. See Travis logs for compilation and optimization time for each test file vs the reference compiler.

To give a sense of performance, especially with large inputs:  
As of [a0e2687](https://github.com/chgibb/ngPlasmid/commit/a0e2687ad73d871c24ddc6b61c94c955d4c81c0e), compiling 237,180 points of genomic coverage data generated by PHAT from an AngularPlasmid HTML template ([tests/HPV1630CoverageTracks.html](https://github.com/chgibb/ngPlasmid/blob/a0e2687ad73d871c24ddc6b61c94c955d4c81c0e/tests/HPV1630CovTracks.html), 601 ```<plasmidtrack>```s, 24,322 ```<trackmarker>```s, 607 individual interpolation expressions) to SVG takes the reference ~137.363 seconds, ngPlasmid's HTML to SVG, ~1.161 seconds, and ngPlasmid's Protocol Buffer to SVG ~.833 seconds after ~.825 seconds to first compile the HTML to Protocol Buffer. See [Travis log](https://travis-ci.org/chgibb/ngPlasmid/builds/310137172?utm_source=github_status&utm_medium=notification).

## Dependencies
```Plasmid``` -> SVG functionality is available completely without dependencies. If you want to compile AngularPlasmid HTML templates to SVG, ```htmlparser2 ^3.9.2``` is required. Any use cases involving Protocol Buffers requires ```protobufjs ^6.8.0```.
