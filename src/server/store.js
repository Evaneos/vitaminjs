import { create as createStore } from '../shared/store';
import { createMemoryHistory } from 'history';

export default function* storeMiddleware(next) {
    const url = this.req.url;
    const history = createMemoryHistory(url);
    this.state.store = createStore(history);
    yield next;
}
