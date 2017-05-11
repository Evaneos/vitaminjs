require('../utils/transpile');

const createTransformer = require('babel-jest').createTransformer;
const babelrc = require('../babelrc').default;

module.exports = createTransformer(babelrc('test', { dev: true }));
