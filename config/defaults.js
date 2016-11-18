export default {
    server: {
        buildPath: 'build',
        filename: 'server_bundle.js',
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3000,
        middlewares: '__vitamin__/config/utils/emptyArray',
        ErrorPage: '__vitamin__/src/server/components/ErrorPage',
        onError: '__vitamin__/config/utils/defaultFunction',
        layout: '__vitamin__/src/server/components/HtmlLayout',
        actionDispatcher: '__vitamin__/config/utils/defaultFunction',
    },
    routes: '__vitamin__/config/utils/emptyArray',
    basePath: '',

    // The URL from which the all the public files should be made available
    // (similar to webpack output.publicPath config option)
    // Name of the build output for client bundle (relative to build.path)
    publicPath: '/assets',
    redux: {
        reducers: '__vitamin__/config/utils/emptyObject',
        middlewares: '__vitamin__/config/utils/emptyArray',
        enhancers: '__vitamin__/config/utils/emptyArray',
        stateSerializer: '__vitamin__/src/shared/defaultStateSerializer',
    },
    client: {
        buildPath: 'public',
        filename: 'client_bundle.[hash].js',
        serviceWorker: false,
    },
    contextReplacements: [
        // https://github.com/webpack/webpack/tree/master/test/configCases/context-replacement/System.import
        // API:
        // [resourceRegExp, newContentResource, newContentRecursive, newContentRegExp]
        // Example:
        // ["/src\/locales$/", ".", { "./module1/fr-FR": "./module1/fr-FR.json" }]
    ],
    rootElementId: 'vitamin-app',
};
