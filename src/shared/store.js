import {
    compose,
    createStore,
    combineReducers,
    applyMiddleware,
} from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { storeEnhancers } from './devTools';

export function createRootReducer(app) {
    return combineReducers({ app, routing: routerReducer });
}

export function create(history, reducer, middlewares, initialState) {
    const createStoreWithMiddleware = compose(
        applyMiddleware(...middlewares, thunk, routerMiddleware(history)),
        ...storeEnhancers
    )(createStore);

    const rootReducer = createRootReducer(reducer);
    const store = createStoreWithMiddleware(rootReducer, initialState);
    return store;
}
