import { appResolve, fileRegex, vitaminResolve } from '../utils';

export default JSON.stringify({
    roots: [appResolve()],
    setupTestFrameworkScriptFile: 'jest-enzyme/lib/index.js',
    modulePaths: [vitaminResolve('node_modules'), appResolve('node_modules')],
    transform: {
        '^.+\\.(js|jsx)$': vitaminResolve('config', 'jest', 'babelrcJestTransformer.js'),
    },
    transformIgnorePatterns: ['/node_modules/(?!vitaminjs).*'],
    moduleNameMapper: {
        [`\\${fileRegex}`]: '<rootDir>/__mocks__/fileMock.js',
        '\\.(css)$': 'identity-obj-proxy',
    },
});
