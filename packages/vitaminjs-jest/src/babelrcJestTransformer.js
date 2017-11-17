import { createTransformer } from 'babel-jest';
import createBabelConfig from 'vitaminjs-build/config/build/babelrc';

// TODO we should use babelConfig from vitaminjs-build package
// to make sure the plugin and the package are always in sync.

/*const babelConfig = {
    presets: [
        ['env', {
            // Be careful to keep the node version compatible with engines.node in package.json
            targets: { node: '6.5' },
        }],
        'react'
    ],
    plugins: ['react-require']
};*/

const babelConfig = createBabelConfig('server', { jest: true });

module.exports = createTransformer(babelConfig);
