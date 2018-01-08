const { createTransformer } = require('babel-jest');
const createBabelConfig = require('vitaminjs-build/config/build/babelrc');

const babelConfig = createBabelConfig('server', { jest: true });

module.exports = createTransformer(babelConfig);
