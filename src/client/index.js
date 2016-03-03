import { render as reactRender } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';

import { createHistory } from 'history';
import { create as createStore } from '../shared/store';
import CSSProvider from '../shared/components/CSSProvider';
import appConfig from '../app_descriptor/app';

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

export function bootstrapClient() {
    // Grab the state from a global injected into server-generated HTML
    const initialState = appConfig.stateSerializer.parse(window.__INITIAL_STATE__);

    const history = useRouterHistory(createHistory)({
        basename: appConfig.basename,
        queryKey: false,
    });
    const store = createStore(history, initialState);

    // Todo replace by fondation-app-hash
    const element = document.getElementById('fondation-app');
    render(history, store, appConfig.routes, element);

    if (module.hot) {
        module.hot.accept('../app_descriptor/app.js', () => {
            const app = require('../app_descriptor/app.js').default;
            store.replaceReducer(app.reducer);
        });
    }
}
