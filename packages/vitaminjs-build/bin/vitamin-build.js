#!/usr/bin/env node
const program = require('commander');
const { buildAndExit } = require('../cli/build');

program
    .name('build')
    .alias('b')
    .option('--with-source-maps', 'Generate source maps')
    .parse(process.argv);

buildAndExit({ withSourceMaps: program.withSourceMaps });
