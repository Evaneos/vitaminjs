import {
    compose,
    createStore,
    combineReducers,
    applyMiddleware,
} from 'redux';
import { routeReducers, syncHistory } from 'redux-simple-router';


export function clientStoreCreator(reducer, history, initialState) {
    const mainReducer = combineReducers({
        app: reducer,
        routing: routeReducers,
    });

    const reduxRouterMiddleware = syncHistory(history);
    // Create Redux store with initial state
    const finalCreateStore = compose(
        applyMiddleware(reduxRouterMiddleware),
        typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
    )(createStore);

    return finalCreateStore(mainReducer, initialState);
}

export function serverStoreCreator(reducer) {
    return createStore(combineReducers({
        app: reducer,
    }));
}
