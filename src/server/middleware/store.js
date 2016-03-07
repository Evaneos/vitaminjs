import { create as createStore } from '../../shared/store';
import { createMemoryHistory } from 'history';
import appConfig from '../../app_descriptor/shared';

export default function* storeMiddleware(next) {
    const url = this.req.url;
    const history = createMemoryHistory(url);
    this.state.store = createStore(history, appConfig.reducer, appConfig.middlewares);
    yield next;
}
