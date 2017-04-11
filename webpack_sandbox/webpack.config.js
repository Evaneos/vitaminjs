const StripNodePlugin = require('./StripNodePlugin');

module.exports = {
    entry: [
        './browser',
        './node',
    ],
    output: {
        filename: 'index.js',
    },
    plugins: [
        new StripNodePlugin(),
    ]
};
