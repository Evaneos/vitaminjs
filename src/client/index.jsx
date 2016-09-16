import { render as reactRender, unmountComponentAtNode } from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { createHistory } from 'history';
import RedBox from 'redbox-react';
/* eslint-disable import/no-extraneous-dependencies */
import routes from '__app_modules__routes__';
import reducers from '__app_modules__redux_reducers__';
import middlewares from '__app_modules__redux_middlewares__';
import { parse as stateParser } from '__app_modules__redux_stateSerializer__';
/* eslint-enable import/no-extraneous-dependencies */

import { create as createStore, createRootReducer } from '../shared/store';
import config from '../../config';
import App from '../shared/components/App';

function render(history, store, rootRoute, element) {
    const insertCss = ({ _insertCss }) => _insertCss();

    reactRender(
        <App store={store} insertCss={insertCss}>
            <Router history={history}>{rootRoute}</Router>
        </App>,
        element
    );
}


function bootstrapClient() {
    // Grab the state from a global injected into server-generated HTML
    const initialState = window.__INITIAL_STATE__ ?
        stateParser(window.__INITIAL_STATE__) :
        {};

    const history = useRouterHistory(createHistory)({
        basename: config.server.basePath,
        queryKey: false,
    });
    const store = createStore(
        history,
        reducers,
        middlewares,
        initialState
        );

    const syncedHistory = syncHistoryWithStore(history, store);
    // Todo replace by vitamin-app-[hash] ?
    const appElement = window.document.getElementById(config.rootElementId);
    const passStore = route => (
        typeof route === 'function' ? route(store) : route
    );

    if (module.hot) {
        const renderError = (error, rootEl) => {
            reactRender(
                <RedBox error={error} />,
                rootEl
            );
        };
        module.hot.accept('__app_modules__redux_reducers__', () => {
            // eslint-disable-next-line global-require, import/no-extraneous-dependencies
            const newReducer = require('__app_modules__redux_reducers__').default;

            store.replaceReducer(createRootReducer(newReducer));
        });
        module.hot.accept('__app_modules__routes__', () => {
            // eslint-disable-next-line global-require, import/no-extraneous-dependencies
            const newRoutes = require('__app_modules__routes__').default;

            unmountComponentAtNode(appElement);
            try {
                render(syncedHistory, store, passStore(newRoutes), appElement);
            } catch (e) {
                renderError(e, appElement);
            }
        });
    }
    render(syncedHistory, store, passStore(routes), appElement);
}

bootstrapClient();
