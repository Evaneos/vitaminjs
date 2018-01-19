const mergeWith = require('lodash.mergewith');
const { vitaminResolve, concat } = require('../utils');
const { config, createBabelLoader } = require('./webpack.config.common');

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
                // The following loader will resolve the config to its final value during the build
                {
                    test: vitaminResolve('config/index'),
                    loader: vitaminResolve('config/build/resolveConfigLoader'),
                }],
        },
        externals: {
            'react/addons': true,
            'react/lib/ExecutionEnvironment': true,
            'react/lib/ReactContext': true,
        },
    }, concat);
}
