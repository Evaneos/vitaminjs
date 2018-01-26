#!/usr/bin/env node
/* eslint-disable no-console */
const program = require('commander');
const chalk = require('chalk');
const path = require('path');
const spawn = require('spawn');
const { commonBuild } = require('../cli/commonBuild');
const webpackConfigTest = require('../config/build/webpack.config.tests');
require('../cli/setVitaminPath');

program
    .name('test')
    .alias('t')
    .option('-r, --runner [type]', 'Choose your test runner (e.g mocha, jest, jasmine...)')
    .option('--no-hmr', 'Disable hot reload')
    .on('--help', () => {
        console.log('  Examples:');
        console.log('');
        console.log('    $ vitamin test -r mocha -- --color');
        console.log('');
    })
    .parse(process.argv);

const launchTest = (config) => {
    if (!config.test) {
        throw new Error('Please specify a test file path in .vitaminrc');
    }

    console.log(chalk.blue('\uD83D\uDD50 Launching tests...'));
    const serverFile = path.join(
        config.server.buildPath,
        'tests'
    );
    spawn(
        // FIXME I think this breaks with parameters that contains spaces
        `${program.runner} ${serverFile} ${program.args.join(' ')}`,
        { stdio: 'pipe' }
    );
};

commonBuild(
    webpackConfigTest,
    'tests',
    { hot: program.hmr, dev: process.env.NODE_ENV !== 'production' },
    launchTest
);
