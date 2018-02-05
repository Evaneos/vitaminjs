#!/usr/bin/env node
const program = require('commander');
const clean = require('../cli/clean');

program
    .name('clean')
    .alias('c')
    .parse(process.argv);

clean();
