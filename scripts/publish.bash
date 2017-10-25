#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility

rm lib/*.js

npm version $1
git push origin --tags
npm pack