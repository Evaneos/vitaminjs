const chalk = require('chalk');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const fs = require('fs');
const ProgressBar = require('progress');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const { default: parseConfig, rcPath: configRcPath } = require('../config');

const BUILD_FAILED = Symbol('BUILD_FAILED');

const throttle = (callback, throttleTime = 400) => {
    let t;
    return () => {
        if (t) clearTimeout(t);
        t = setTimeout(callback, throttleTime);
    };
};

const buildCallback = (resolve, reject) => (err, stats) => {
    if (err || stats.hasErrors()) {
        return reject && reject(BUILD_FAILED);
    }
    return resolve(stats);
};

const createCompiler = (webpackConfig, message, options) => {
    const compiler = webpack(webpackConfig);
    if (process.stdout.isTTY) {
        const bar = new ProgressBar(
            `${chalk.blue(`\uD83D\uDD50 Building ${message}...`)} :percent [:bar]`,
            { incomplete: ' ', total: 60, clear: true, stream: process.stdout }
        );
        compiler.apply(new ProgressPlugin((percentage, msg) => {
            bar.update(percentage, { msg });
        }));
        compiler.apply(new FriendlyErrorsWebpackPlugin({
            clearConsole: !!options.hot,
        }));
    }

    return compiler;
};

const commonBuild = (createWebpackConfig, message, options, hotCallback, restartServer) => {
    const createCompilerCommonBuild = () => {
        const config = parseConfig();
        const webpackConfig = createWebpackConfig(Object.assign(
            {},
            options,
            { dev: process.env.NODE_ENV !== 'production' },
            config
        ));
        const compiler = createCompiler(webpackConfig, message, options);
        return { compiler, config };
    };

    if (!options.hot) {
        const { compiler, config } = createCompilerCommonBuild();
        return new Promise((resolve, reject) => (
            compiler.run(buildCallback(buildStats => resolve({ config, buildStats }), reject))
        ));
    }

    let webpackWatcher;
    const watch = () => (
        new Promise((resolve) => {
            const { compiler, config } = createCompilerCommonBuild();
            const callbackWatch = buildCallback((buildStats) => {
                hotCallback(config);
                resolve({ config, buildStats });
            });
            webpackWatcher = compiler.watch({}, callbackWatch);
        })
    );

    fs.watchFile(configRcPath, throttle(() => {
        webpackWatcher.close(() => watch().then(restartServer));
    }));

    return watch();
};

module.exports = {
    BUILD_FAILED,
    commonBuild,
};
