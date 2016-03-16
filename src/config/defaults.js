export default {
    server: {
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3000,
        middlewares: '__fondation__/src/utils/emptyArray',
        basePath: '',
    },
    routes: '__fondation__/src/utils/emptyArray',
    redux: {
        reducer: '__fondation__/src/utils/identityFunction',
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
            // For which URL the bundle should be made available (relative to server.basePath)
            // DISCUSSION:
            // - If it's made available in static path with a symlink, should it be relative server.static.path instead?
            // - We can serve it from build.path using a middleware without touching to filesystem.
            publicPath: '/assets/', // was build.js#client.path
        },
    },

    // TO REFACTOR, I DONT LIKE THIS
    init: '__fondation__/src/utils/identityFunction',
    renderFullPage: true,
    rootElementId: 'fondation-app',
};
