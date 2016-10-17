import {
    compose,
    createStore,
    combineReducers,
    applyMiddleware,
} from 'redux';
import thunk from 'redux-thunk';
/* eslint-disable import/no-extraneous-dependencies */
import appEnhancers from '__app_modules__redux_enhancers__';
import devEnhancers from './devTools';

export function createRootReducer(reducers) {
    if (Object.keys(reducers).length === 0) return state => state;
    return combineReducers(reducers);
}

export function create(reducers, middlewares, initialState) {
    const createStoreWithMiddleware = compose(
        applyMiddleware(...middlewares, thunk),
        ...devEnhancers,
        ...appEnhancers,
    )(createStore);

    const rootReducer = createRootReducer(reducers);
    const store = createStoreWithMiddleware(rootReducer, initialState);

    return store;
}
