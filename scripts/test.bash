#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility

./scripts/buildTestBundles.bash
if [ $? != 0 ]; then
    printf "Failed to build testing bundles\n"
	exit 1
fi

rm *.svg
rm *.pb

node scripts/test