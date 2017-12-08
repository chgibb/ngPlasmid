#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility

rm lib/*.js
./scripts/genPBCode.bash
./scripts/buildWasm.bash

npm version $1
git push origin --tags
npm publish
npm pack
