#!/bin/bash
(set -o igncr) 2>/dev/null && set -o igncr; # For Cygwin on Windows compatibility

function testFile {
	f=$1
	printf "Testing $f\n\n"

	printf "With reference compiler:\n"
	printf "Compile time:\n"
	time node referenceCompiler/index samples/$f > "$f"Ref.svg
	printf "Optimization time:\n"
	./node_modules/.bin/svgo -i "$f"Ref.svg -o "$f"RefO.svg

	printf "With experimental compiler:\n"
	printf "Compile time:\n"
	time node exCompiler/index samples/$f > "$f"Ex.svg
	printf "Optimization time:\n"
	./node_modules/.bin/svgo -i "$f"Ex.svg -o "$f"ExO.svg
	printf "\n"
	node scripts/fileEquality "$f"ExO.svg "$f"RefO.svg
	if [ $? != 0 ]; then
		exit 1
	fi
}

./node_modules/.bin/tsc
if [ $? != 0 ]; then
    printf "tsc failed\n"
	exit 1
fi

testFile "2Labels.html"
