import { create as createStore } from '../../shared/store';
import { createMemoryHistory, useBasename } from 'history';
import appConfig from '../../app_descriptor/shared';
import buildConfig from '../../app_descriptor/build';

export default () => function* storeMiddleware(next) {
    const history = useBasename(createMemoryHistory)({
        basename: buildConfig.basename,
        entries: [this.req.url],
    });
    this.state.history = history;
    this.state.store = createStore(history, appConfig.reducer, appConfig.middlewares);
    yield next;
};
