export default {
    server: {
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3000,
        middlewares: '__vitamin__/config/utils/emptyArray',
        basePath: '',
        externalUrl: '',
    },
    routes: '__vitamin__/config/utils/emptyArray',
    redux: {
        reducers: '__vitamin__/config/utils/emptyObject',
        middlewares: '__vitamin__/config/utils/emptyArray',
        state: {
            serializer: '__vitamin__/src/shared/defaultStateSerializer',
        },
    },
    build: {
        // Relative to application root
        path: 'build',
        server: {
            filename: 'server_bundle.js',
        },
        client: {
            // Name of the build output for client bundle (relative to build.path)
            filename: 'client_bundle.js',
            // For which URL the bundle should be made available
            // (similar to webpack output.publicPath config option)
            publicPath: '/assets',
        },
    },

    // TODO REFACTOR, I DONT LIKE THIS
    init: '__vitamin__/config/utils/identityFunction',
    renderFullPage: true,
    rootElementId: 'vitamin-app',
};
