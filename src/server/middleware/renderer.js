import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import AsyncProps, { loadPropsOnServer } from 'async-props';

import appConfig from '../../app_descriptor/shared';
import buildConfig from '../../app_descriptor/build';
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
    <div id="${appConfig.rootElementId}">${html}</div>
    <div id="fondation-assets">
        <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        ${script.toString()}
        <script async src="${buildConfig.basename}${serverConfig.publicUrl
            }/${buildConfig.client.filename}"></script>
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
        appConfig.stateSerializer.stringify(store.getState()),
        head.script,
    );
    return serverConfig.renderFullPage ?
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
                    this.status = 500;
                    this.body = error.message;
                    reject(error); // ?
                    return;
                }
                this.body = render(store, renderProps, asyncProps);
                resolve();
            }
        );
    });
};
