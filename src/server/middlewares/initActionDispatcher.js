// eslint-disable-next-line import/no-extraneous-dependencies
import createInitAction from '__app_modules__server_createInitAction__';

export default () => async (ctx, next) => {
    const { dispatch } = ctx.state.store;
    const action = createInitAction(ctx.request);
    if (action) {
        await dispatch(action);
    }
    await next();
};
