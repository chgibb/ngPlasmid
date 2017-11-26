#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility

mkdir lib/pb
./node_modules/.bin/pbjs -t static-module -w commonjs -o lib/pb/directives.js lib/directives.proto
./node_modules/.bin/pbts -o lib/pb/directives.d.ts lib/pb/directives.js