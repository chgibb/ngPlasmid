#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility

function testFile {
	f=$1
	printf "Testing $f\n\n"

	printf "With reference compiler:\n"
	printf "Compile time:\n"
	if [ $# == 1 ]; then
		time node referenceCompiler/index tests/$f > "$f"Ref.svg
	fi
	if [ $# == 2 ]; then
		time node referenceCompiler/index tests/$f tests/$2 > "$f"Ref.svg
	fi
	printf "Optimization time:\n"
	./node_modules/.bin/svgo -i "$f"Ref.svg -o "$f"RefO.svg --multipass --pretty --indent=4

	printf "With experimental compiler:\n"
	printf "Compile time:\n"
	if [ $# == 1 ]; then
		time node exCompiler/index tests/$f > "$f"Ex.svg
	fi
	if [ $# == 2 ]; then
		time node exCompiler/index tests/$f tests/$2 > "$f"Ex.svg
	fi
	printf "Optimization time:\n"
	./node_modules/.bin/svgo -i "$f"Ex.svg -o "$f"ExO.svg --multipass --pretty --indent=4
	printf "\n"
	node scripts/fileEquality "$f"ExO.svg "$f"RefO.svg
	if [ $? != 0 ]; then
		if [ $1 != "HPV1630CovTracks.html" ]; then
			exit 1
		fi
	fi
}

./node_modules/.bin/tsc
if [ $? != 0 ]; then
    printf "tsc failed\n"
	exit 1
fi

testFile "2Labels.html"
testFile "2TrackMarkers.html"
testFile "trackMarkers.html"
testFile "2trackScales.html"
testFile "3trackScales.html"
testFile "trackMarkers.html"
testFile "HSP70.html"
testFile "pBCA-RLuc.html"
testFile "pBR322.html"
testFile "pLVG440.html"
testFile "pPMA43C.html"
testFile "pUC19.html"

testFile "strPropPlusStrLit.html" "strPropPlusStrLit.json"
testFile "OTBStrPropPlusStrLit.html" "OTBStrPropPlusStrLit.json"

testFile "strLitPlusStrProp.html" "strLitPlusStrProp.json"
testFile "numPropPlusNumLit.html" "numPropPlusNumLit.json"

testFile "L6R1HPV16Cov.html" "L6R1HPV16Cov.json"
testFile "HPV165CovTracks.html" "HPV165CovTracks.json"
testFile "HPV1615CovTracks.html" "HPV1615CovTracks.json"
testFile "HPV1630CovTracks.html" "HPV1630CovTracks.json"