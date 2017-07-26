import { createTransformer } from 'babel-jest';

const babelConfig = {
    presets: [
        ['env', {
            targets: { node: 'current' },
        }],
        'react'
    ],
    plugins: ['react-require']
};

module.exports = createTransformer(babelConfig);