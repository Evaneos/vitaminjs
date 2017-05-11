import { unmountComponentAtNode, render as reactRender } from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { useBasename } from 'history';
import RedBox from 'redbox-react';
import { Resolver } from 'react-resolver';
import { install as installSourceMapSupport } from 'source-map-support';

/* eslint-disable import/no-extraneous-dependencies */
import routes from '__app_modules__routes__';
import middlewares from '__app_modules__redux_middlewares__';
import { parse as stateParser } from '__app_modules__redux_stateSerializer__';
/* eslint-enable import/no-extraneous-dependencies */

import { create as createStore, createRootReducer } from '../shared/store';
import config from '../../config';
import App from './components/App';

// used require instead of import, because optional default with import cause warnings
// eslint-disable-next-line import/no-extraneous-dependencies
const reducers = require('__app_modules__redux_reducers__');

if (process.env.NODE_ENV !== 'production') {
    installSourceMapSupport({ environment: 'browser' });
}

function render(history, store, appRoutes, element) {
    const insertCss = ({ _insertCss }) => _insertCss();
    Resolver.render(
        () => <App {...{ history, store, routes: appRoutes, insertCss }} />,
        element,
    );
}

function bootstrapClient() {
    // Grab the state from a global injected into server-generated HTML
    const initialState = window.__INITIAL_STATE__ ?
        stateParser(window.__INITIAL_STATE__) :
        {};

    const history = useBasename(() => browserHistory)({ basename: config.basePath });

    const store = createStore(
        history,
        reducers,
        middlewares,
        initialState,
    );

    const syncedHistory = syncHistoryWithStore(history, store);
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

            store.replaceReducer(createRootReducer(newReducers));
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
