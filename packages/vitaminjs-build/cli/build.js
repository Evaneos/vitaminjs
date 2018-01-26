const chalk = require('chalk');
const webpackConfigClient = require('../config/build/webpack.config.client');
const webpackConfigServer = require('../config/build/webpack.config.server');
const { commonBuild } = require('./commonBuild');

module.exports = (options, hotCallback, restartServer) => (options.hot ?
    commonBuild(
        webpackConfigServer,
        `server bundle ${chalk.bold('[hot]')}`,
        options,
        hotCallback,
        restartServer
    )
    :
    commonBuild(webpackConfigClient, 'client bundle(s)', options)
        .then(({ buildStats }) => commonBuild(
            webpackConfigServer, 'server bundle...',
            // Cannot build in parallel because server-side rendering
            // needs client bundle name in the html layout for script path
            Object.assign(
                {},
                options,
                { assetsByChunkName: buildStats.toJson().assetsByChunkName }
            )
        ))
        .then(({ config }) => restartServer && restartServer(config))
);
