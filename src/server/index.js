'use strict';
const MemoryFileSystem = require('memory-fs');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const nodeConfig = require('../../webpack.config.node.js');
const browserConfig = require('../../webpack.config.browser.js');
const universalConf = require('../../webpack.config.universal.js');

let app = () => null;
let server;
const nodeHotReload = (compiler) => {
    const fs = new MemoryFileSystem();
    compiler.outputFileSystem = fs;

    const handleNodeRecompile = (args) => {
        if (!args || !args.compilation) {
            return;
        }

        const outputPath = args.compilation.compiler.outputPath + '/server.js';

        if (!fs.statSync(outputPath).isFile()) {
            console.log('Filenotfound');
            return;
        }
        const appString = fs.readFileSync(outputPath).toString();
        try {
            app = eval(appString).default.callback();
        } catch (e) {
            console.log('Error while loading app');
            throw e;
        }
    };
    compiler.plugin('done', handleNodeRecompile);
    compiler.watch({}, () => console.log('Server app built. Server hot reload activated.'));
};

if (universalConf.HOT) {
    const appWrapper = function () { return app(...arguments); };
    browserConfig.entry.unshift('webpack-dev-server/client?http://localhost:8080', 'webpack/hot/dev-server');
    nodeHotReload(webpack(nodeConfig));
    server = new WebpackDevServer(webpack(browserConfig), {
        noInfo: true,
        hot: true,
        setup(devServer) {
            return devServer.use(appWrapper);
        },
        features: ['middleware', 'setup'],
    });
} else {
    const serverPath = path.join(nodeConfig.output.path, nodeConfig.output.filename);
    try {
        server = require(serverPath).default;
    } catch (e) {
        console.error(`Cannot find module ${serverPath}. You may have to build it before with fondation build-dev`);
        console.error(e);
    }
}
if (server) {
    console.log('Launching server on http://localhost:8080');
    server.listen(8080);
}
