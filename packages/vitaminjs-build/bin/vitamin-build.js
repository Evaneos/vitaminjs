#!/usr/bin/env node
const program = require('commander');

const build = require('./build');
const checkHot = require('./checkHot');
const { BUILD_FAILED } = require('./commonBuild');

require('./setVitaminPath');

program
    .option('-h, --hot', 'Activate hot module reload')
    .option('--with-source-maps', 'Generate source maps')
    .parse(process.argv);

build({
    hot: checkHot(program.hot),
    withSourceMaps: program.withSourceMaps,
}).catch((err) => {
    if (err !== BUILD_FAILED) {
        console.log(err.stack || err);
    }
    process.exit(1);
});
