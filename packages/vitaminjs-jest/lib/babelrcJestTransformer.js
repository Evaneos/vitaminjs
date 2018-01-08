'use strict';

var _babelJest = require('babel-jest');

var _babelrc = require('vitaminjs-build/config/build/babelrc');

var _babelrc2 = _interopRequireDefault(_babelrc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const babelConfig = (0, _babelrc2.default)('server', { jest: true });

module.exports = (0, _babelJest.createTransformer)(babelConfig);