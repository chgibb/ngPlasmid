#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility

node-gyp configure
if [ $? != 0 ]; then
    printf "node-gyp configure failed\n"
	exit 1
fi

node-gyp build
if [ $? != 0 ]; then
    printf "node-gyp build failed\n"
	exit 1
fi

cp build/Release/ngPlasmid.node lib/