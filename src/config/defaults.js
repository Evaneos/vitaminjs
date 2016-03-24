export default {
    server: {
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3000,
        middlewares: '__fondation__/src/utils/emptyArray',
        basePath: '',
    },
    routes: '__fondation__/src/utils/emptyArray',
    redux: {
        reducers: '__fondation__/src/utils/emptyObject',
        middlewares: '__fondation__/src/utils/emptyArray',
        state: {
            serializer: '__fondation__/src/shared/defaultStateSerializer',
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
            publicPath: '/assets/', // was build.js#client.path
        },
    },

    // TO REFACTOR, I DONT LIKE THIS
    init: '__fondation__/src/utils/identityFunction',
    renderFullPage: true,
    rootElementId: 'fondation-app',
};
