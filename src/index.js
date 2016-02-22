import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import { createHistory, useBasename } from 'history';
import { create as createStore } from './store';
import CSSProvider from './components/CSSProvider';
import appConfig from './appDescriptor/app';

export function bootstrapClient() {
    // Grab the state from a global injected into server-generated HTML
    const initialState = appConfig.stateSerializer.parse(window.__INITIAL_STATE__);
    let history = createHistory();
    if (appConfig.basename) {
        history = useBasename(createHistory)({
            basename: appConfig.basename,
        });
    }
    const store = createStore(history, initialState);

    // Enable hot reload of reducers
    // TODO : check if there is no problems with auth reducers
    const RootComponent = appConfig.rootComponent;
    const containerDiv = appConfig.containerDiv ? appConfig.containerDiv : 'app';
    const insertCss = styles => styles._insertCss();
    render(
        <Provider store={store}>
            <CSSProvider insertCss={insertCss}>
                <RootComponent>
                    <Router history={history}>
                        {appConfig.routes}
                    </Router>
                </RootComponent>
            </CSSProvider>
        </Provider>,
        document.getElementById(containerDiv)
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
