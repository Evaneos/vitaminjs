const chalk = require('chalk');
const webpackConfigClient = require('../config/build/webpack.config.client');
const webpackConfigServer = require('../config/build/webpack.config.server');
const { compile } = require('../cli/compile');

module.exports = (options, hotCallback, restartServer) => (options.hot ?
    compile(
        webpackConfigServer,
        `server bundle ${chalk.bold('[hot]')}`,
        options,
        hotCallback,
        restartServer
    )
    :
    compile(webpackConfigClient, 'client bundle(s)', options)
        .then(({ buildStats }) => compile(
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
