import koa from 'koa';
import serve from 'koa-static';
import {createServer} from 'http';
import {renderToString} from 'react-dom/server';
import path from 'path';
import { appResolve } from './utils';

// Redux
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import assert from 'assert';

// Need commonJS for dynamic modules
const serverDescriptor = require(appResolve('src', 'app_descriptor')).default;
assert(React.isValidElement(serverDescriptor.rootComponent));


const app = koa();
app.use(serve(appResolve('public')));
app.use(function *(){
    const store = createStore(_ => _)
    const html = renderToString(
        <Provider store={store}>
            {serverDescriptor.rootComponent}
        </Provider>
    );

    this.body = renderFullPage(html, store.getState());
});

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