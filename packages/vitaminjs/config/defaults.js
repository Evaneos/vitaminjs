export default {
    server: {
        buildPath: 'build',
        filename: 'server_bundle.js',
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3000,
        middlewares: '__vitamin__/config/utils/emptyArray',
        ErrorPage: '__vitamin__/src/server/components/ErrorPage',
        onError: '__vitamin__/config/utils/defaultFunction',
        layout: '__vitamin__/src/server/components/HTMLLayout',
        createInitAction: '__vitamin__/config/utils/defaultFunction',
    },
    routes: '__vitamin__/config/utils/emptyArray',
    basePath: '',

    // The URL from which the all the public files should be made available
    // (similar to webpack output.publicPath config option)
    // Name of the build output for client bundle (relative to build.path)
    publicPath: '/assets',
    servePublic: true,
    redux: {
        reducers: '__vitamin__/config/utils/emptyObject',
        middlewares: '__vitamin__/config/utils/emptyArray',
        enhancers: '__vitamin__/config/utils/emptyArray',
        stateSerializer: '__vitamin__/src/shared/defaultStateSerializer',
        initialStateKey: '__INITIAL_STATE__',
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
    plugins: [],
    rootElementId: 'vitamin-app',
};
