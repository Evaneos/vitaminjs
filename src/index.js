import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { clientStoreCreator } from './storeCreator';
import { createHistory } from 'history';

export function bootstrapClient(appDescriptor) {
    // Grab the state from a global injected into server-generated HTML
    const initialState = window.__INITIAL_STATE__;
    const history = createHistory();
    const store = clientStoreCreator(appDescriptor.reducer, history, initialState);

    render(
        <Provider store={store}>
            <Router history={history}>
                {appDescriptor.routes}
            </Router>
        </Provider>,
        document.getElementById('app')
    );
}
