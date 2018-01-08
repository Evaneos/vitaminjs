const { resolveConfigPath, resolveConfigModule } = require('vitaminjs-build/config/resolve');

module.exports = JSON.stringify({
    verbose: true,
    rootDir: resolveConfigPath('.'),
    setupFiles: [
        resolveConfigModule('vitaminjs-jest/src/setup')
    ],
    setupTestFrameworkScriptFile: 'jest-enzyme/lib/index.js',
    modulePaths: ['<rootDir>/node_modules'],
    transform: {
        '^.+\\.(js|jsx)$': "babel-jest",
    },
    moduleNameMapper: {
        "^React$": "<rootDir>/node_modules/react",
        [`\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$`]: '<rootDir>/__mocks__/fileMock.js',
        '\\.(css)$': 'identity-obj-proxy',
    },
    snapshotSerializers: [
        "enzyme-to-json/serializer",
    ]
})
