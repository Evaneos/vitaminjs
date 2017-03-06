#!/usr/bin/env bash

example="$1"

if [ -z "$example" ]
then
    echo "more parallelism than tests"
else
    echo "Testing $example"

    cd "./examples/$example"
    yarn install --no-progress
    yarn link vitaminjs
    yarn run clean
    yarn run build
    test -e build/server_bundle.js
    NODE_ENV=production yarn run build
    test -e build/server_bundle.js
fi
