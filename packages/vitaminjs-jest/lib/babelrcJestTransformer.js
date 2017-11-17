'use strict';

var _babelJest = require('babel-jest');

var _babelrc = require('vitaminjs-build/config/build/babelrc');

var _babelrc2 = _interopRequireDefault(_babelrc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

const babelConfig = (0, _babelrc2.default)('server', { jest: true });

module.exports = (0, _babelJest.createTransformer)(babelConfig);