import { createMemoryHistory } from 'history';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, RoutingContext } from 'react-router';
import storeCreator from './storeCreator';
import { appResolve } from './utils';

export default function renderer(appDescriptor) {
    return function* renderer() {
        const url = this.req.url;
        match({ routes: appDescriptor.routes, location: url }, (error, redirectLocation, renderProps) => {
            if (error) {
                this.status = 500;
                this.body = error.message;
            } else if (redirectLocation) {
                this.redirect(redirectLocation.pathname + redirectLocation.search);
            } else if (renderProps) {
                this.status = 200;
                const history = createMemoryHistory(url);
                const store = storeCreator(appDescriptor.reducer, history);
                this.body = renderBody(store, renderProps);
            } else {
                // TODO yield down the middleware chain
                this.status = 404;
                this.body = 'Not found';
            }
        });
    };
}

function renderBody(store, renderProps) {
    const html = renderToString(
        <Provider store={store}>
            <RoutingContext {...renderProps} />
        </Provider>
    );
    return renderFullPage(html, store.getState());
}

function renderFullPage(html, initialState) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>Redux Universal Example</title>
        </head>
        <body>
            <div id="app">${html}</div>
            <script>
                window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
            </script>
            <script src="bundle.js"></script>
        </body>
    </html>
    `;
}
