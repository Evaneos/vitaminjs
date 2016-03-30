import { create as createStore } from '../../shared/store';
import { createMemoryHistory, useBasename } from 'history';
import config from '../../../config';
import reducers from '__app_modules__redux_reducers__';
import middlewares from '__app_modules__redux_middlewares__';

export default () => function* storeMiddleware(next) {
    const history = useBasename(createMemoryHistory)({
        basename: config.server.basePath,
        entries: [this.req.url],
    });
    this.state.history = history;
    this.state.store = createStore(history, reducers, middlewares);
    yield next;
};
