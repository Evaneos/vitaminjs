'use strict';
const path = require('path');
const universalConf = require('./webpack.config.universal.js');
const utils = require('./src/utils');
const mergeWith = require('lodash.mergewith');
const webpack = require('webpack');

// Configuration client-side (client.js)

module.exports = mergeWith({}, universalConf.config, {
    entry: [path.join(universalConf.APP_SOURCE_DIR, 'client.js')],
    output: {
        path: utils.appResolve('public'),
        // TODO : put hash in name
        filename: 'bundle.js',
        publicPath: '/',
    },
    module: {
        loaders: [
            universalConf.createBabelLoaderConfig('.babelrc.browser'),
        ],
    },
    plugins: universalConf.HOT ? [new webpack.HotModuleReplacementPlugin()] : [],
}, utils.concat);
