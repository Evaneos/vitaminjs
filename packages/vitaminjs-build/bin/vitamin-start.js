#!/usr/bin/env node
const program = require('commander');

const start = require('./start');
const clean = require('./clean');
const checkHot = require('./checkHot');

const { BUILD_FAILED } = require('./commonBuild');

require('./setVitaminPath');

program
    .option('--no-hmr', 'Disable hot reload')
    .parse(process.argv);

clean()
    .then(() => start({ hot: checkHot(program.hmr) }))
    .catch((err) => {
        if (err !== BUILD_FAILED) {
            console.log(err.stack || err);
        }
        process.exit(1);
    });
