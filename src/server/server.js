/* eslint-disable global-require, no-console */

import koa from 'koa';
import express from 'express';
import chalk from 'chalk';
import config from '../../config';
import app from './app';

function hotReloadServer() {
    const server = express();
    const webpack = require('webpack');
    const clientBuildConfig = require('../../config/build/webpack.config.client')({
        hot: true,
        dev: true,
    });

    const compiler = webpack(clientBuildConfig);
    server.use(require('webpack-dev-middleware')(compiler, {
        quiet: true,
        publicPath: clientBuildConfig[0].output.publicPath,
        stats: {
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false,
            modules: false,
            children: true,
            version: true,
            cached: false,
            cachedAssets: false,
            reasons: false,
            source: false,
            errorDetails: false,
            colors: true,
        },
    }));

    const hmrPath = `${config.server.basePath + config.build.client.publicPath}/__webpack_hmr`;
    server.use(require('webpack-hot-middleware')(compiler, {
        path: hmrPath,
        reload: true,
    }));

    return server;
}

let currentApp = app;
function appServer() {
    const server = koa();
    const appWrapper = function* appWrapper(next) {
        yield currentApp.call(this, next);
    };
    server.use(appWrapper);
    return server.callback();
}

const mountedServer = express();
if (module.hot) {
    mountedServer.use(hotReloadServer());
    module.hot.accept('./app', () => {
        try {
            currentApp = require('./app').default;
        } catch (e) {
            console.error(e);
        }
    });
}

const { basePath, port, host } = config.server;
mountedServer.use(basePath, appServer());


mountedServer.listen(port, host, () => {
    process.stdout.write(chalk.blue(`\x1b[0GServer listening on ${
        chalk.bold.underline(`http://${host}:${port}${basePath}`)
    }\n\n`));
});

