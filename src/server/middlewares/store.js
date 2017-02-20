import { createMemoryHistory } from 'react-router';

/* eslint-disable import/no-extraneous-dependencies */
import middlewares from '__app_modules__redux_middlewares__';
// used require instead of import, because optional default with import cause warnings
const reducers = require('__app_modules__redux_reducers__');
/* eslint-enable import/no-extraneous-dependencies */


/* eslint-disable import/first */
import { create as createStore } from '../../shared/store';
import config from '../../../config';
/* eslint-enable import/first */

export default () => (ctx, next) => {
    const history = createMemoryHistory({
        basename: config.basePath,
        entries: [ctx.req.url],
    });
    ctx.state.history = history;
    ctx.state.store = createStore(history, reducers, middlewares);
    return next();
};
