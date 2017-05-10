import {
    compose,
    createStore,
    combineReducers,
    applyMiddleware,
} from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import {persistStore, autoRehydrate} from 'redux-persist'

import thunk from 'redux-thunk';
/* eslint-disable import/no-extraneous-dependencies */
import appEnhancers from '__app_modules__redux_enhancers__';
import devEnhancers from './devTools';

export function createRootReducer(reducers) {
    return combineReducers({ ...reducers, routing: routerReducer });
}

export function create(history, reducers, middlewares, initialState) {
    const createStoreWithMiddleware = compose(
        applyMiddleware(...middlewares, thunk, routerMiddleware(history)),
        autoRehydrate(),
        ...devEnhancers,
        ...appEnhancers,
    )(createStore);

    const rootReducer = createRootReducer(reducers);
    const store = createStoreWithMiddleware(rootReducer, initialState);
    persistStore(store, {blacklist: ['routing']});
    return store;
}
