const mergeWith = require('lodash.mergewith');
const { concat } = require('../utils');
const { config, createBabelLoader, createResolveConfigLoader } = require('./webpack.config.common');

module.exports = function testConfig(options) {
    return mergeWith({}, config(options), {
        entry: `${options.test}`,
        output: {
            filename: 'tests.js',
            path: options.server.buildPath,
        },
        module: {
            loaders: [
                createBabelLoader('client', true),
                createResolveConfigLoader(),
            ],
        },
        externals: {
            'react/addons': true,
            'react/lib/ExecutionEnvironment': true,
            'react/lib/ReactContext': true,
        },
    }, concat);
};
