// Add JSX & ES6 module to node

/* eslint strict: 0 */ 'use strict';
const path = require('path');
require('babel-register')({
    extends: path.join(__dirname, '..', 'build_config', '.babelrc.node'),
    plugins: [
        [require('babel-plugin-module-alias').default, [
            { src: path.join(process.cwd(), 'src'), expose: '__app__' },
        ]],
    ],
});
