import { resolveConfigPath, resolveConfigModule } from 'vitaminjs-build/config/resolve';

export default JSON.stringify({
    rootDir: process.cwd(),
    setupTestFrameworkScriptFile: 'jest-enzyme/lib/index.js',
    modulePaths: [resolveConfigPath('vitaminjs-runtime/node_modules'), resolveConfigPath('node_modules')],
    transform: {
        '^.+\\.(js|jsx)$': resolveConfigModule('vitaminjs-jest/lib/babelrcJestTransformer.js'),
    },
    transformIgnorePatterns: ['/node_modules/(?!vitaminjs).*'],
    moduleNameMapper: {
        [`\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$`]: '<rootDir>/__mocks__/fileMock.js',
        '\\.(css)$': 'identity-obj-proxy',
    },
})
