import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext } from 'react-router';
import Helmet from 'react-helmet';

import appConfig from '../../app_descriptor/app';
import serverConfig from '../../app_descriptor/server';
import CSSProvider from '../../shared/components/CSSProvider';

const renderFullPage = (html, css, head) => `
    <!doctype html>
    <html>
        <head>
            ${head.title.toString()}
            ${head.meta.toString()}
            ${head.link.toString()}
            ${head.base.toString()}
            <style type="text/css">${css.join('')}</style>
        </head>
        <body>
            ${html}
        </body>
    </html>
`;

const renderAppContainer = (html, initialState, script) => `
    <div id="fondation-app">${html}</div>
    <div id="fondation-assets">
        <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        ${script.toString()}
        <script async src="/bundle.js"></script>
    </div>
`;

function render(store, renderProps) {
    const css = [];
    const insertCss = (styles) => css.push(styles._getCss());
    const app = renderToString(
        <Provider store={store}>
            <CSSProvider insertCss={insertCss}>
                <RouterContext {...renderProps} />
            </CSSProvider>
        </Provider>
    );
    const head = Helmet.rewind();
    const html = renderAppContainer(
        app,
        appConfig.stateSerializer.stringify(store.getState()),
        head.script,
    );
    return serverConfig.renderFullPage ?
        renderFullPage(html, css, head) :
        `<style type="text/css">${css.join('')}</style>${html}`;
}


export default function* rendererMiddleware() {
    this.body = render(this.state.store, this.state.renderProps);
}
