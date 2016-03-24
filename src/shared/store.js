import {
    compose,
    createStore,
    combineReducers,
    applyMiddleware,
} from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { storeEnhancers } from './devTools';

export function createRootReducer(reducers) {
    return combineReducers({ ...reducers, routing: routerReducer });
}

export function create(history, reducers, middlewares, initialState) {
    const createStoreWithMiddleware = compose(
        applyMiddleware(...middlewares, thunk, routerMiddleware(history)),
        ...storeEnhancers
    )(createStore);

    const rootReducer = createRootReducer(reducers);
    const store = createStoreWithMiddleware(rootReducer, initialState);

    return store;
}
