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
We currently do not support the ```<markerlabel>``` directive at all. This is due to the original's use of ```window.getComputedStyle``` to determine font size. If we can find a performant alternative, then we may support ```<markerlabel>``` in the future.

### Speed
ngPlasmid can be 5-10x faster. Speed, as well as correctness with the reference implementation is tested on each commit. See Travis logs for compilation and optimization time for each test file vs the reference compiler.