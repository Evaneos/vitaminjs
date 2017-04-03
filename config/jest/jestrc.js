import { appResolve, vitaminResolve } from '../utils/index';

export default JSON.stringify({
    roots: [appResolve()],
    setupTestFrameworkScriptFile: 'jest-enzyme/lib/index.js',
    modulePaths: [vitaminResolve('node_modules'), appResolve('node_modules')],
    transform: {
        '^.+\\.(js|jsx)$': vitaminResolve('config', 'jest', 'babelrcJestTransformer.js'),
    },
    transformIgnorePatterns: ['/node_modules/(?!vitaminjs).*'],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
        '\\.(css|less)$': 'identity-obj-proxy',
    },
});
