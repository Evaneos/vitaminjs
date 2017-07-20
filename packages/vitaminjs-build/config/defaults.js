export default {
    server: {
        buildPath: 'build',
        filename: 'server_bundle.js',
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3000,
        middlewares: '__vitamin_runtime__/src/shared/utils/emptyArray',
        ErrorPage: '__vitamin_runtime__/src/server/components/ErrorPage',
        onError: '__vitamin_runtime__/src/shared/utils/defaultFunction',
        layout: '__vitamin_runtime__/src/server/components/HTMLLayout',
        createInitAction: '__vitamin_runtime__/src/shared/utils/defaultFunction',
    },
    routes: '__vitamin_runtime__/src/shared/utils/emptyArray',
    basePath: '',

    // The URL from which the all the public files should be made available
    // (similar to webpack output.publicPath config option)
    // Name of the build output for client bundle (relative to build.path)
    publicPath: '/assets',
    servePublic: true,
    redux: {
        reducers: '__vitamin_runtime__/src/shared/utils/emptyObject',
        middlewares: '__vitamin_runtime__/src/shared/utils/emptyArray',
        enhancers: '__vitamin_runtime__/src/shared/utils/emptyArray',
        stateSerializer: '__vitamin_runtime__/src/shared/defaultStateSerializer',
    },
    client: {
        buildPath: 'public',
        filename: 'client_bundle.[hash].js',
        serviceWorker: false,
        targetBrowsers: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9', // react doesn't support ie < 9
        ],
    },
    filesPath: 'files',
    rootElementId: 'vitamin-app',
};
