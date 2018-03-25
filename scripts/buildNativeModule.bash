#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility

rm -rf build/

node-gyp configure --release --no-debug
if [ $? != 0 ]; then
    printf "node-gyp configure failed\n"
	exit 1
fi

node-gyp build --release --no-debug
if [ $? != 0 ]; then
    printf "node-gyp build failed\n"
	exit 1
fi

cp build/Release/ngPlasmid.node lib/