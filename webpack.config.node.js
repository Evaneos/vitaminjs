'use strict';

const universalConf = require('./webpack.config.universal.js');
const utils = require('./src/utils');
const mergeWith = require('lodash.mergewith');
const fs = require('fs');
const path = require('path');

const externalModules = fs
    .readdirSync(utils.fondationResolve('node_modules'))
    .filter(m => m !== '.bin')
    .reduce((modules, module) => {
        modules[module] = true;
        return modules;
    }, {});

const SERVER_DIR = utils.fondationResolve('src', 'server');

// Configuration client-side (client.js)
module.exports = mergeWith({}, universalConf.config, {
    entry: path.join(SERVER_DIR, 'app.js'),
    output: {
        path: universalConf.BUILD_DIR,
        filename: 'server.js',
        libraryTarget: 'commonjs2',
    },
    externals: externalModules,

    target: 'node',
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
    },

    module: {
        loaders: [universalConf.createBabelLoaderConfig('.babelrc.node')],
    },

}, utils.concat);
