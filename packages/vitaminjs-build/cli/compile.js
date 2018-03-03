const debug = require('debug')('vitamin:compile');

const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

const parseConfig = require('../config').default;

const BUILD_FAILED = Symbol('BUILD_FAILED');

function buildOptions(appOptions, baseOptions) {
    return Object.assign({}, baseOptions, appOptions, {
        dev: process.env.NODE_ENV !== 'production'
    });
}

function watch(compiler, callback) {
    debug('compiler watch');
    compiler.apply(new FriendlyErrorsWebpackPlugin());
    compiler.watch({}, (...args) => {
        debug('files changed, running compiler');
        callback(...args);
    });
}

function run(compiler, callback) {
    debug('compiler run');
    compiler.run(callback);
}

function compile(buildWebpackConfig, target, options, onSuccess, onError) {
    debug('build application config');
    const appConfig = parseConfig();

    debug('build %s webpack config', target);
    const webpackConfig = buildWebpackConfig(buildOptions(appConfig, options));

    const compiler = webpack(webpackConfig);
    return new Promise((resolve, reject) => {
        (options.hot ? watch : run)(compiler, (error, stats) => {
            if (error || stats.hasErrors()) {
                debug('build %s failed', target);
                if (typeof onError === 'function') onError();
                return reject(BUILD_FAILED);
            }
            debug('build %s succeed', target);
            if (typeof onSuccess === 'function') onSuccess();
            return resolve({ stats, compiler });
        });
    });
}

module.exports = {
    compile,
    BUILD_FAILED
};
