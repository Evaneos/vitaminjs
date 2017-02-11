import { createMemoryHistory, useBasename, useQueries } from 'history';
/* eslint-disable import/no-extraneous-dependencies */
import * as reducers from '__app_modules__redux_reducers__';
import middlewares from '__app_modules__redux_middlewares__';
/* eslint-enable import/no-extraneous-dependencies */
import { create as createStore } from '../../shared/store';
import config from '../../../config';

export default () => function* storeMiddleware(next) {
    const history = useQueries(useBasename(createMemoryHistory))({
        basename: config.basePath,
        entries: [this.req.url],
    });
    this.state.history = history;
    this.state.store = createStore(history, reducers.default || reducers, middlewares);
    yield next;
};
