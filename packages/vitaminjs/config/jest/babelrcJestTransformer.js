require('../utils/transpile');

// eslint-disable-next-line import/no-extraneous-dependencies
const createTransformer = require('babel-jest').createTransformer;
const babelrc = require('../babelrc').default;

module.exports = createTransformer(babelrc('test', { dev: true }));
