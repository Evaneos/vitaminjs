import koa from 'koa';
import serve from 'koa-static';
import { renderToString } from 'react-dom/server';
import { appResolve } from './utils';
import { createMemoryHistory } from 'history';
import { match, RoutingContext } from 'react-router';
import { Provider } from 'react-redux';
import storeCreator from './storeCreator';

// Need commonJS for dynamic modules
const appDescriptor = require(appResolve('src', 'appDescriptor')).default;
const routes = appDescriptor.routes;

const app = koa();
app.use(serve(appResolve('public')));

app.use(function* () {
    const url = this.req.url;
    match({ routes, location: url }, (error, redirectLocation, renderProps) => {
        if (error) {
            this.status = 500;
            this.body = error.message;
        } else if (redirectLocation) {
            this.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
            this.status = 200;
            this.body = renderBody(url, renderProps);
        } else {
            this.status = 404;
            this.body = 'Not found';
        }
    });
});

function renderBody(url, renderProps) {
    const history = createMemoryHistory(url);
    const store = storeCreator(appDescriptor.reducer, history);
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

app.listen(3000);
