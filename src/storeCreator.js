import {
    compose,
    createStore,
    combineReducers,
    applyMiddleware,
} from 'redux';
import { routeReducer, syncHistory } from 'redux-simple-router';
import { storeEnhancer } from './devTools';
import { auth } from './reducers';

function createRootReducer(app) {
    const reducer = combineReducers({ app, auth });
    // Composing main reducer with route reducer
    // We don't want to nest state from routeReducer
    return (state, action) => (
        reducer(routeReducer(state, action), action)
    );
}

export default function storeCreator(reducer, history, initialState) {
    const router = syncHistory(history);
    const middleware = [ router ];
    const createStoreWithMiddleware = compose(
        applyMiddleware(...middleware),
        storeEnhancer
    )(createStore);

    const rootReducer = createRootReducer(reducer);

    return createStoreWithMiddleware(rootReducer, initialState);
}
