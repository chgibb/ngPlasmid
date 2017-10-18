# ngPlasmid

Reimplementation of https://github.com/vixis/angularplasmid to compile AngularPlasmid templates to static SVGs. Currently highly experimental and subject to change. Will likely not be fully compatible with all of AngularPlasmid.

## Reference Compiler
The compiler under ```referenceCompiler/``` uses ```ng-node-compile```, which internally makes use of ```jsdom``` and ```AngularJS``` itself to simulate a web browser environment to render the template and then extract the SVG. This is woefully slow and inefficient for obvious reasons.

## Experimental Compiler
The source for this project is currently under ```exCompiler/```. Instead of simulating a browser environment, we simply parse the templates from HTML and then convert directly to SVG.