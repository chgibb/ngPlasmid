#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility

./scripts/genPBCode.bash

./node_modules/.bin/tsc
if [ $? != 0 ]; then
    printf "tsc failed\n"
	exit 1
fi

function buildBundle {
    f=$1
    destination=$(echo $f | awk '{gsub("index/","testBundle/");print}')

    printf "Building $f\n"
    printf "Shaking\n"
    #node scripts/rollup $f

    printf "Bundling\n"
    if [[ "$f" != "referenceCompiler/index" ]]; then
        ./node_modules/.bin/browserify $f --node --debug -o $destination --ignore-missing --noparse=jquery
    fi

    if [[ "$f" == "referenceCompiler/index" ]]; then
        ./node_modules/.bin/browserify $f --node --debug -o $destination --ignore-missing  --require @chgibb/angularplasmid --noparse=jquery
    fi

    printf "Collapsing\n"
    ./node_modules/.bin/bundle-collapser $destination > tmp
    if [ $? != 0 ]; then
        rm temp
    fi
    if [ $? == 0 ]; then
        mv tmp $destination
    fi

    printf "Compressing\n"
    node node_modules/uglify-es/bin/uglifyjs --compress -- $destination > tmp
    mv tmp $destination

    ./node_modules/.bin/optimize-js $destination > tmp
    mv tmp $destination

    printf "\n\n\n"
}
buildBundle "HTMLToPBCompiler/index.js"
buildBundle "HTMLToSVGCompiler/index.js"
buildBundle "PBToSVGCompiler/index.js"
buildBundle "referenceCompiler/index.js"