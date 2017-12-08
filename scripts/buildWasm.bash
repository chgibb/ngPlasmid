#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility

node node_modules/binaryen/bin/as