const webpackConfigClient = require('../config/build/webpack.config.client');
const webpackConfigServer = require('../config/build/webpack.config.server');
const { compile, BUILD_FAILED } = require('../cli/compile');

function buildAndWatch(options, onChange) {
    return compile(webpackConfigServer, 'server', options, onChange);
}

function buildAndExit(options, onSuccess) {
    return new Promise((resolve, reject) => {
        compile(webpackConfigClient, 'client', options)
            .then(({ stats, compiler }) => {
                const assetsByChunkName = stats.toJson().assetsByChunkName;
                const serverOptions = Object.assign({}, options, {
                    assetsByChunkName
                });

                compile(webpackConfigServer, 'server', serverOptions)
                    .then(resolve)
                    .catch(err => {
                        if (err !== BUILD_FAILED) {
                            reject(err.stack || err);
                        }
                        process.exit(1);
                    });
            })
            .catch(err => {
                if (err !== BUILD_FAILED) {
                    reject(err.stack || err);
                }
                process.exit(1);
            });
    });
}

module.exports = {
    buildAndWatch,
    buildAndExit
};
