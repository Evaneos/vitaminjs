import path from 'path'
import { createBabelLoaderConfig, APP_SOURCE_DIR, config } from './webpack.config.common.js'
import { appResolve, concat } from '../utils'
import mergeWith from 'lodash.mergewith'

module.exports = function(options) {
    return mergeWith({}, config(options), {
        entry: [path.join(APP_SOURCE_DIR, 'client.js')],
        output: {
            path: appResolve('public'),
            // TODO : put hash in name
            filename: 'bundle.js',
            publicPath: '/',
        },
        module: {
            loaders: [
                createBabelLoaderConfig('.babelrc.browser'),
            ],
        },
    }, concat);
};