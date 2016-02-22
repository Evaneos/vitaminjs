import { createMemoryHistory } from 'history';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, RoutingContext } from 'react-router';

import { authenticationSuccess } from '../login/actions';
import appConfig from '../appDescriptor/app';
import CSSProvider from '../components/CSSProvider';
import { create as createStore } from '../store';

export default function renderer() {
    return function* rendererMiddleware() {
        const url = this.req.url;
        match({ routes: appConfig.routes, location: url },
            (error, redirectLocation, renderProps) => {
                if (error) {
                    this.status = 500;
                    this.body = error.message;
                } else if (redirectLocation) {
                    this.redirect(redirectLocation.pathname + redirectLocation.search);
                } else if (renderProps) {
                    this.status = 200;
                    const history = createMemoryHistory(url);
                    const store = createStore(history);

                    if (this.state.token) {
                        store.dispatch(authenticationSuccess());
                    }

                    this.body = renderBody(store, renderProps, appConfig.stateSerializer);
                } else {
                    // TODO yield down the middleware chain
                    this.status = 404;
                    this.body = 'Not found';
                }
            });
    };
}


function renderBody(store, renderProps, stateSerializer) {
    const css = [];
    const insertCss = (styles) => css.push(styles._getCss());
    const RootComponent = appConfig.rootComponent;
    const html = renderToString(
        <Provider store={store}>
            <CSSProvider insertCss={insertCss}>
                <RootComponent>
                    <RoutingContext {...renderProps} />
                </RootComponent>
            </CSSProvider>
        </Provider>
    );
    return renderFullPage(html, stateSerializer.stringify(store.getState()), css);
}

function renderFullPage(html, serializedState, css) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>Redux Universal Example</title>
            <style type="text/css">${css.join('')}</style>
        </head>
        <body>
            <div id="react-app">${html}</div>
            <script>
                window.__INITIAL_STATE__ = ${JSON.stringify(serializedState)}
            </script>
            <script src="/bundle.js"></script>
            </body>
    </html>
    `;
}
