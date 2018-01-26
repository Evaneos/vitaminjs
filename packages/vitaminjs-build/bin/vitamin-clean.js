#!/usr/bin/env node
const program = require('commander');
const clean = require('../cli/clean');

require('../cli/setVitaminPath');

program
    .name('clean')
    .alias('c')
    .parse(process.argv)

clean();
