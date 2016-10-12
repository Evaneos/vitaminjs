import mergeWith from 'lodash.mergewith';
import appConfig from '../index';
import { vitaminResolve, concat } from '../utils';
import { config, createBabelLoaderConfig } from './webpack.config.common';

function testConfig(options) {
    return mergeWith({}, config(options), {
        entry: `${appConfig.test}`,
        output: {
            filename: 'tests.js',
            path: appConfig.server.buildPath,
        },
        module: {
            loaders: [
                createBabelLoaderConfig('client'),
                // The following loader will resolve the config to its final value during the build
                {
                    test: vitaminResolve('config/index'),
                    loader: vitaminResolve('config/build/requireLoader'),
                }],
        },
        externals: {
            'react/addons': true,
            'react/lib/ExecutionEnvironment': true,
            'react/lib/ReactContext': true,
        },
    }, concat);
}

module.exports = testConfig;
