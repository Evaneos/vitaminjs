import { render as reactRender } from 'react-dom';
import RedBox from 'redbox-react';
import { Resolver } from 'react-resolver';

/* eslint-disable import/no-extraneous-dependencies */
import rootComponent from '__app_modules__routes__';
import reducers from '__app_modules__redux_reducers__';
import middlewares from '__app_modules__redux_middlewares__';
import { parse as stateParser } from '__app_modules__redux_stateSerializer__';
/* eslint-enable import/no-extraneous-dependencies */

import { create as createStore, createRootReducer } from '../shared/store';
import config from '../../config';
import AppContainer from './components/AppContainer';

function bootstrapClient() {
    // Grab the state from a global injected into server-generated HTML
    const initialState = window.__INITIAL_STATE__ ?
        stateParser(window.__INITIAL_STATE__) :
        {};

    const store = createStore(reducers, middlewares, initialState);
    const appElement = window.document.getElementById(config.rootElementId);

    function render(App) {
        const insertCss = ({ _insertCss }) => _insertCss();
        Resolver.render(() =>
            <AppContainer {...{ store, insertCss }}>
                {App}
            </AppContainer>,
            appElement,
        );
    }

    const renderAsync = app => Promise.resolve(app)
        .then(render)
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
            const newReducer = require('__app_modules__redux_reducers__').default;
            store.replaceReducer(createRootReducer(newReducer));
        });
    }

    return renderAsync(rootComponent);
}

bootstrapClient();
