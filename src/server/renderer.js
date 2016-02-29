import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext } from 'react-router';
import appConfig from '../app_descriptor/app';
import CSSProvider from '../shared/components/CSSProvider';

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

function renderBody(store, renderProps, stateSerializer) {
    const css = [];
    const insertCss = (styles) => css.push(styles._getCss());
    const RootComponent = appConfig.rootComponent;
    const html = renderToString(
        <Provider store={store}>
            <CSSProvider insertCss={insertCss}>
                <RootComponent>
                    <RouterContext {...renderProps} />
                </RootComponent>
            </CSSProvider>
        </Provider>
    );
    return renderFullPage(html, stateSerializer.stringify(store.getState()), css);
}


export default function* rendererMiddleware() {
    this.body = renderBody(this.state.store, this.state.renderProps, appConfig.stateSerializer);
}