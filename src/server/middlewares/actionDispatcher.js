// eslint-disable-next-line import/no-extraneous-dependencies
import actionDispatcher from '__app_modules__server_actionDispatcher__';

export default () => async (ctx, next) => {
    const { dispatch, getState } = ctx.state.store;
    const dispatchResult = actionDispatcher(ctx.request, dispatch, getState);
    if (dispatchResult) {
        await dispatchResult;
    }
    await next();
};
