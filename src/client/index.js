import { render as reactRender } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';

import { createHistory } from 'history';
import { create as createStore } from '../shared/store';
import CSSProvider from '../shared/components/CSSProvider';
import appConfig from '../app_descriptor/app';

function render(history, store, routes, RootComponent, element) {
    const insertCss = styles => styles._insertCss();
    reactRender(
        <Provider store={store}>
            <CSSProvider insertCss={insertCss}>
                <RootComponent>
                    <Router history={history}>
                        {routes}
                    </Router>
                </RootComponent>
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
        queryKey: false
    });
    const store = createStore(history, initialState);

    const element = document.getElementById(appConfig.containerDiv);
    render(history, store, appConfig.routes, appConfig.rootComponent, element);

    if (module.hot) {
        module.hot.accept('../app_descriptor/app.js', function() {
            let app = require('../app_descriptor/app.js').default;
            // render(history, store, app.routes);
            // Todo : handle the case when stateSerialize changes
        });
    }
}
