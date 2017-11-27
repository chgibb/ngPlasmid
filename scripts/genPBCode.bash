#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility

mkdir lib/pb
./node_modules/.bin/pbjs -t static-module -w commonjs -o lib/pb/node.js lib/node.proto
./node_modules/.bin/pbts -o lib/pb/node.d.ts lib/pb/node.js