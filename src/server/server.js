/* eslint-disable global-require, no-console */

import { parse as parseUrl } from 'url';
import koa from 'koa';
import express from 'express';
import chalk from 'chalk';
import fetch from 'node-fetch';
import readline from 'readline';

import app from './app';
import config, { moduleMap } from '../../config';

global.fetch = fetch;

function hotReloadServer() {
    const server = express();
    const webpack = require('webpack');
    const clientBuildConfig = require('../../config/build/webpack.config.client')({
        hot: true,
        dev: true,
        ...config,
        moduleMap,
    });

    const compiler = webpack(clientBuildConfig);
    let clientBuilt = false;
    const parsedPublicPath = parseUrl(config.publicPath).pathname || '';
    server.use(require('webpack-dev-middleware')(compiler, {
        quiet: true,
        noInfo: true,
        publicPath: parsedPublicPath,
        reporter: (stats) => {
            if (stats.hasErrors || clientBuilt) {
                return;
            }
            clientBuilt = true;
            process.stdout.write(`\x1b[0G${chalk.green('\u2713')
                } Client bundle(s) successfully ${chalk.bold('built in memory')}\n\n`,
            );
        },
        serverSideRender: true,
    }));

    const hmrPath = `${parsedPublicPath}/__webpack_hmr`;
    server.use(require('webpack-hot-middleware')(compiler, {
        log: () => {},
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

const { port, host } = config.server;
mountedServer.use(config.basePath, appServer());

mountedServer.listen(port, host, () => {
    readline.clearLine(process.stdout);
    readline.cursorTo(0, process.stdout);
    process.stdout.write(`\x1b[0G${chalk.green('\u2713')} Server listening on: ${
        chalk.bold.underline(`http://${host}:${port}${config.basePath}`)
    }\n`);
    if (module.hot) {
        console.log(`${chalk.green('\u2713')} ${chalk.bold('Hot module reload')} activated`);
        process.stdout.write(`\x1b[0G${
            chalk.blue('\uD83D\uDD50  Building client bundle [in memory]...')
        }`);
    }
});

