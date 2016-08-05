import mergeWith from 'lodash.mergewith';
import appConfig from '../index';
import { config } from './webpack.config.common';

function testConfig(options) {
    return mergeWith({}, config(options), {
        entry: `${appConfig.test}`,
        output: {
            filename: 'tests.js',
        },
    });
}

module.exports = testConfig;
