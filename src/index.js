import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import { createHistory } from 'history';
import { create as createStore } from './store';
import CSSProvider from './components/CSSProvider';
import 'babel-polyfill';
import appConfig from './appDescriptor/app';

export function bootstrapClient() {
    // Grab the state from a global injected into server-generated HTML
    const initialState = appConfig.stateSerializer.parse(window.__INITIAL_STATE__);
    const history = createHistory();
    const store = createStore(history, initialState);

    // Enable hot reload of reducers
    // TODO : check if there is no problems with auth reducers

    const insertCss = styles => styles._insertCss();
    render(
        <Provider store={store}>
            <CSSProvider insertCss={insertCss}>
                <Router history={history}>
                    {appConfig.routes}
                </Router>
            </CSSProvider>
        </Provider>,
        document.getElementById('app')
    );
}

export { default as requireAuthentication } from './components/requireAuthentication';


// loginNextState(location: object) => object?
export function loginNextState({ pathname }) {
    // TODO Prevent hardcoded logout URL
    if (pathname === '/logout') {
        return null;
    }
    return { nextPathname: pathname };
}
