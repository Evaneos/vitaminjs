#!/usr/bin/env node
/* eslint no-var: 0 */
var path = require('path');
process.env.VITAMIN_PATH = path.resolve(__dirname, '..');
require('../src/utils/transpile.js');
module.exports = require('./vitamin.js');
