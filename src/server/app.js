import compose from 'koa-compose';
import etag from 'koa-etag';
import conditional from 'koa-conditional-get';

import renderer, { renderError } from './middlewares/renderer';
import storeCreator from './middlewares/store';
import router from './middlewares/router';
import staticAssetsServer from './middlewares/staticAssetsServer';
import appMiddlewares from '__app_modules__server_middlewares__';
export default compose([
    // Enable Hot Reload when vitamin devServer url differs from app url (externalUrl)
    ...(process.env.NODE_ENV !== 'production' ?
        [function *setCORS(next) { this.set('Access-Control-Allow-Origin', '*'); yield next; }] :
        []
    ),
    conditional(),
    etag(),
    function *errorCatcher(next) {
        try {
            yield next;
        } catch (err) {
            err.status = err.status || 500;
            this.body = renderError(err);
            this.status = err.status;
            this.app.emit('error', err, this);
        }
        if (this.status === 404) {
            this.type = 'html';
            this.body = renderError({ status: 404 });
        }
    },
    ...appMiddlewares,
    staticAssetsServer(),
    storeCreator(),
    router(),
    renderer(),
]);
