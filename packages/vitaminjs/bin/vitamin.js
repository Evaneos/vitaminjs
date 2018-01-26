#!/usr/bin/env node
const program = require('commander'); // FIXME Add to package.json
const { version } = require('../package.json');

program
    .version(version)
    .description('Build framework for react/redux ecosystem')
    .command('test [runnerArgs...]', 'Build test suite').alias('t')
    .command('build', 'Build server and client bundles').alias('b')
    .command('clean', 'Delete server and client builds').alias('c')
    .command('start', 'Build and start application server').alias('s')
    .command('serve', 'Start application server')
    .parse(process.argv);
