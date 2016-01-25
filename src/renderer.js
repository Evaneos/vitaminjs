import { createMemoryHistory } from 'history';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, RoutingContext } from 'react-router';
import storeCreator from './storeCreator';
<<<<<<< ea3c0315fa9c7d6e7d5a179ad4cb144eb2138f1a
import { appResolve } from './utils';
import { authenticationSuccess } from './actions';
=======
>>>>>>> cleaning and adding loaders
import CSSProvider from'./components/CSSProvider';

export default function renderer(appDescriptor) {
    return function* renderer() {
        const url = this.req.url;
        match({ routes: appDescriptor.routes, location: url },
        (error, redirectLocation, renderProps) => {
            if (error) {
                this.status = 500;
                this.body = error.message;
            } else if (redirectLocation) {
                this.redirect(redirectLocation.pathname + redirectLocation.search);
            } else if (renderProps) {
                this.status = 200;
                const history = createMemoryHistory(url);
                const store = storeCreator(appDescriptor.reducer, history);

                if (this.state.token) {
                    store.dispatch(authenticationSuccess());
                }

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
    const css = [];
    const insertCss = (styles) => css.push(styles._getCss());
    const html = renderToString(
        <Provider store={store}>
            <CSSProvider insertCss={insertCss}>
                <RoutingContext {...renderProps} />
            </CSSProvider>
        </Provider>
    );
    return renderFullPage(html, store.getState(), css);
}

function renderFullPage(html, initialState, css) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>Redux Universal Example</title>
            <style type="text/css">${css.join('')}</style>
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
