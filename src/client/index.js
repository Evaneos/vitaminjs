import { render as reactRender, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';

import { createHistory } from 'history';
import { create as createStore, createRootReducer } from '../shared/store';
import CSSProvider from '../shared/components/CSSProvider';
import appConfig from '../app_descriptor/shared';
import buildConfig from '../app_descriptor/build';
import clientConfig from '../app_descriptor/client';

function render(history, store, routes, element) {
    const insertCss = styles => styles._insertCss();
    reactRender(
        <Provider store={store}>
            <CSSProvider insertCss={insertCss}>
                <Router history={history}>
                    {routes}
                </Router>
            </CSSProvider>
        </Provider>,
        element
    );
}


function bootstrapClient() {
    // Grab the state from a global injected into server-generated HTML
    const initialState = appConfig.stateSerializer.parse(window.__INITIAL_STATE__);

    const history = useRouterHistory(createHistory)({
        basename: buildConfig.basename,
        queryKey: false,
    });
    const store = createStore(
        history,
        appConfig.reducer,
        appConfig.middlewares,
        initialState
    );

    // Todo replace by fondation-app-[hash] ?
    let appElement = document.getElementById(appConfig.rootElementId);

    if (module.hot) {
        module.hot.accept('../app_descriptor/shared.js', () => {
            const app = require('../app_descriptor/shared.js').default;
            store.replaceReducer(createRootReducer(app.reducer));
            unmountComponentAtNode(appElement);
            appElement = document.getElementById(appConfig.rootElementId);
            render(history, store, app.routes, appElement);
        });
    }

    render(history, store, appConfig.routes, appElement);
}

clientConfig.init();
bootstrapClient();
