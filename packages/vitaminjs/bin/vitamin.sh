#!/bin/sh

if [ -f ./node_modules/.bin/vitamin-$1 ]; then

    COMMAND=$1
    shift
    exec ./node_modules/.bin/vitamin-$COMMAND $*

elif [ -z $1 ] || [ "$1" = '--version' ] || [ "$1" = '-v' ]; then

    exec ./node_modules/.bin/vitamin-version

elif [ -z $1 ] || [ "$1" = '--help' ] || [ "$1" = '-h' ]; then

    echo "Usage: vitamin [options] [command]"
    echo "Build framework for react/redux ecosystem\n"

    echo "Options:"

    echo "\t -v, --version  output the version number"
    echo "\t -h, --help     output usage information\n"

    echo "Commands:"

    echo "\t test|t [options] [runnerArgs...] \t \t Build test suite"
    echo "\t build|b [options] \t \t \t \t Build server and client bundles"
    echo "\t clean|c \t \t \t \t \t Delete server and client builds"
    echo "\t start|s [options] \t \t \t \t Build and start application server"
    echo "\t serve \t \t \t \t \t \t Start application server"
    exit 1

else

    echo "$1 is not a valid vitamin command."
    echo "To see all valid commands, try 'vitamin --help'"
    exit 1

fi
