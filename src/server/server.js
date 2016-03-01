/* eslint no-console: 0  */
import app from './app.js';
let server = app;

if (module.hot) {
    let webpack = require('webpack');
    let clientBuildConfig = require('../build_config/webpack.config.client')({
        hot : true,
        dev: true,
    });
    let WebpackDevServer = require('webpack-dev-server');
    let currentApp = app;
    const appWrapper = function appWrapper() {
        return currentApp.callback()(...arguments);
    };

    clientBuildConfig.entry.unshift('webpack-dev-server/client?http://localhost:8080', 'webpack/hot/dev-server');
    server = new WebpackDevServer(webpack(clientBuildConfig), {
        noInfo: true,
        hot: true,
        setup(devServer) {
            return devServer.use(appWrapper);
        },
        features: ['middleware', 'setup'],
    });
    module.hot.accept('./app.js', function () {
        currentApp = require('./app.js').default;
    });
}

server.listen(8080);
