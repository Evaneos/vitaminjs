import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createHistory } from 'history';
import storeCreator from './storeCreator';

export function bootstrapClient(appDescriptor) {
    // Grab the state from a global injected into server-generated HTML
    const initialState = window.__INITIAL_STATE__;
    const history = createHistory();
    const store = storeCreator(appDescriptor.reducer, history, initialState);

    render(
        <Provider store={store}>
            <Router history={history}>
                {appDescriptor.routes}
            </Router>
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
