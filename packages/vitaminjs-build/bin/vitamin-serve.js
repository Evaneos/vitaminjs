#!/usr/bin/env node
const program = require('commander');
const server = require('../cli/server');

program
    .name('serve')
    .parse(process.argv);

server.start(program.hmr);
