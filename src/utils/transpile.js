// Add JSX & ES6 module to node

/* eslint strict: 0 */ 'use strict';
const path = require('path');
require('babel-register')({
    extends: path.join(__dirname, '..', 'config', '.babelrc.node'),
});
