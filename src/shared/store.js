import {
    compose,
    createStore,
    combineReducers,
    applyMiddleware,
} from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { storeEnhancers } from './devTools';
import appConfig from '../app_descriptor/app';

function createRootReducer(app) {
    return combineReducers({ ...app, routing: routerReducer });
}

export function create(history, initialState) {
    const createStoreWithMiddleware = compose(
        applyMiddleware(...appConfig.middlewares, thunk, routerMiddleware(history)),
        ...storeEnhancers
    )(createStore);


    const rootReducer = createRootReducer(appConfig.reducer);
    const store = createStoreWithMiddleware(rootReducer, initialState);
    if (module.hot) {
        module.hot.accept('../app_descriptor/app.js', function () {
            const app = require('../app_descriptor/app.js').default;
            console.log(app, store);
            store.replaceReducer(app.reducer);
        });
    }
    return store;
}
