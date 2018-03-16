#!/usr/bin/env node
const program = require('commander');
const spawnJest = require('../src/jest');

program
    .name('jest [runnerArgs...]')
    .description('Launch test suite with Jest')
    .parse(process.argv);

spawnJest({ runnerArgs: program.args.join(' ') });
