const fs = require('fs');
const webpack = require('webpack');
const parseConfig = require('../config').default;
const configRcPath = require('../config').rcPath;

const BUILD_FAILED = Symbol('BUILD_FAILED');

function buildOptions(appOptions, baseOptions) {
    return Object.assign({}, baseOptions, appOptions, {
        dev: process.env.NODE_ENV !== 'production'
    });
}

function watch(compiler, callback, restartServer) {
    // trigger watch and attach listeners
    const watcher = compiler.watch({}, callback);

    // FIXME: disabled: refresh on vitaminrc change event & should not be there => restart server 🤯
    // fs.watchFile(configRcPath, () => {
    //     watcher.close(() => watch(compiler, callback, restartServer));
    //     restartServer(); // TODO: must wait for build to finish
    // });
}

function run(compiler, callback) {
    // trigger run and attach listeners
    compiler.run(callback);
}

function compile(
    buildWebpackConfig,
    message,
    options,
    hotCallback,
    restartServer
) {
    const onSuccess = hotCallback;
    const onFailure = () => {};

    const appConfig = parseConfig();
    const webpackConfig = buildWebpackConfig(buildOptions(appConfig, options));

    const compiler = webpack(webpackConfig);

    // FIXME: exec sould not be trigger here (hot logic)
    const exec = options.hot ? watch : run;

    return new Promise((resolve, reject) => {
        exec(compiler, (err, stats) => {
            if (err || stats.hasErrors()) {
                if ('function' === typeof onFailure) onFailure();
                return reject(BUILD_FAILED);
            }
            if ('function' === typeof onSuccess) onSuccess();
            // FIXME: app config should not be exposed by compiler
            return resolve({ buildStats: stats, config: appConfig });
        });
    });
}

module.exports = {
    compile,
    BUILD_FAILED
};
