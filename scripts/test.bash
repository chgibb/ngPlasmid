#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility

./scripts/genPBCode.bash

./node_modules/.bin/tsc
if [ $? != 0 ]; then
    printf "tsc failed\n"
	exit 1
fi

./scripts/buildWasm.bash
if [ $? != 0 ]; then
    printf "Building WASM failed\n"
	exit 1
fi

rm *.svg
rm *.pb

node scripts/test
exit $?