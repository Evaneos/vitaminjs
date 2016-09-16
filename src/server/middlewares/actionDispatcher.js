// eslint-disable-next-line import/no-extraneous-dependencies
import actionDispatcher from '__app_modules__server_actionDispatcher__';

export default () => function* actionDispatcherMiddleware(next) {
    const { dispatch, getState } = this.state.store;
    const dispatchResult = actionDispatcher(this.req, dispatch, getState);
    if (dispatchResult) {
        yield dispatchResult;
    }
    yield next;
};
