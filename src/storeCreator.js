import {
    compose,
    createStore,
    combineReducers,
    applyMiddleware,
} from 'redux';
import { routeReducer, syncHistory } from 'redux-simple-router';
import { storeEnhancer } from './devTools';

function createRootReducer(app) {
    const reducer = combineReducers({ app });
    // Composing main reducer with route reducer
    // We don't want to nest state from routeReducer
    return (state, action) => (
        reducer(routeReducer(state, action), action)
    );
}

export function clientStoreCreator(reducer, history, initialState) {
    const reduxRouterMiddleware = syncHistory(history);
    // Create Redux store with initial state
    const finalCreateStore = compose(
        applyMiddleware(reduxRouterMiddleware),
        storeEnhancer
    )(createStore);

    return finalCreateStore(
        createRootReducer(reducer),
        initialState
    );
}

export function serverStoreCreator(reducer) {
    return createStore(createRootReducer(reducer));
}
