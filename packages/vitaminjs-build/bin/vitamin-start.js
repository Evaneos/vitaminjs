#!/usr/bin/env node
const program = require('commander');
const start = require('../cli/start');

require('../cli/setVitaminPath');

program
    .name('start')
    .alias('s')
    .option('--no-hmr', 'Disable hot reload')
    .parse(process.argv);

start(program.hmr);
