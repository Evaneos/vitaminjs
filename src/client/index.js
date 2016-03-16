import { render as reactRender, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { create as createStore, createRootReducer } from '../shared/store';
import CSSProvider from '../shared/components/CSSProvider';
import config from '../config';
import init from '__app_modules__init__';
import routes from '__app_modules__routes__';
import reducer from '__app_modules__redux_reducer__';
import middlewares from '__app_modules__redux_middlewares__';
import { parse as stateParser } from '__app_modules__redux_state_serializer__';

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
    const initialState = stateParser(window.__INITIAL_STATE__);

    const history = useRouterHistory(createHistory)({
        basename: config.server.basePath,
        queryKey: false,
    });
    const store = createStore(
        history,
        reducer,
        middlewares,
        initialState
        );

    // Todo replace by fondation-app-[hash] ?
    const appElement = document.getElementById(config.rootElementId);

    if (module.hot) {
        const renderError = (error, rootEl) => {
            const RedBox = require('redbox-react');
            reactRender(
                <RedBox error={error} />,
                rootEl
            );
        };
        module.hot.accept('__app_modules__redux_reducer__', () => {
            const newReducer = require('__app_modules__redux_reducer__').default;
            store.replaceReducer(createRootReducer(newReducer));
        });
        module.hot.accept('__app_modules__routes__', () => {
            const newRoutes = require('__app_modules__routes__').default;
            unmountComponentAtNode(appElement);
            try {
                render(history, store, newRoutes, appElement);
            } catch (e) {
                renderError(e, appElement);
            }
        });
    }

    render(history, store, routes, appElement);
}

init();
bootstrapClient();
