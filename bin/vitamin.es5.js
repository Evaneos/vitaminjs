#!/usr/bin/env node

// Add ES6 to vitamin cli and build

/* eslint no-var: 0 */
var path = require('path');
process.env.VITAMIN_PATH = path.resolve(__dirname, '..');
if (process.env.NODE_ENV === 'production') {
    process.env.BABEL_DISABLE_CACHE = 1;
}
require('../config/utils/transpile');
module.exports = require('./vitamin.js');
