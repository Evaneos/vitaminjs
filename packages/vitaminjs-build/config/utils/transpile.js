// Brings ES6 to vitamin CLI and build modules (not src modules)
require('babel-register')({
    sourceRoot: process.env.VITAMIN_PATH,
    presets: [['env', { targets: { node: 'current' } }], 'stage-1'],
    // FIXME Seems useless
    ignore: false,
    // FIXME Try to consolidate with babel-loader config of prebuild vitamin packages
    // only: /vitaminjs-(?:runtime|build\/(?:bin|config|stdio))/
    only: /vitaminjs-(?:runtime|build\/(?:bin|config))/
});
