import { render as reactRender, unmountComponentAtNode } from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import AsyncProps from 'async-props';
import { syncHistoryWithStore } from 'react-router-redux';
import { createHistory } from 'history';
import { install as installSourceMapSupport } from 'source-map-support';
import RedBox from 'redbox-react';
/* eslint-disable import/no-extraneous-dependencies */
import routes from '__app_modules__routes__';
import * as reducers from '__app_modules__redux_reducers__';
import middlewares from '__app_modules__redux_middlewares__';
import { parse as stateParser } from '__app_modules__redux_stateSerializer__';
/* eslint-enable import/no-extraneous-dependencies */

import { create as createStore, createRootReducer } from '../shared/store';
import config from '../../config';
import App from '../shared/components/App';

if (process.env.NODE_ENV !== 'production') {
    installSourceMapSupport({ environment: 'browser' });
}

function render(history, store, rootRoute, element) {
    const insertCss = ({ _insertCss }) => _insertCss();

    reactRender(
        <App store={store} insertCss={insertCss}>
            <Router
                history={history}
                render={props =>
                    <AsyncProps {...props} loadContext={{ dispatch: store.dispatch }} />
                }
            >{rootRoute}</Router>
        </App>,
        element,
    );
}

function bootstrapClient() {
    // Grab the state from a global injected into server-generated HTML
    const initialState = window.__INITIAL_STATE__ ?
        stateParser(window.__INITIAL_STATE__) :
        {};

    const history = useRouterHistory(createHistory)({
        basename: config.basePath,
        queryKey: false,
    });
    const store = createStore(
        history,
        reducers.default || reducers,
        middlewares,
        initialState,
    );

    const syncedHistory = syncHistoryWithStore(history, store);
    // Todo replace by vitamin-app-[hash] ?
    const appElement = window.document.getElementById(config.rootElementId);

    const renderWithRoutes = appRoutes => Promise.resolve()
        .then(() => (typeof appRoutes === 'function' ? appRoutes(store) : appRoutes))
        .then(loadedAppRoutes => render(syncedHistory, store, loadedAppRoutes, appElement))
        .catch((err) => {
            if (process.env.NODE_ENV !== 'production') {
                reactRender(<RedBox error={err} />, appElement);
            } else {
                throw err;
            }
        });

    if (module.hot && process.env.NODE_ENV !== 'production') {
        module.hot.accept('__app_modules__redux_reducers__', () => {
            // eslint-disable-next-line global-require, import/no-extraneous-dependencies
            const newReducers = require('__app_modules__redux_reducers__');

            store.replaceReducer(createRootReducer(newReducers.default || newReducers));
        });
        module.hot.accept('__app_modules__routes__', () => {
            // eslint-disable-next-line global-require, import/no-extraneous-dependencies
            const newRoutes = require('__app_modules__routes__').default;

            unmountComponentAtNode(appElement);
            renderWithRoutes(newRoutes);
        });
    }

    return renderWithRoutes(routes);
}

bootstrapClient();
