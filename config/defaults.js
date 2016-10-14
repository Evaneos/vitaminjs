export default {
    server: {
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3000,
        middlewares: '__vitamin__/config/utils/emptyArray',
        ErrorPage: '__vitamin__/src/server/components/ErrorPage',
        onError: '__vitamin__/config/utils/defaultFunction',
        basePath: '',
        externalUrl: '',
        layout: '__vitamin__/src/server/components/HtmlLayout',
        actionDispatcher: '__vitamin__/config/utils/defaultFunction',
    },
    routes: '__vitamin__/config/utils/emptyArray',
    redux: {
        reducers: '__vitamin__/config/utils/emptyObject',
        middlewares: '__vitamin__/config/utils/emptyArray',
        enhancers: '__vitamin__/config/utils/emptyArray',
        stateSerializer: '__vitamin__/src/shared/defaultStateSerializer',
    },
    build: {
        // Relative to application root
        path: 'build',
        server: {
            filename: 'server_bundle.js',
        },
        client: {
            // The URL from which the all the public files should be made available
            // (similar to webpack output.publicPath config option)
            publicPath: '/assets',
            // Name of the build output for client bundle (relative to build.path)
            filename: 'client_bundle.[hash].js',
            secondaryEntries: { /*
                You can specify secondary endpoints for client here, for instance for
                adding a sw.js file for ServiceWorker. Or if you want to do code splitting.
                These endpoints will be transpiled (similar to https://webpack.github.io/docs/configuration.HTML#entry)
                For instance:
                'sw.js': './client/ServiceWorker.js'
            */},
        },
    },

    rootElementId: 'vitamin-app',
};
