/* eslint-disable import/no-extraneous-dependencies */
import reducers from '__app_modules__redux_reducers__';
import middlewares from '__app_modules__redux_middlewares__';
import actionDispatcher from '__app_modules__server_actionDispatcher__';
/* eslint-enable import/no-extraneous-dependencies */

import { create as createStore } from '../../shared/store';
import render from '../render';
import HTTPStatus from '../components/HTTPStatus';

export default () => function* rendererMiddleware() {
    let mainEntry =
        // eslint-disable-next-line no-undef
        (ASSETS_BY_CHUNK_NAME || this.res.locals.webpackStats.toJson().assetsByChunkName).main;
    mainEntry = Array.isArray(mainEntry) ? mainEntry[0] : mainEntry;

    const routerContext = {};
    const store = createStore(reducers, middlewares);
    const dispatchResult = actionDispatcher(this.request, store.dispatch, store.getState);
    if (dispatchResult) {
        yield dispatchResult;
    }
    this.body = yield render(store, mainEntry, routerContext, this.req.url);
    this.status = HTTPStatus.rewind();
    if (routerContext.url) {
        this.redirect(routerContext.url);
    }
};
