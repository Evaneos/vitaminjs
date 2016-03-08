/* eslint no-console: 0  */
import koa from 'koa';
import express from 'express';
import serverConfig from '../app_descriptor/server';
import buildConfig from '../app_descriptor/build';
import app from './app';

function hotReloadServer() {
    const server = express();
    const webpack = require('webpack');
    const clientBuildConfig = require('../build_config/webpack.config.client')({
        hot: true,
        dev: true,
    });
    const hmrPath = `${buildConfig.basename}/__webpack_hmr`;
    clientBuildConfig.entry.unshift(`webpack-hot-middleware/client?path=${hmrPath}`);
    const compiler = webpack(clientBuildConfig);
    server.use(require('webpack-dev-middleware')(compiler, {
        quiet: true,
        publicPath: clientBuildConfig.output.publicPath,
    }));
    server.use(require('webpack-hot-middleware')(compiler, {
        path: hmrPath,
        quiet: true,
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
    module.hot.accept(['./app'], () => {
        currentApp = require('./app').default;
    });
}
mountedServer.use(buildConfig.basename, appServer());
mountedServer.listen(serverConfig.port);
