import { createMemoryHistory } from 'react-router';
/* eslint-disable import/no-extraneous-dependencies */
const reducers = require('__app_modules__redux_reducers__');
import middlewares from '__app_modules__redux_middlewares__';
/* eslint-enable import/no-extraneous-dependencies */
import { create as createStore } from '../../shared/store';
import config from '../../../config';

export default () => (ctx, next) => {
    const history = createMemoryHistory({
        basename: config.basePath,
        entries: [ctx.req.url],
    });
    ctx.state.history = history;
    ctx.state.store = createStore(history, reducers.default || reducers, middlewares);
    return next();
};
