/* eslint-disable indent,global-require,no-console */

import { parse as parseUrl } from 'url';
import Koa from 'koa';
import express from 'express';
import chalk from 'chalk';
import fetch from 'node-fetch';
import readline from 'readline';
import httpGracefulShutdown from 'http-graceful-shutdown';

import config from '__vitamin_runtime_config__';
import appMiddleware from './appMiddleware';

global.fetch = fetch;

let currentApp = appMiddleware;
function appServer() {
    const app = new Koa();
    app.use(
        process.env.NODE_ENV === 'production' ? currentApp
            // ecapsulate app for hot reload
            : (ctx, next) => currentApp(ctx, next)
    );
    return app.callback();
}

const mountedServer = express();

if (process.env.NODE_ENV !== 'production' && module.hot) {
    const webpackClientConfig = require('vitaminjs-build/config/build/webpack.config.client');
    const hotReloadServer = () => {
        const app = express();
        const webpack = require('webpack');
        const clientBuildConfig = webpackClientConfig({
            hot: true,
            dev: true,
            ...config,
        });

        const compiler = webpack(clientBuildConfig);
        let clientBuilt = false;
        const parsedPublicPath = parseUrl(config.publicPath).pathname || '';
        app.use(require('webpack-dev-middleware')(compiler, {
            quiet: true,
            noInfo: true,
            publicPath: parsedPublicPath,
            reporter: (stats) => {
                if (stats.hasErrors || clientBuilt) {
                    return;
                }
                clientBuilt = true;
                process.stdout.write(
                    `\x1b[0G${chalk.green('\u2713')
                    } Client bundle(s) successfully ${chalk.bold('built in memory')}\n\n`
                );
            },
            serverSideRender: true,
        }));

        const hmrPath = `${parsedPublicPath}/__webpack_hmr`;
        app.use(require('webpack-hot-middleware')(compiler, {
            log: () => {},
            path: hmrPath,
            reload: true,
        }));

        return app;
    };

    mountedServer.use(hotReloadServer());
    module.hot.accept('./appMiddleware', () => {
        try {
            currentApp = require('./appMiddleware').default;
        } catch (e) {
            console.error(e);
        }
    });
}

mountedServer.use(config.basePath, appServer());

// Keep using config.server.port & config.server.host to avoid breaking changes.
const port = process.env.PORT || config.server.defaultPort || config.server.port;
const host = process.env.HOST || config.server.defaultHost || config.server.host;

const server = mountedServer.listen(port, host, () => {
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

httpGracefulShutdown(server, {
    signals: 'SIGINT SIGTERM SIGQUIT',
    timeout: 15000,
    development: process.env.NODE_ENV !== 'production',
    callback: () => {},
});
