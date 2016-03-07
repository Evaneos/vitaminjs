/* eslint no-console: 0  */
import app from './app';
import serverConfig from '../app_descriptor/server';
let server = app;

if (module.hot) {
    // Launch webpack-dev-server
    const webpack = require('webpack');
    const clientBuildConfig = require('../build_config/webpack.config.client')({
        hot: true,
        dev: true,
    });
    const WebpackDevServer = require('webpack-dev-server');
    let currentApp = app;
    const appWrapper = function appWrapper(...args) {
        return currentApp.callback()(...args);
    };
    server = new WebpackDevServer(webpack(clientBuildConfig), {
        noInfo: true,
        hot: true,
        setup(devServer) {
            return devServer.use(appWrapper);
        },
        features: ['middleware', 'setup'],
    });
    module.hot.accept(['./app'], () => {
        currentApp = require('./app').default;
    });
}

server.listen(serverConfig.port);
