#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility

./scripts/genPBCode.bash

./node_modules/.bin/tsc
if [ $? != 0 ]; then
    printf "tsc failed\n"
	exit 1
fi

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    ./node_modules/.bin/jest
    if [ $? != 0 ]; then
        exit 1
    fi
fi

node scripts/test
exit $?