import koa from 'koa';
import serve from 'koa-static';
import {createServer} from 'http';
import {renderToString} from 'react-dom/server';
import path from 'path';
import { appResolve } from './utils';

import { match, RoutingContext } from 'react-router';

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import assert from 'assert';

// Need commonJS for dynamic modules
const serverDescriptor = require(appResolve('src', 'app_descriptor')).default;

const routes = serverDescriptor.routes;

let reducer = serverDescriptor.reducer;
reducer = reducer || (state => state);
assert(typeof reducer === 'function');

const app = koa();
app.use(serve(appResolve('public')));

app.use(function *(){
    match({ routes, location: this.req.url }, (error, redirectLocation, renderProps) => {
        if (error) {
            this.status = 500
            this.body = error.message;
        } else if (redirectLocation) {
            this.redirect(redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
            this.status = 200;
            this.body = renderBody(renderProps);
        } else {
            this.status = 404
            this.body = 'Not found';
        }
    })
});

function renderBody(renderProps) {
    const store = createStore(reducer);
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
    `
}

app.listen(3000);