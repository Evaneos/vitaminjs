'use strict';

var _babelJest = require('babel-jest');

const babelConfig = {
    presets: [['env', {
        targets: { node: 'current' }
    }], 'react'],
    plugins: ['react-require']
};

module.exports = (0, _babelJest.createTransformer)(babelConfig);