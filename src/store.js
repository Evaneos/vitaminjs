import {
    compose,
    createStore,
    combineReducers,
    applyMiddleware,
} from 'redux';
import { routeReducer, syncHistory } from 'redux-simple-router';
import thunk from 'redux-thunk';
import { storeEnhancers } from './devTools';
import { auth } from './login/reducers';
import appConfig from './appDescriptor/app';

function createRootReducer(app) {
    return combineReducers({ app, auth, routing: routeReducer });
}
let store;
// TODO take reducer directly from app descriptor
export function create(history, initialState) {
    const router = syncHistory(history);
    const createStoreWithMiddleware = compose(
        applyMiddleware(thunk, router),
        ...storeEnhancers
    )(createStore);

    const rootReducer = createRootReducer(appConfig.reducer);

    store = createStoreWithMiddleware(rootReducer, initialState);
    // console.log('jjiojoijoi', store.getState());
    return store;
}

export function replaceReducer(appReducer) {
    store.replaceReducer(createRootReducer(appReducer));
}
