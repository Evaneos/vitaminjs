import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import AsyncProps, { loadPropsOnServer } from 'async-props';
import config from '../../../config';
import { stringify as stateStringifier } from '__app_modules__redux_state_serializer__';
import ErrorPage from '__app_modules__server_ErrorPage__';
import jsStringEscape from 'js-string-escape';
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

export const renderError = (error) => {
    const css = [];
    const insertCss = (styles) => css.push(styles._getCss());
    let html;
    try {
        html = renderToString(
            <CSSProvider insertCss={insertCss}>
                <ErrorPage error={error} />
            </CSSProvider>
        );
    } catch (e) {
        html = process.env.NODE_ENV === 'production' ?
            '[VitaminJS] Unable to render error page.'
        :
            `<h2> Error while rendering error page. Check your ErrorPage component. </h2>
                <strong>${e.message}</strong>
                <pre><code>${e.stack}</pre></code>
                <hr>
                <h2> Initial Error </h2>
                <strong>${error.message}</strong>
            <pre><code>${error.stack}</pre></code>`;
    }
    return renderFullPage(html, css, Helmet.rewind());
};

const renderAppContainer = (html, initialState, script) => `
    <div id="${config.rootElementId}">${html}</div>
    <div id="vitamin-assets">
        <script>
            window.__INITIAL_STATE__ = "${jsStringEscape(stateStringifier(initialState))}"
        </script>
        ${script.toString()}
        <script async src="${config.server.externalUrl
            + config.server.basePath
            + config.build.client.publicPath}/${
            config.build.client.filename}"></script>
    </div>
`;

function render(store, renderProps, asyncProps) {
    const css = [];
    const insertCss = (styles) => css.push(styles._getCss());
    const app = renderToString(
        <Provider store={store}>
            <CSSProvider insertCss={insertCss}>
                <AsyncProps {...renderProps} {...asyncProps} />
            </CSSProvider>
        </Provider>
    );

    const head = Helmet.rewind();
    const html = renderAppContainer(
        app,
        store.getState(),
        head.script,
    );
    return config.renderFullPage ?
        renderFullPage(html, css, head) :
        `<style type="text/css">${css.join('')}</style>${html}`;
}

export default () => function* rendererMiddleware() {
    const renderProps = this.state.renderProps;
    const store = this.state.store;
    // Wrap async logic into a thenable to keep holding response until data is loaded, or not.
    yield new Promise((resolve, reject) => {
        loadPropsOnServer(
            renderProps,
            { dispatch: store.dispatch },
            (error, asyncProps) => {
                if (error) {
                    return reject(error);
                }
                try {
                    this.body = render(store, renderProps, asyncProps);
                } catch (e) {
                    return reject(e);
                }
                return resolve();
            }
        );
    });
};
