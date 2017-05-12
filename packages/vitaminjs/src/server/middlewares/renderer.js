/* global ASSETS_BY_CHUNK_NAME */
import render from '../render';
import config from '../../../config';

export default () => async (ctx) => {
    const { renderProps, store } = ctx.state;
    let mainEntry =
        (ASSETS_BY_CHUNK_NAME || ctx.res.locals.webpackStats.toJson().assetsByChunkName).main;
    mainEntry = {
        src: `${config.publicPath}/${mainEntry}`,
        async: true,
    };
    let vendorsEntry;
    if (module.hot) {
        vendorsEntry = {
            src: `${config.publicPath}/vendorDLL[HMR].js`,
            async: false,
        };
    }
    ctx.body = await render(renderProps, store, [vendorsEntry, mainEntry].filter(Boolean));
};
