// Brings ES6 to vitamin CLI and build modules (not src modules)
require('babel-register')({
    sourceRoot: process.env.VITAMIN_PATH,
    presets: ['es2015-node5', 'stage-1'],
    ignore: false,
    only: /vitaminjs\/(bin|config)/,
});
