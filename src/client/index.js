import { render as reactRender, unmountComponentAtNode } from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { createHistory } from 'history';
import { create as createStore, createRootReducer } from '../shared/store';
import config from '../../config';
import init from '__app_modules__init__';
import routes from '__app_modules__routes__';
import reducers from '__app_modules__redux_reducers__';
import middlewares from '__app_modules__redux_middlewares__';
import { parse as stateParser } from '__app_modules__redux_state_serializer__';
import App from '../shared/components/App';

function render(history, store, rootRoute, element) {
    const insertCss = styles => styles._insertCss();

    reactRender(
        <App store={store} insertCss={insertCss}>
            <Router history={history}>{rootRoute}</Router>
        </App>,
        element
    );
}


function bootstrapClient() {
    // Grab the state from a global injected into server-generated HTML
    const initialState = window.__INITIAL_STATE__ ? stateParser(window.__INITIAL_STATE__) : {};

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
    const appElement = document.getElementById(config.rootElementId);

    if (module.hot) {
        const renderError = (error, rootEl) => {
            const RedBox = require('redbox-react');
            reactRender(
                <RedBox error={error} />,
                rootEl
            );
        };
        module.hot.accept('__app_modules__redux_reducers__', () => {
            const newReducer = require('__app_modules__redux_reducers__').default;
            store.replaceReducer(createRootReducer(newReducer));
        });
        module.hot.accept('__app_modules__routes__', () => {
            const newRoutes = require('__app_modules__routes__').default;
            unmountComponentAtNode(appElement);
            try {
                render(syncedHistory, store, newRoutes, appElement);
            } catch (e) {
                renderError(e, appElement);
            }
        });
    }

    render(syncedHistory, store, routes, appElement);
}

init();
bootstrapClient();
